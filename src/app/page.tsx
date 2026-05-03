import type { Metadata } from "next";

import { MarketingPage } from "@/components/landing/marketing-page";
import { buildLandingMetadata } from "@/lib/content";
import { loadMarketingGalleryData, ogPreviewFromFrontPage } from "@/lib/marketing-data";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const data = await loadMarketingGalleryData();
  const preview = ogPreviewFromFrontPage(data.frontPage);
  return buildLandingMetadata("en", preview);
}

export default async function Home() {
  const data = await loadMarketingGalleryData();
  return (
    <MarketingPage locale="en" showcaseRows={data.showcase} walkthroughSlides={data.walkthroughSlides} />
  );
}
