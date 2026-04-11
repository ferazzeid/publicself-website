import Image from "next/image";
import Link from "next/link";

import { DocumentLang } from "@/components/document-lang";
import { LanguageSwitcher } from "@/components/landing/language-switcher";
import { LandingEditorial } from "@/components/landing/landing-editorial";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingJsonLd } from "@/components/landing/landing-json-ld";
import { LandingMidCta } from "@/components/landing/landing-mid-cta";
import { LandingPillar } from "@/components/landing/landing-pillar";
import { LandingToc } from "@/components/landing/landing-toc";
import { getMessages } from "@/lib/content";
import { CREDIT_PACKS_LIST } from "@/lib/credit-packs";
import { howItWorksImages, marketingHeroScreenshot, showcaseImages } from "@/lib/landing-assets";
import {
  isRecord,
  parseFaqItems,
  parsePillar,
  parseRichBlocks,
  parseTocItems,
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

  const midCta = isRecord(deep.midCta) ? deep.midCta : null;
  const midCtaTitle = midCta && typeof midCta.title === "string" ? midCta.title : "";
  const midCtaBody = midCta && typeof midCta.body === "string" ? midCta.body : "";
  const midCtaLabel = midCta && typeof midCta.ctaLabel === "string" ? midCta.ctaLabel : "";
  const midCtaHref = midCta && typeof midCta.href === "string" ? midCta.href : "#pricing";

  const editorial = isRecord(deep.editorial) ? deep.editorial : null;
  const editorialH2 = editorial && typeof editorial.h2 === "string" ? editorial.h2 : "";
  const editorialLead = editorial && typeof editorial.lead === "string" ? editorial.lead : "";
  const editorialBlocks = parseRichBlocks(editorial?.blocks);

  const tocAria = typeof deep.tocAria === "string" ? deep.tocAria : "On this page";
  const tocTitle = typeof deep.tocTitle === "string" ? deep.tocTitle : "On this page";
  const tocItems = parseTocItems(deep.tocItems);

  const galleryCaptionTitle = typeof deep.galleryCaptionTitle === "string" ? deep.galleryCaptionTitle : "";
  const galleryCaptionBody = typeof deep.galleryCaptionBody === "string" ? deep.galleryCaptionBody : "";

  const img0 = pickVariantUrl(showcaseRows[0]) ?? howItWorksImages.buildLook;
  const img1 = pickVariantUrl(showcaseRows[1]) ?? howItWorksImages.aiPhotoshoot;
  const img2 = pickVariantUrl(showcaseRows[2]) ?? howItWorksImages.experiment;

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

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-zinc-950">
        <div className="relative z-20 mx-auto max-w-7xl px-6 pt-6 sm:px-10 lg:px-12">
          <header className="flex items-center justify-between gap-6">
            <Link href="/" className="text-sm font-black uppercase tracking-[0.35em] text-white">
              {messages.nav.wordmark}
            </Link>
            <LanguageSwitcher currentLocale={locale} />
          </header>
        </div>

        <div className="relative z-10 mt-4 sm:mt-6">
          <div className="relative mx-auto min-h-[min(52vh,420px)] w-full max-w-7xl overflow-hidden sm:min-h-[min(50vh,480px)] lg:min-h-[min(52vh,520px)] lg:rounded-[2rem] lg:border lg:border-white/10 lg:shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
            <Image
              src={marketingHeroScreenshot}
              alt={messages.hero.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 1280px"
              className="object-cover object-[52%_0%] sm:object-[58%_10%] lg:object-[55%_8%]"
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.94)_0%,rgba(9,9,11,0.72)_38%,rgba(9,9,11,0.28)_55%,rgba(9,9,11,0.05)_72%,transparent_100%),linear-gradient(180deg,rgba(9,9,11,0.15)_0%,transparent_35%,transparent_55%,rgba(9,9,11,0.45)_82%,rgba(9,9,11,0.96)_100%)]"
              aria-hidden
            />
            <div className="relative z-10 mx-auto flex min-h-[min(52vh,420px)] max-w-7xl flex-col justify-between px-6 py-10 sm:min-h-[min(50vh,480px)] sm:px-10 sm:py-12 lg:min-h-[min(52vh,520px)] lg:px-12 lg:py-14">
              <div className="max-w-xl">
                <p className="mb-4 inline-flex rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
                  {messages.hero.badge}
                </p>
                <h1 className="max-w-[22ch] text-4xl font-black leading-[1.06] tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.5)] sm:max-w-xl sm:text-5xl lg:text-6xl">
                  {messages.hero.title}
                </h1>
                <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-white/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.45)] sm:text-base">
                  {heroCaption}
                </p>
                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-100 [text-shadow:0_1px_20px_rgba(0,0,0,0.55)] sm:text-lg sm:leading-8">
                  {messages.hero.description}
                </p>
              </div>

              <div className="mt-10 space-y-4 sm:mt-12">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href={signupHref}
                    className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-2xl bg-white px-7 text-sm font-black uppercase tracking-[0.18em] !text-zinc-950 shadow-lg transition hover:bg-zinc-200 hover:!text-zinc-950"
                  >
                    {messages.hero.primaryCta}
                  </Link>
                  <Link
                    href={loginHref}
                    className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-black/45 px-7 text-sm font-black uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-black/60"
                  >
                    {messages.hero.secondaryCta}
                  </Link>
                  <a
                    href="#gallery"
                    className="inline-flex min-h-14 items-center justify-center rounded-2xl px-2 text-sm font-black uppercase tracking-[0.18em] text-white/90 transition hover:text-white sm:px-4"
                  >
                    {messages.hero.examplesCta}
                  </a>
                </div>
                <p className="max-w-lg text-sm leading-6 text-zinc-200/95">{messages.hero.trustNote}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-8 sm:px-10 lg:px-12">
          <div className="grid gap-4 sm:grid-cols-3">
            {messages.hero.featureCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm"
              >
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LandingToc ariaLabel={tocAria} title={tocTitle} items={tocItems} />

      <section id="gallery" className="scroll-mt-20 border-b border-white/10 bg-zinc-950 px-6 py-20 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/55">{messages.gallery.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{messages.gallery.title}</h2>
            <p className="mt-4 text-lg leading-8 text-zinc-300">{messages.gallery.description}</p>
            {(galleryCaptionTitle || galleryCaptionBody) && (
              <div className="mt-8 max-w-2xl border-l-2 border-amber-500/60 pl-5">
                {galleryCaptionTitle ? (
                  <p className="text-lg font-semibold text-zinc-200">{galleryCaptionTitle}</p>
                ) : null}
                {galleryCaptionBody ? (
                  <p className="mt-3 text-base leading-7 text-zinc-400">{galleryCaptionBody}</p>
                ) : null}
              </div>
            )}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryTiles.map((tile) => (
              <article
                key={`${tile.src}-${tile.title}`}
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900"
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
                  <h3 className="text-base font-black tracking-tight text-white">{tile.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{tile.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {editorialH2 && editorialBlocks.length > 0 ? (
        <LandingEditorial
          id="why-identity"
          h2={editorialH2}
          lead={editorialLead}
          blocks={editorialBlocks}
        />
      ) : null}

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

      {midCtaTitle && midCtaBody && midCtaLabel ? (
        <LandingMidCta title={midCtaTitle} body={midCtaBody} ctaLabel={midCtaLabel} href={midCtaHref} />
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

      <section id="pricing" className="scroll-mt-20 border-b border-white/10 bg-zinc-950 px-6 py-20 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/55">{messages.pricing.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{messages.pricing.title}</h2>
            <p className="mt-4 text-lg leading-8 text-zinc-300">{messages.pricing.description}</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {CREDIT_PACKS_LIST.map((pack, index) => {
              const plan = messages.pricing.plans[index];
              if (!plan) return null;
              const creditsLine = `${pack.credits} ${messages.pricing.creditsUnit}`;
              return (
                <article
                  key={pack.name}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.18em] text-white/60">{plan.label}</p>
                      <h3 className="mt-3 text-2xl font-black tracking-tight text-white">{plan.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black tracking-tight text-white">${pack.usd}</p>
                      <p className="mt-1 text-sm text-zinc-400">{creditsLine}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-zinc-300">{plan.body}</p>
                  <Link
                    href={purchaseHref}
                    className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/8 px-5 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/14"
                  >
                    {messages.pricing.cta}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-black px-6 py-16 sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/55">{messages.footer.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{messages.footer.title}</h2>
            <p className="mt-4 text-lg leading-8 text-zinc-300">{messages.footer.body}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
              <span>{messages.footer.legalPrefix}</span>
              <Link href={termsHref} className="text-white hover:text-zinc-300">
                {messages.footer.terms}
              </Link>
              <span>{messages.footer.and}</span>
              <Link href={privacyHref} className="text-white hover:text-zinc-300">
                {messages.footer.privacy}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={signupHref}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-7 text-sm font-black uppercase tracking-[0.18em] !text-zinc-950 transition hover:bg-zinc-200 hover:!text-zinc-950"
            >
              {messages.footer.primaryCta}
            </Link>
            <Link
              href={loginHref}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/6 px-7 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/12"
            >
              {messages.footer.secondaryCta}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
