"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type MarketingSliderSlide = {
  src: string;
  alt: string;
  caption: string;
};

type MarketingScreenshotSliderProps = {
  slides: MarketingSliderSlide[];
  prevLabel: string;
  nextLabel: string;
};

export function MarketingScreenshotSlider({ slides, prevLabel, nextLabel }: MarketingScreenshotSliderProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (count === 0) return null;

  const slide = slides[index];

  return (
    <div className="relative mx-auto w-full max-w-5xl px-2">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] bg-zinc-900/80 shadow-[0_32px_64px_rgba(0,0,0,0.28)] ring-1 ring-white/[0.06]">
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-contain object-center"
          priority={index === 0}
        />
      </div>

      <p className="mt-7 text-center text-[15px] font-medium leading-relaxed tracking-[-0.01em] text-zinc-400 md:text-base">
        {slide.caption}
      </p>

      <div className="mt-10 flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={goPrev}
          aria-label={prevLabel}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="min-w-[3.5rem] text-center text-[13px] tabular-nums tracking-wide text-zinc-500">
          {index + 1} / {count}
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
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
