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
    <div className="border flex flex-col rounded-none p-4 space-y-3">
      <div className="grid grid-cols-4 gap-6">
        <div className="h-full col-span-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div>
          <Skeleton className="overflow-hidden w-full h-full max-h-29 relative"></Skeleton>
        </div>
      </div>
      
      <div className="grid grid-cols-4 place-items-center pt-2 gap-2 text-xs text-muted-foreground">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>

      <div className="flex flex-row-reverse mt-4 gap-2 min-h-5.5">
        <Skeleton className="h-6.5 w-16" />
        <Skeleton className="h-6.5 w-20" />
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
