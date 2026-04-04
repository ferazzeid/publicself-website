import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarketingPage } from "@/components/landing/marketing-page";
import { buildLandingMetadata } from "@/lib/content";
import { isSupportedLocale, type Locale } from "@/lib/site";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "de" }, { locale: "fr" }];
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale) || locale === "en") {
    notFound();
  }

  return buildLandingMetadata(locale);
}

export default async function LocalizedHome({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale) || locale === "en") {
    notFound();
  }

  return <MarketingPage locale={locale as Locale} />;
}
