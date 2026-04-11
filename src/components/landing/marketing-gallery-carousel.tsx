"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

import { isSupabaseStorageUrl } from "@/lib/marketing-data";

export type GalleryCarouselTile = {
  src: string;
  alt: string;
  title: string;
  body: string;
};

type MarketingGalleryCarouselProps = {
  tiles: GalleryCarouselTile[];
  prevLabel: string;
  nextLabel: string;
};

const VISIBLE = 3;

export function MarketingGalleryCarousel({ tiles, prevLabel, nextLabel }: MarketingGalleryCarouselProps) {
  const n = tiles.length;
  const [start, setStart] = useState(0);

  const goPrev = useCallback(() => {
    if (n <= 1) return;
    setStart((s) => (s - 1 + n) % n);
  }, [n]);

  const goNext = useCallback(() => {
    if (n <= 1) return;
    setStart((s) => (s + 1) % n);
  }, [n]);

  const visibleTiles = useMemo(() => {
    if (n === 0) return [];
    const count = Math.min(VISIBLE, n);
    return Array.from({ length: count }, (_, i) => tiles[(start + i) % n]);
  }, [tiles, n, start]);

  if (n === 0) return null;

  const showControls = n > 1;

  return (
    <div className="relative">
      <div className="flex items-stretch justify-center gap-3 md:gap-4">
        {showControls ? (
          <button
            type="button"
            onClick={goPrev}
            aria-label={prevLabel}
            className="hidden shrink-0 self-center md:flex md:h-11 md:w-11 md:items-center md:justify-center md:rounded-full md:border md:border-white/12 md:bg-white/[0.04] md:text-white/80 md:transition md:hover:border-white/20 md:hover:bg-white/[0.08] md:hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}

        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTiles.map((tile, idx) => (
            <article
              key={`${tile.src}-${start}-${idx}`}
              className="flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                width={900}
                height={1125}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="aspect-[4/5] w-full object-cover"
                unoptimized={isSupabaseStorageUrl(tile.src)}
                quality={isSupabaseStorageUrl(tile.src) ? undefined : 90}
              />
              <div className="p-5">
                <h3 className="text-base font-semibold tracking-tight text-white">{tile.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{tile.body}</p>
              </div>
            </article>
          ))}
        </div>

        {showControls ? (
          <button
            type="button"
            onClick={goNext}
            aria-label={nextLabel}
            className="hidden shrink-0 self-center md:flex md:h-11 md:w-11 md:items-center md:justify-center md:rounded-full md:border md:border-white/12 md:bg-white/[0.04] md:text-white/80 md:transition md:hover:border-white/20 md:hover:bg-white/[0.08] md:hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      {showControls ? (
        <div className="mt-8 flex items-center justify-center gap-6 md:hidden">
          <button
            type="button"
            onClick={goPrev}
            aria-label={prevLabel}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-[13px] tabular-nums text-zinc-500">
            {start + 1} / {n}
          </span>
          <button
            type="button"
            onClick={goNext}
            aria-label={nextLabel}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M9 18l6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
