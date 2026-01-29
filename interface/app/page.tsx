"use client";

import { useEffect, useRef, useState } from "react";

const BATCH_SIZE = 48;

export default function VideosPage() {
  const [allVideos, setAllVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [allVisible, setAllVisible] = useState<boolean>(false);
  const loaderRef = useRef(null);
  const cursorRef = useRef(0);

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
    if (allVisible) return;

    const start = cursorRef.current;
    const end = start + BATCH_SIZE;
    const nextBatch = allVideos.slice(start, end);
    cursorRef.current = end;

    if (allVideos.length !== 0 && end >= allVideos.length) {
      setAllVisible(true)
    }

    setVisibleVideos(prev => [...prev, ...nextBatch]);
  };

  return (
    <div className="relative">
      <header className="border-b border-neutral-800 h-16 bg-neutral-900 fixed top-0 z-50 w-full">
        <div className="hidden h-full grid-cols-[1fr_3fr_1fr] items-center gap-4 md:grid max-w-full py-3 px-6 w-full mx-auto">
          <div>TikData</div>
          <div className="mx-auto flex w-full">x</div>
          <div className="flex items-center gap-2 justify-self-end">r</div>
        </div>

        <div className="flex h-full items-center md:hidden justify-between max-w-full py-6 px-4 w-full mx-auto pt-8">
          <div className="flex items-center gap-1">
            TikData
          </div>
          <div className="flex items-center gap-1">
            x
          </div>
        </div>
      </header>

      <main className="xl:flex xl:gap-0">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-hidden xl:block w-90">
          <nav className="w-90 overflow-y-auto px-6 pt-8">
            <p className="text-sm">Total videos rendered: {visibleVideos.length} of {allVideos.length}</p>
          </nav>
        </aside>

        <div className="relative top-16 min-w-0 flex-1 pb-32 pt-8 px-4">
          <div className="mx-auto">
            <div className="col-span-5">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                {visibleVideos.map((video: any) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>

              {!allVisible ? (
                <div ref={loaderRef}>
                  <p className="text-center">Loading more...</p>
                </div>
              ) : <></>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function VideoCard({ video }: { video: any }) {
  return (
    <article className="border border-neutral-800 rounded-md p-3 flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <strong>{video.author?.nickname}</strong>
        <p className="truncate">{video.desc}</p>
        <span>❤️ {video.stats?.diggCount}</span>
      </div>
    </article>
  );
}
