import type { FaqItem } from "@/lib/landingDeepParse";

type LandingFaqProps = {
  id: string;
  h2: string;
  intro?: string;
  items: FaqItem[];
};

export function LandingFaq({ id, h2, intro, items }: LandingFaqProps) {
  if (!items.length) return null;

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
        {intro ? <p className="mt-5 text-lg leading-8 text-zinc-400">{intro}</p> : null}
        <div className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] px-2">
          {items.map((item, i) => (
            <details key={i} className="group px-4 py-2">
              <summary className="cursor-pointer list-none py-4 text-lg font-bold text-white marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-zinc-500 transition group-open:rotate-180">▼</span>
                </span>
              </summary>
              <p className="pb-5 pl-0 text-base leading-7 text-zinc-300">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
