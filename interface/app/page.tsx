"use client";

import { useEffect, useRef, useState } from "react";

const BATCH_SIZE = 24;

export default function VideosPage() {
  const [allVideos, setAllVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const loaderRef = useRef(null);
  const cursorRef = useRef(0);

  // Fetch JSON once
  useEffect(() => {
    fetch("/exports/liked_videos_all.json")
      .then(res => res.json())
      .then(data => {
        setAllVideos(data);
        setVisibleVideos(data.slice(0, BATCH_SIZE));
        cursorRef.current = BATCH_SIZE;
      })
      .catch(err => console.error("Failed to load videos", err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "100px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [allVideos]);

  const loadMore = () => {
    const start = cursorRef.current;
    const end = start + BATCH_SIZE;

    const nextBatch = allVideos.slice(start, end);

    cursorRef.current = end;

    setVisibleVideos(prev => [...prev, ...nextBatch]);
  };

  return (
    <main className="p-12 pb-64 flex flex-col gap-8">
      <h1 className="pb-12 font-semibold text-xl">Liked Videos</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
        {visibleVideos.map((video: any) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      <div ref={loaderRef}>
        <p className="text-center">Loading more...</p>
      </div>
    </main>
  );
}

function VideoCard({ video }: { video: any }) {
  return (
    <article className="bg-zinc-100 rounded-md p-3 flex flex-col justify-between">
      <img
        src={video.video?.cover}
        alt={video.desc}
        className="aspect-auto max-w-full rounded-md"
        loading="lazy"
      />

      <div className="flex flex-col gap-2">
        <strong>{video.author?.nickname}</strong>
        <p className="truncate">{video.desc}</p>
        <span>❤️ {video.stats?.diggCount}</span>
      </div>
    </article>
  );
}
