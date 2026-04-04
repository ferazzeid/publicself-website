type LandingMidCtaProps = {
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
};

export function LandingMidCta({ title, body, ctaLabel, href }: LandingMidCtaProps) {
  return (
    <aside className="border-b border-white/10 bg-zinc-900/80 px-6 py-16 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
        <p className="mt-4 text-lg leading-8 text-zinc-400">{body}</p>
        <a
          href={href}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-amber-500 px-8 text-sm font-black uppercase tracking-[0.18em] text-zinc-950 transition hover:bg-amber-400"
        >
          {ctaLabel}
        </a>
      </div>
    </aside>
  );
}
