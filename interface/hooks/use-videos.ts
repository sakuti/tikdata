"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type {
  Video,
  AuthorOption,
  HashtagOption,
  VideoFilters,
  DateRange,
} from "@/types/video";

const BATCH_SIZE = 48;
const MIN_HASHTAG_COUNT = 5;

export function useVideos() {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/exports/liked_videos_all.json")
      .then((res) => res.json())
      .then((data) => {
        setAllVideos(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load videos", err);
        setError("Failed to load videos");
        setIsLoading(false);
      });
  }, []);

  return { allVideos, isLoading, error };
}

export function useVideoMetadata(
  videos: Video[],
  selectedAuthor: string | null = null,
  selectedHashtag: string | null = null,
) {
  // Filter videos by selected hashtag to compute author options
  const videosForAuthors = useMemo(() => {
    if (!selectedHashtag) return videos;
    return videos.filter((video) =>
      video.textExtra?.some(
        (extra) =>
          extra.hashtagName?.toLowerCase() === selectedHashtag.toLowerCase(),
      ),
    );
  }, [videos, selectedHashtag]);

  // Filter videos by selected author to compute hashtag options
  const videosForHashtags = useMemo(() => {
    if (!selectedAuthor) return videos;
    return videos.filter((video) => video.author?.uniqueId === selectedAuthor);
  }, [videos, selectedAuthor]);

  const authorOptions = useMemo<AuthorOption[]>(() => {
    const authorCounts = new Map<string, { nickname: string; count: number }>();

    videosForAuthors.forEach((video) => {
      if (video.author?.uniqueId) {
        const existing = authorCounts.get(video.author.uniqueId);
        if (existing) {
          existing.count++;
        } else {
          authorCounts.set(video.author.uniqueId, {
            nickname: video.author.nickname || video.author.uniqueId,
            count: 1,
          });
        }
      }
    });

    return Array.from(authorCounts.entries())
      .map(([uniqueId, { nickname, count }]) => ({
        value: uniqueId,
        label: `${nickname} (${count} ${count === 1 ? "video" : "videos"})`,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [videosForAuthors]);

  const hashtagOptions = useMemo<HashtagOption[]>(() => {
    const hashtagCounts = new Map<string, number>();

    videosForHashtags.forEach((video) => {
      video.textExtra?.forEach((extra) => {
        if (extra.hashtagName) {
          const name = extra.hashtagName.toLowerCase();
          hashtagCounts.set(name, (hashtagCounts.get(name) || 0) + 1);
        }
      });
    });

    return Array.from(hashtagCounts.entries())
      .filter(([, count]) => count >= MIN_HASHTAG_COUNT)
      .map(([hashtag, count]) => ({
        value: hashtag,
        label: `#${hashtag} (${count})`,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [videosForHashtags]);

  const dateBounds = useMemo(() => {
    if (videos.length === 0) return { min: undefined, max: undefined };

    const timestamps = videos.map((v) => v.createTime).filter((t) => t > 0);

    if (timestamps.length === 0) return { min: undefined, max: undefined };

    return {
      min: new Date(Math.min(...timestamps) * 1000),
      max: new Date(Math.max(...timestamps) * 1000),
    };
  }, [videos]);

  const durationBounds = useMemo(() => {
    if (videos.length === 0) return { min: 0, max: 300 };

    const durations = videos
      .map((v) => v.video?.duration || 0)
      .filter((d) => d > 0);

    if (durations.length === 0) return { min: 0, max: 300 };

    return {
      min: Math.min(...durations),
      max: Math.max(...durations),
    };
  }, [videos]);

  return { authorOptions, hashtagOptions, dateBounds, durationBounds };
}

export function useVideoFilters(videos: Video[]) {
  const durationBounds = useMemo(() => {
    if (videos.length === 0) return { min: 0, max: 300 };

    const durations = videos
      .map((v) => v.video?.duration || 0)
      .filter((d) => d > 0);

    if (durations.length === 0) return { min: 0, max: 300 };

    return {
      min: Math.min(...durations),
      max: Math.max(...durations),
    };
  }, [videos]);

  const [filters, setFilters] = useState<VideoFilters>({
    selectedAuthor: null,
    selectedHashtag: null,
    adOnly: false,
    dateRange: { from: undefined, to: undefined },
    durationRange: [0, 300], // Initial values, will be updated by effect
  });

  // Update duration range when bounds change (on initial load)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      durationRange: [durationBounds.min, durationBounds.max],
    }));
  }, [durationBounds.min, durationBounds.max]);

  const setSelectedAuthor = useCallback((author: string | null) => {
    setFilters((prev) => ({ ...prev, selectedAuthor: author }));
  }, []);

  const setSelectedHashtag = useCallback((hashtag: string | null) => {
    setFilters((prev) => ({ ...prev, selectedHashtag: hashtag }));
  }, []);

  const setAdOnly = useCallback((adOnly: boolean) => {
    setFilters((prev) => ({ ...prev, adOnly }));
  }, []);

  const setDateRange = useCallback((dateRange: DateRange) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  }, []);

  const setDurationRange = useCallback((durationRange: [number, number]) => {
    setFilters((prev) => ({ ...prev, durationRange }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      selectedAuthor: null,
      selectedHashtag: null,
      adOnly: false,
      dateRange: { from: undefined, to: undefined },
      durationRange: [durationBounds.min, durationBounds.max],
    });
  }, [durationBounds.min, durationBounds.max]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // Author filter
      if (
        filters.selectedAuthor &&
        video.author?.uniqueId !== filters.selectedAuthor
      ) {
        return false;
      }

      // Hashtag filter
      if (filters.selectedHashtag) {
        const hasHashtag = video.textExtra?.some(
          (extra) =>
            extra.hashtagName?.toLowerCase() ===
            filters.selectedHashtag?.toLowerCase(),
        );
        if (!hasHashtag) return false;
      }

      // Ad filter
      if (filters.adOnly && !video.isAd) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const videoDate = new Date(video.createTime * 1000);
        if (filters.dateRange.from && videoDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to) {
          const endOfDay = new Date(filters.dateRange.to);
          endOfDay.setHours(23, 59, 59, 999);
          if (videoDate > endOfDay) {
            return false;
          }
        }
      }

      // Duration filter
      const duration = video.video?.duration || 0;
      if (
        duration < filters.durationRange[0] ||
        duration > filters.durationRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [videos, filters]);

  return {
    filters,
    filteredVideos,
    setSelectedAuthor,
    setSelectedHashtag,
    setAdOnly,
    setDateRange,
    setDurationRange,
    resetFilters,
    durationBounds,
  };
}

export function useInfiniteScroll(
  filteredVideos: Video[],
  batchSize: number = BATCH_SIZE,
) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Reset visible count when filtered videos change
  useEffect(() => {
    setVisibleCount(batchSize);
  }, [filteredVideos, batchSize]);

  const visibleVideos = useMemo(
    () => filteredVideos.slice(0, visibleCount),
    [filteredVideos, visibleCount],
  );

  const allVisible = visibleCount >= filteredVideos.length;

  const loadMore = useCallback(() => {
    if (allVisible) return;
    setVisibleCount((prev) =>
      Math.min(prev + batchSize, filteredVideos.length),
    );
  }, [allVisible, batchSize, filteredVideos.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "100px" },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return { visibleVideos, allVisible, loaderRef };
}
