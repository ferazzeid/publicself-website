import Image from "next/image";
import Link from "next/link";

import { DocumentLang } from "@/components/document-lang";
import { LanguageSwitcher } from "@/components/landing/language-switcher";
import { MarketingScreenshotSlider } from "@/components/landing/marketing-screenshot-slider";
import { MarketingGalleryCarousel } from "@/components/landing/marketing-gallery-carousel";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingJsonLd } from "@/components/landing/landing-json-ld";
import { LandingMidCta } from "@/components/landing/landing-mid-cta";
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

  const midCta = isRecord(deep.midCta) ? deep.midCta : null;
  const midCtaTitle = midCta && typeof midCta.title === "string" ? midCta.title : "";
  const midCtaBody = midCta && typeof midCta.body === "string" ? midCta.body : "";
  const midCtaLabel = midCta && typeof midCta.ctaLabel === "string" ? midCta.ctaLabel : "";
  const midCtaHref = midCta && typeof midCta.href === "string" ? midCta.href : "#pricing";

  const editorial = isRecord(deep.editorial) ? deep.editorial : null;
  const editorialH2 = editorial && typeof editorial.h2 === "string" ? editorial.h2 : "";
  const editorialLead = editorial && typeof editorial.lead === "string" ? editorial.lead : "";

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

      <section className="relative isolate min-h-[100dvh] w-full overflow-hidden bg-black">
        <Image
          src={marketingHeroScreenshot}
          alt={messages.hero.imageAlt}
          fill
          sizes="100vw"
          quality={88}
          className="object-contain object-center"
          priority
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,transparent_26%,transparent_62%,rgba(0,0,0,0.48)_100%)]"
          aria-hidden
        />

        <div className="absolute inset-x-0 top-0 z-20 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
            <Link
              href="/"
              className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.55)] sm:text-xs"
            >
              {messages.nav.wordmark}
            </Link>
            <LanguageSwitcher currentLocale={locale} overlay />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-between px-6 pb-12 pt-[clamp(5.75rem,15vw,8.5rem)] sm:px-10 lg:px-12">
          <div className="flex flex-1 flex-col justify-center">
            <div className="w-full max-w-2xl text-left">
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 shrink-0 bg-white/45 sm:w-12" aria-hidden />
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80 sm:text-[11px]">
                  {messages.hero.badge}
                </p>
              </div>
              <h1 className="text-[clamp(1.85rem,4.2vw,3.35rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white [text-shadow:0_2px_48px_rgba(0,0,0,0.42)]">
                {messages.hero.title}
              </h1>
              <p className="mt-5 max-w-xl text-[clamp(0.95rem,2vw,1.125rem)] font-medium leading-relaxed tracking-[-0.015em] text-white/88 [text-shadow:0_1px_24px_rgba(0,0,0,0.38)]">
                {heroCaption}
              </p>
            </div>
          </div>

          <div className="w-full max-w-2xl space-y-6">
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={signupHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 text-[11px] font-semibold uppercase tracking-[0.16em] !text-zinc-950 transition hover:bg-zinc-100"
              >
                {messages.hero.primaryCta}
              </Link>
              <Link
                href={loginHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/22 bg-white/[0.08] px-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md transition hover:bg-white/[0.12]"
              >
                {messages.hero.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {editorialH2 && editorialLead ? (
        <section className="border-t border-white/[0.06] bg-zinc-950 px-6 py-16 sm:px-10 md:py-20 lg:px-12">
          <div className="mx-auto max-w-3xl text-left">
            <h2 className="text-[clamp(1.65rem,3.5vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
              {editorialH2}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed tracking-[-0.01em] text-zinc-400 md:text-lg">
              {editorialLead}
            </p>
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
