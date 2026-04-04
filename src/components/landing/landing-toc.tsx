import type { TocItem } from "@/lib/landingDeepParse";

type LandingTocProps = {
  ariaLabel: string;
  title: string;
  items: TocItem[];
};

export function LandingToc({ ariaLabel, title, items }: LandingTocProps) {
  if (!items.length) return null;

  return (
    <nav
      className="border-b border-white/10 bg-zinc-950 px-6 py-8 sm:px-10 lg:px-12"
      aria-label={ariaLabel}
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/50">{title}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {items.map((item) => (
            <li key={item.anchor}>
              <a
                href={`#${item.anchor}`}
                className="font-semibold text-amber-400/95 underline-offset-4 hover:text-amber-300 hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
