"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Play, Clock } from "lucide-react";
import type { Video } from "@/types/video";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";
import Image from "next/image";

interface VideoCardProps {
  video: Video;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDate(timestamp: number): string {
  if (!timestamp) return "";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function VideoCard({ video }: VideoCardProps) {
  const hashtags = video.textExtra
    ?.filter((extra) => extra.hashtagName)
    .slice(0, 3);

  return (
    <div className="border flex flex-col rounded-none p-4 space-y-3">
      <div className="grid grid-cols-4 gap-6">
        <div className="h-full col-span-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm truncate">
              {video.author?.nickname || "Unknown"}
            </span>
            {video.isAd && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                Ad
              </Badge>
            )}
          </div>

          {video.createTime && (
            <p className="text-xs align-top text-muted-foreground">
              {formatDate(video.createTime)}
              {video.video?.duration > 0 && (
                <span> / {formatDuration(video.video?.duration)} min</span>
              )}
            </p>
          )}

          <p className="h-10 w-full text-sm text-muted-foreground line-clamp-2 min-h-10">
            {video.desc || "No description"}
          </p>
        </div>

        <div className="rounded overflow-hidden w-full h-full max-h-29 relative">
          <Image
            src={video.video?.cover}
            alt="Video cover"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 place-items-center pt-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Heart className="h-3 w-3" />
          <span>{formatNumber(video.stats?.diggCount || 0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          <span>{formatNumber(video.stats?.commentCount || 0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="h-3 w-3" />
          <span>{formatNumber(video.stats?.shareCount || 0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Play className="h-3 w-3" />
          <span>{formatNumber(video.stats?.playCount || 0)}</span>
        </div>
      </div>

      <div className="flex flex-row-reverse mt-4 gap-1 min-h-5.5">
        {hashtags && hashtags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((extra, index) => (
              <Badge
                key={`${extra.hashtagName}-${index}`}
                variant="outline"
                className="text-xs rounded-none py-1"
              >
                #{extra.hashtagName}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-[10px] mt-auto opacity-25">
            video doesn't have hashtags
          </span>
        )}
      </div>
    </div>
  );
}
