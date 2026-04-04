import type { Metadata } from "next";

import { MarketingPage } from "@/components/landing/marketing-page";
import { buildLandingMetadata } from "@/lib/content";

export const dynamic = "force-static";

export const metadata: Metadata = buildLandingMetadata("en");

export default function Home() {
  return <MarketingPage locale="en" />;
}
