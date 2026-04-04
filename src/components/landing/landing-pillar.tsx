import Image from "next/image";

import type { LandingRichBlock } from "@/lib/landingDeepParse";
import { isSupabaseStorageUrl } from "@/lib/marketing-data";

type LandingPillarProps = {
  id: string;
  h2: string;
  lead: string;
  blocks: LandingRichBlock[];
  imageSrc: string;
  imageAlt: string;
  imageRight: boolean;
};

export function LandingPillar({
  id,
  h2,
  lead,
  blocks,
  imageSrc,
  imageAlt,
  imageRight,
}: LandingPillarProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-b border-white/10 bg-zinc-950 px-6 py-20 sm:px-10 lg:px-12"
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={imageRight ? "order-1" : "order-1 lg:order-2"}>
          <h2 id={`${id}-heading`} className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {h2}
          </h2>
          {lead ? <p className="mt-5 text-lg font-medium leading-8 text-zinc-400">{lead}</p> : null}
          <div className="mt-10 space-y-10 text-lg leading-8 text-zinc-300">
            {blocks.map((block, i) => (
              <div key={i}>
                <h3 className="text-xl font-bold tracking-tight text-white">{block.h3}</h3>
                {block.paragraphs.map((p, j) => (
                  <p key={j} className="mt-4">
                    {p}
                  </p>
                ))}
                {block.bullets && block.bullets.length > 0 ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    {block.bullets.map((b, k) => (
                      <li key={k}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className={imageRight ? "order-2" : "order-2 lg:order-1"}>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 shadow-xl">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized={isSupabaseStorageUrl(imageSrc)}
                quality={isSupabaseStorageUrl(imageSrc) ? undefined : 90}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
