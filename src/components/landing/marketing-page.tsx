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
import { heroImages, howItWorksImages, showcaseImages } from "@/lib/landing-assets";
import {
  isRecord,
  parseFaqItems,
  parsePillar,
  parseRichBlocks,
  parseTocItems,
} from "@/lib/landingDeepParse";
import { buildLandingJsonLd } from "@/lib/landingStructuredData";
import {
  isSupabaseStorageUrl,
  pickHeroInputUrl,
  pickVariantUrl,
  type FrontPageImageRow,
  type ShowcaseImageRow,
} from "@/lib/marketing-data";
import { getLocalizedProductUrl, MARKETING_SITE_URL, type Locale } from "@/lib/site";

type MarketingPageProps = {
  locale: Locale;
  frontPageRows: FrontPageImageRow[];
  showcaseRows: ShowcaseImageRow[];
};

export function MarketingPage({ locale, frontPageRows, showcaseRows }: MarketingPageProps) {
  const messages = getMessages(locale);
  const deep = messages.deep;

  const signupHref = getLocalizedProductUrl(locale, "/auth");
  const loginHref = getLocalizedProductUrl(locale, "/auth");
  const purchaseHref = getLocalizedProductUrl(locale, "/purchase");
  const termsHref = getLocalizedProductUrl(locale, "/terms");
  const privacyHref = getLocalizedProductUrl(locale, "/privacy");

  const mainRow = frontPageRows[0];
  const heroAfter = pickVariantUrl(mainRow) ?? heroImages.after;
  const heroBefore = pickHeroInputUrl(mainRow) ?? heroImages.before;
  const heroDetail =
    pickVariantUrl(frontPageRows[2]) ?? pickVariantUrl(frontPageRows[1]) ?? heroImages.detail;

  const heroTopLine = mainRow?.slide_title ?? messages.hero.slogans[0];
  const heroMainLine = mainRow?.slide_description ?? messages.hero.slogans[1];
  const heroSubLine = messages.hero.slogans[2];

  const detailTitle = frontPageRows[2]?.slide_title ?? messages.gallery.items[2].title;
  const detailBody = messages.gallery.items[2].body;

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

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_32%),linear-gradient(180deg,_rgba(24,24,27,0.4),_rgba(9,9,11,0.95))]" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-12">
          <header className="flex items-center justify-between gap-6">
            <Link href="/" className="text-sm font-black uppercase tracking-[0.35em] text-white">
              {messages.nav.wordmark}
            </Link>
            <LanguageSwitcher currentLocale={locale} />
          </header>

          <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:gap-16 lg:py-14">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-white/80">
                {messages.hero.badge}
              </p>
              <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {messages.hero.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300 sm:text-xl">{messages.hero.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={signupHref}
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-7 text-sm font-black uppercase tracking-[0.18em] !text-zinc-950 transition hover:bg-zinc-200 hover:!text-zinc-950"
                >
                  {messages.hero.primaryCta}
                </Link>
                <Link
                  href={loginHref}
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/6 px-7 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/12"
                >
                  {messages.hero.secondaryCta}
                </Link>
                <a
                  href="#gallery"
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl px-7 text-sm font-black uppercase tracking-[0.18em] text-white/80 transition hover:text-white"
                >
                  {messages.hero.examplesCta}
                </a>
              </div>
              <p className="mt-5 max-w-lg text-sm leading-6 text-zinc-400">{messages.hero.trustNote}</p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {messages.hero.featureCards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-3xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm"
                  >
                    <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">{card.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">{card.body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/12 bg-zinc-900 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
                <Image
                  src={heroAfter}
                  alt={messages.hero.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                  priority
                  unoptimized={isSupabaseStorageUrl(heroAfter)}
                  quality={isSupabaseStorageUrl(heroAfter) ? undefined : 90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/15 to-transparent" />
                <div className="absolute right-5 top-5 max-w-[12rem] rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/70">
                    {messages.gallery.eyebrow}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/90">{heroTopLine}</p>
                </div>
                <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
                  <div className="rounded-2xl bg-white p-2 text-zinc-900 shadow-2xl">
                    <Image
                      src={heroBefore}
                      alt={messages.hero.beforeLabel}
                      width={280}
                      height={350}
                      sizes="150px"
                      className="aspect-[4/5] w-full rounded-xl object-cover"
                      unoptimized={isSupabaseStorageUrl(heroBefore)}
                      quality={isSupabaseStorageUrl(heroBefore) ? undefined : 90}
                    />
                    <p className="mt-2 text-center text-[11px] font-black uppercase tracking-[0.18em] text-zinc-700">
                      {messages.hero.beforeLabel}
                    </p>
                  </div>
                  <div className="self-end rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/65">
                      {messages.hero.afterLabel}
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-7 text-white">{heroMainLine}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{heroSubLine}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-6 hidden w-44 rounded-[1.75rem] border border-white/12 bg-zinc-900 p-3 shadow-2xl sm:block">
                <Image
                  src={heroDetail}
                  alt={detailTitle}
                  width={320}
                  height={400}
                  sizes="176px"
                  className="aspect-[4/5] w-full rounded-[1.25rem] object-cover"
                  unoptimized={isSupabaseStorageUrl(heroDetail)}
                  quality={isSupabaseStorageUrl(heroDetail) ? undefined : 90}
                />
                <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/65">{detailTitle}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{detailBody}</p>
              </div>
            </div>
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
