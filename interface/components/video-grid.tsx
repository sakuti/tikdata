"use client";

import type { RefObject } from "react";
import { VideoCard } from "./video-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Video } from "@/types/video";

interface VideoGridProps {
  videos: Video[];
  allVisible: boolean;
  loaderRef: RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
}

function VideoCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-10" />
      </div>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-10 w-full" />
      <div className="flex gap-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="grid grid-cols-4 pt-2 gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export function VideoGrid({
  videos,
  allVisible,
  loaderRef,
  isLoading,
}: VideoGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: 32 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No videos found
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-svh">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {videos.map((video, index) => (
          <VideoCard key={`${video.id}-${index}`} video={video} />
        ))}
      </div>

      {!allVisible && (
        <div ref={loaderRef} className="py-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
