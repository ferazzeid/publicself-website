import Image from "next/image";
import Link from "next/link";

import { DocumentLang } from "@/components/document-lang";
import { LanguageSwitcher } from "@/components/landing/language-switcher";
import { MarketingScreenshotSlider } from "@/components/landing/marketing-screenshot-slider";
import { MarketingGalleryCarousel } from "@/components/landing/marketing-gallery-carousel";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingJsonLd } from "@/components/landing/landing-json-ld";
import { LandingPillar } from "@/components/landing/landing-pillar";
import { getMessages } from "@/lib/content";
import { CREDIT_PACKS_LIST } from "@/lib/credit-packs";
import {
  howItWorksImages,
  marketingHeroScreenshot,
  marketingProductSlides,
  showcaseImages,
} from "@/lib/landing-assets";
import {
  isRecord,
  parseFaqItems,
  parsePillar,
  parseRichBlocks,
} from "@/lib/landingDeepParse";
import { buildLandingJsonLd } from "@/lib/landingStructuredData";
import { isSupabaseStorageUrl, pickVariantUrl, type ShowcaseImageRow } from "@/lib/marketing-data";
import { getLocalizedProductUrl, MARKETING_SITE_URL, type Locale } from "@/lib/site";

type MarketingPageProps = {
  locale: Locale;
  showcaseRows: ShowcaseImageRow[];
};

export function MarketingPage({ locale, showcaseRows }: MarketingPageProps) {
  const messages = getMessages(locale);
  const deep = messages.deep;

  const signupHref = getLocalizedProductUrl(locale, "/auth");
  const loginHref = getLocalizedProductUrl(locale, "/auth");
  const purchaseHref = getLocalizedProductUrl(locale, "/purchase");
  const termsHref = getLocalizedProductUrl(locale, "/terms");
  const privacyHref = getLocalizedProductUrl(locale, "/privacy");

  const heroCaption = messages.hero.slogans[0];

  const screenshotSlides = marketingProductSlides.map((item, i) => {
    const caption = messages.screenshots.slides[i]?.caption ?? "";
    return {
      src: item.src,
      alt: caption ? `${messages.screenshots.title} — ${caption}` : messages.hero.imageAlt,
      caption: caption || messages.screenshots.title,
    };
  });

  const galleryTiles = (() => {
    const fromDb = showcaseRows
      .map((row, index) => {
        const src = pickVariantUrl(row);
        if (!src) return null;
        const fallback = messages.gallery.items[index % messages.gallery.items.length];
        const title = row.slide_title || fallback.title;
        return { src, alt: title, title, body: fallback.body };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);

    if (fromDb.length > 0) return fromDb;

    return showcaseImages.map((image, index) => {
      const fallback = messages.gallery.items[index % messages.gallery.items.length];
      return {
        src: image.src,
        alt: image.alt,
        title: fallback.title,
        body: fallback.body,
      };
    });
  })();

  const pillarsRoot = isRecord(deep.pillars) ? deep.pillars : null;
  const pillarBuild = parsePillar(pillarsRoot?.buildLook);
  const pillarShoot = parsePillar(pillarsRoot?.photoshoot);
  const pillarExperiment = parsePillar(pillarsRoot?.experiment);

  const faqRoot = isRecord(deep.faq) ? deep.faq : null;
  const faqH2 = faqRoot && typeof faqRoot.h2 === "string" ? faqRoot.h2 : "";
  const faqIntro = faqRoot && typeof faqRoot.intro === "string" ? faqRoot.intro : "";
  const faqItems = parseFaqItems(faqRoot?.items);

  const ed = deep.editorial;
  const editorialH2 = typeof ed?.h2 === "string" ? ed.h2 : "";
  const editorialLead = typeof ed?.lead === "string" ? ed.lead : "";
  const editorialBlocks = parseRichBlocks(
    ed && typeof ed === "object" && ed !== null && "blocks" in ed ? (ed as { blocks: unknown }).blocks : undefined,
  );

  const img0 = howItWorksImages.buildLook;
  const img1 = howItWorksImages.aiPhotoshoot;
  const img2 = howItWorksImages.experiment;

  const jsonLd = buildLandingJsonLd({
    baseUrl: MARKETING_SITE_URL,
    locale,
    siteName: "PublicSelf",
    description: messages.seo.description,
    faqItems,
  });

  return (
    <main lang={locale} className="bg-zinc-950 text-white">
      <DocumentLang locale={locale} />
      <LandingJsonLd data={jsonLd} />

      <section className="relative isolate w-full overflow-hidden bg-black">
        <div className="absolute inset-x-0 top-0 z-20 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 sm:px-10 lg:px-12">
            <Link
              href="/"
              className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white sm:text-xs"
            >
              {messages.nav.wordmark}
            </Link>
            <div className="flex items-center gap-5 sm:gap-7">
              <LanguageSwitcher currentLocale={locale} overlay />
              <Link
                href={loginHref}
                className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 transition hover:text-white"
              >
                {messages.hero.secondaryCta}
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-center px-6 pb-16 pt-[clamp(7rem,16vw,9.5rem)] sm:px-10 lg:px-12">
          <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 shrink-0 bg-white/45 sm:w-12" aria-hidden />
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80 sm:text-[11px]">
                  {messages.hero.badge}
                </p>
              </div>
              <h1 className="text-[clamp(1.95rem,4.4vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-white">
                {messages.hero.title}
              </h1>
              <p className="mt-5 max-w-xl text-[clamp(0.95rem,2vw,1.125rem)] font-medium leading-relaxed tracking-[-0.015em] text-white/90">
                {heroCaption}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={signupHref}
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-amber-500 px-9 text-[12px] font-semibold uppercase tracking-[0.18em] !text-zinc-950 shadow-[0_18px_50px_rgba(245,158,11,0.35)] transition hover:bg-amber-400"
                >
                  {messages.hero.primaryCta}
                </Link>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/65">
                  {messages.hero.ctaHint}
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative ml-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                <Image
                  src={marketingHeroScreenshot}
                  alt={messages.hero.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 80vw"
                  quality={90}
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {editorialH2 || editorialLead || editorialBlocks.length > 0 ? (
        <section
          id="why-identity"
          className="scroll-mt-20 border-t border-white/[0.06] border-b border-white/10 bg-zinc-950 px-6 py-20 sm:px-10 lg:px-12"
          aria-labelledby={editorialH2 ? "why-identity-heading" : undefined}
        >
          <div className="mx-auto max-w-3xl">
            {editorialH2 ? (
              <h2
                id="why-identity-heading"
                className="text-3xl font-black tracking-tight text-white sm:text-4xl"
              >
                {editorialH2}
              </h2>
            ) : null}
            {editorialLead ? (
              <p className="mt-5 text-lg font-medium leading-8 text-zinc-400">{editorialLead}</p>
            ) : null}
            {editorialBlocks.length > 0 ? (
              <div
                id="why-identity-body"
                className="mt-12 space-y-12 text-lg leading-8 text-zinc-300"
              >
                {editorialBlocks.map((block, i) => (
                  <div key={`${block.h3}-${i}`}>
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
            ) : null}
          </div>
        </section>
      ) : null}

      <section
        id="studio-walkthrough"
        className="scroll-mt-20 border-t border-white/[0.06] bg-zinc-950 px-6 py-20 md:py-28 sm:px-10 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
              {messages.screenshots.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white md:text-[2.125rem]">
              {messages.screenshots.title}
            </h2>
          </div>
          <div className="mt-14 md:mt-20">
            <MarketingScreenshotSlider
              slides={screenshotSlides}
              prevLabel={messages.screenshots.prev}
              nextLabel={messages.screenshots.next}
            />
          </div>
          <p className="mx-auto mt-16 max-w-3xl text-left text-[17px] leading-relaxed tracking-[-0.01em] text-zinc-300 md:mt-20 md:text-lg">
            {messages.hero.description}
          </p>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-zinc-950 px-6 py-16 sm:px-10 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3 md:gap-6">
          {messages.hero.featureCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-white/[0.06] bg-transparent px-6 py-8 md:px-7 md:py-9"
            >
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">{card.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed tracking-[-0.01em] text-zinc-300">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-20 relative overflow-hidden border-y border-amber-500/25 bg-zinc-950 px-6 py-24 md:py-32 sm:px-10 lg:px-12"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-35%,rgba(245,158,11,0.16),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-400/95">
              {messages.pricing.eyebrow}
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-white md:text-5xl lg:text-[3.15rem] lg:leading-[1.08]">
              {messages.pricing.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-300 md:text-xl md:leading-relaxed">
              {messages.pricing.description}
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {CREDIT_PACKS_LIST.map((pack, index) => {
              const plan = messages.pricing.plans[index];
              if (!plan) return null;
              const creditsLine = `${pack.credits} ${messages.pricing.creditsUnit}`;
              const isPrimary = index === 0;
              return (
                <article
                  key={pack.name}
                  className={`rounded-[2rem] border p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-10 ${
                    isPrimary
                      ? "border-amber-500/35 bg-gradient-to-b from-amber-500/[0.12] to-white/[0.04] ring-1 ring-amber-500/20"
                      : "border-white/12 bg-white/[0.04]"
                  }`}
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200/80">{plan.label}</p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">{plan.name}</h3>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-4xl font-semibold tracking-tight text-white md:text-[2.75rem]">${pack.usd}</p>
                      <p className="mt-1 text-sm text-zinc-400">{creditsLine}</p>
                    </div>
                  </div>
                  <p className="mt-6 text-base leading-7 text-zinc-300">{plan.body}</p>
                  <Link
                    href={purchaseHref}
                    className={`mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-2xl px-6 text-sm font-semibold uppercase tracking-[0.16em] transition sm:w-auto ${
                      isPrimary
                        ? "bg-amber-500 !text-zinc-950 hover:bg-amber-400"
                        : "border border-white/20 bg-white/[0.06] text-white hover:bg-white/12"
                    }`}
                  >
                    {messages.pricing.cta}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-20 border-b border-white/10 bg-zinc-950 px-6 py-20 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/55">{messages.gallery.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{messages.gallery.title}</h2>
            <p className="mt-4 text-lg leading-8 text-zinc-300">{messages.gallery.description}</p>
          </div>

          <div className="mt-12">
            <MarketingGalleryCarousel
              tiles={galleryTiles}
              prevLabel={messages.gallery.carouselPrev}
              nextLabel={messages.gallery.carouselNext}
            />
          </div>
        </div>
      </section>

      {pillarBuild ? (
        <LandingPillar
          id="pillar-build-look"
          h2={pillarBuild.h2}
          lead={pillarBuild.lead}
          blocks={pillarBuild.blocks}
          imageSrc={img0}
          imageAlt={pillarBuild.imageAlt}
          imageRight={true}
        />
      ) : null}

      {pillarShoot ? (
        <LandingPillar
          id="pillar-photoshoot"
          h2={pillarShoot.h2}
          lead={pillarShoot.lead}
          blocks={pillarShoot.blocks}
          imageSrc={img1}
          imageAlt={pillarShoot.imageAlt}
          imageRight={false}
        />
      ) : null}

      {pillarExperiment ? (
        <LandingPillar
          id="pillar-experiment"
          h2={pillarExperiment.h2}
          lead={pillarExperiment.lead}
          blocks={pillarExperiment.blocks}
          imageSrc={img2}
          imageAlt={pillarExperiment.imageAlt}
          imageRight={true}
        />
      ) : null}

      {faqH2 && faqItems.length > 0 ? (
        <LandingFaq id="faq" h2={faqH2} intro={faqIntro || undefined} items={faqItems} />
      ) : null}

      <footer className="bg-black px-6 py-10 sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-[12px] text-zinc-500 sm:flex-row">
          <p className="font-semibold uppercase tracking-[0.28em] text-zinc-400">
            {messages.nav.wordmark}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href={termsHref} className="uppercase tracking-[0.18em] text-zinc-400 transition hover:text-white">
              {messages.footer.terms}
            </Link>
            <Link href={privacyHref} className="uppercase tracking-[0.18em] text-zinc-400 transition hover:text-white">
              {messages.footer.privacy}
            </Link>
            <span className="tracking-[0.06em] text-zinc-600">
              © {new Date().getFullYear()} PublicSelf
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
