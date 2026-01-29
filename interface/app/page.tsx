"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { FiltersSidebar } from "@/components/filters-sidebar";
import { MobileFilters } from "@/components/mobile-filters";
import { VideoGrid } from "@/components/video-grid";
import {
  useVideos,
  useVideoMetadata,
  useVideoFilters,
  useInfiniteScroll,
} from "@/hooks/use-videos";

export default function VideosPage() {
  const { allVideos, isLoading, error } = useVideos();

  const {
    filters,
    filteredVideos,
    setSelectedAuthor,
    setSelectedHashtag,
    setAdOnly,
    setDateRange,
    setDurationRange,
    resetFilters,
    durationBounds,
  } = useVideoFilters(allVideos);

  // Pass selected filters for cross-filtering options
  const { authorOptions, hashtagOptions, dateBounds } = useVideoMetadata(
    allVideos,
    filters.selectedAuthor,
    filters.selectedHashtag,
  );

  const { visibleVideos, allVisible, loaderRef } =
    useInfiniteScroll(filteredVideos);

  const filterProps = {
    filters,
    authorOptions,
    hashtagOptions,
    durationBounds,
    dateBounds,
    onAuthorChange: setSelectedAuthor,
    onHashtagChange: setSelectedHashtag,
    onAdOnlyChange: setAdOnly,
    onDateRangeChange: setDateRange,
    onDurationRangeChange: setDurationRange,
    onReset: resetFilters,
    totalCount: allVideos.length,
    filteredCount: filteredVideos.length,
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <header className="border-b h-16 bg-background fixed top-0 z-50 w-full">
        <div className="h-full flex items-center justify-between gap-4 px-4 md:px-6">
          <h1 className="text-xl font-bold">TikData</h1>
          <div className="flex items-center gap-2">
            <MobileFilters {...filterProps} />
          </div>
        </div>
      </header>

      <main className="xl:flex xl:gap-0">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] xl:block w-80 shrink-0 border-r">
          <ScrollArea className="h-full">
            <nav className="px-6 py-6">
              <FiltersSidebar {...filterProps} />
            </nav>
          </ScrollArea>
        </aside>

        <div className="relative top-16 min-w-0 flex-1 pb-32 pt-6 px-4">
          <div className="mx-auto">
            <VideoGrid
              videos={visibleVideos}
              allVisible={allVisible}
              loaderRef={loaderRef}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
