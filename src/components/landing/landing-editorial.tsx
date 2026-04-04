import type { LandingRichBlock } from "@/lib/landingDeepParse";

type LandingEditorialProps = {
  id: string;
  h2: string;
  lead: string;
  blocks: LandingRichBlock[];
};

export function LandingEditorial({ id, h2, lead, blocks }: LandingEditorialProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-b border-white/10 bg-zinc-950 px-6 py-20 sm:px-10 lg:px-12"
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-3xl">
        <h2 id={`${id}-heading`} className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          {h2}
        </h2>
        <p className="mt-5 text-lg font-medium leading-8 text-zinc-400">{lead}</p>
        <div className="mt-12 space-y-12 text-lg leading-8 text-zinc-300">
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
    </section>
  );
}
