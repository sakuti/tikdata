"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  Video as VideoIcon,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { Video } from "@/types/video";

function getProxyUrl(url: string): string {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
}

interface MediaEmbedProps {
  video: Video;
}

async function downloadFile(url: string, filename: string, useProxy = false) {
  try {
    const fetchUrl = useProxy ? getProxyUrl(url) : url;
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback: open in new tab
    window.open(url, "_blank");
  }
}

async function downloadImagesAsZip(
  images: string[],
  zipFilename: string,
): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  const downloadPromises = images.map(async (url, index) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const extension = blob.type.includes("png") ? "png" : "jpg";
      zip.file(`image_${index + 1}.${extension}`, blob);
    } catch (error) {
      console.error(`Failed to download image ${index + 1}:`, error);
    }
  });

  await Promise.all(downloadPromises);

  const content = await zip.generateAsync({ type: "blob" });
  const blobUrl = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = zipFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

export function MediaEmbed({ video }: MediaEmbedProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const videoUrl = video.video?.playAddr;
  const images =
    video.imagePost?.images
      ?.map((img) => img.imageURL?.urlList?.[0])
      .filter(Boolean) || [];

  const hasVideo = !!videoUrl;
  const hasImages = images.length > 0;

  const handleDownloadVideo = useCallback(async () => {
    if (!videoUrl) return;
    setIsDownloading(true);
    try {
      // Use proxy for video downloads to bypass CORS
      await downloadFile(videoUrl, `${video.id}_video.mp4`, true);
    } finally {
      setIsDownloading(false);
    }
  }, [videoUrl, video.id]);

  const handleDownloadCurrentImage = useCallback(async () => {
    if (!images[currentImageIndex]) return;
    setIsDownloading(true);
    try {
      await downloadFile(
        images[currentImageIndex],
        `${video.id}_image_${currentImageIndex + 1}.jpg`,
      );
    } finally {
      setIsDownloading(false);
    }
  }, [images, currentImageIndex, video.id]);

  const handleDownloadAllImages = useCallback(async () => {
    if (images.length === 0) return;
    setIsDownloading(true);
    try {
      await downloadImagesAsZip(images, `${video.id}_images.zip`);
    } finally {
      setIsDownloading(false);
    }
  }, [images, video.id]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (!hasVideo && !hasImages) {
    return (
      <div className="flex items-center justify-center h-48 rounded-lg border bg-muted/50">
        <p className="text-sm text-muted-foreground">No media available</p>
      </div>
    );
  }

  const defaultTab = hasVideo ? "video" : "images";

  return (
    <div className="space-y-3 h-full">
      <Tabs defaultValue={defaultTab} className="w-full h-full">
        {hasVideo && hasImages && (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video" className="gap-2">
              <VideoIcon className="h-4 w-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="images" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Images ({images.length})
            </TabsTrigger>
          </TabsList>
        )}

        {hasVideo && (
          <TabsContent value="video" className="mt-3 space-y-3">
            <div className="relative aspect-9/16 max-h-100 w-full overflow-hidden rounded-lg bg-black">
              <video
                src={getProxyUrl(videoUrl)}
                controls
                playsInline
                className="h-full w-full object-contain"
              >
                <track kind="captions" />
              </video>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 bg-transparent"
              onClick={handleDownloadVideo}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download Video
            </Button>
          </TabsContent>
        )}

        {hasImages && (
          <TabsContent value="images" className="mt-3 space-y-3">
            <div className="relative aspect-9/16 max-h-100 w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`Image ${currentImageIndex + 1} of ${images.length}`}
                fill
                className="object-contain"
                unoptimized
              />

              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous image</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next image</span>
                  </Button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-background/80 px-2 py-1 backdrop-blur-sm">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? "bg-foreground"
                            : "bg-muted-foreground/50"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {images.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 bg-transparent"
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Download Images
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuItem onClick={handleDownloadCurrentImage}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Current Image ({currentImageIndex + 1})
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadAllImages}>
                      <Download className="h-4 w-4 mr-2" />
                      All Images as ZIP
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 bg-transparent"
                  onClick={handleDownloadCurrentImage}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download Image
                </Button>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
