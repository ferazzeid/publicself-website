import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarketingPage } from "@/components/landing/marketing-page";
import { buildLandingMetadata } from "@/lib/content";
import { loadMarketingGalleryData, ogPreviewFromFrontPage } from "@/lib/marketing-data";
import { isSupportedLocale, type Locale } from "@/lib/site";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export function generateStaticParams() {
  return [{ locale: "de" }, { locale: "fr" }];
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale) || locale === "en") {
    notFound();
  }

  const data = await loadMarketingGalleryData();
  const preview = ogPreviewFromFrontPage(data.frontPage);
  return buildLandingMetadata(locale as Locale, preview);
}

export default async function LocalizedHome({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale) || locale === "en") {
    notFound();
  }

  const data = await loadMarketingGalleryData();
  return (
    <MarketingPage
      locale={locale as Locale}
      showcaseRows={data.showcase}
      walkthroughSlides={data.walkthroughSlides}
    />
  );
}
