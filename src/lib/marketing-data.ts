import { cache } from "react";

import { createPublicSupabaseClient } from "@/lib/supabase-public";

export type FrontPageImageRow = {
  id: string;
  thumbnail_url: string | null;
  medium_url: string | null;
  large_url: string | null;
  slide_title: string | null;
  slide_description: string | null;
  before_image_url: string | null;
};

export type ShowcaseImageRow = {
  id: string;
  thumbnail_url: string | null;
  medium_url: string | null;
  large_url: string | null;
  slide_title: string | null;
};

export function pickVariantUrl(
  row: Pick<FrontPageImageRow | ShowcaseImageRow, "large_url" | "medium_url" | "thumbnail_url"> | undefined,
): string | null {
  if (!row) return null;
  return row.large_url || row.medium_url || row.thumbnail_url || null;
}

/** Hero "input" slot: explicit before shot, else a smaller variant of the same slide (never stock if row exists). */
export function pickHeroInputUrl(row: FrontPageImageRow | undefined): string | null {
  if (!row) return null;
  return (
    row.before_image_url ||
    row.medium_url ||
    row.thumbnail_url ||
    row.large_url ||
    null
  );
}

/** Use full-size storage URLs in the browser — avoids Next re-encoding softening remote JPEGs. */
export function isSupabaseStorageUrl(src: string): boolean {
  return src.includes("supabase.co");
}

export function ogPreviewFromFrontPage(frontPage: FrontPageImageRow[]): string | undefined {
  const url = pickVariantUrl(frontPage[0]);
  return url ?? undefined;
}

export const loadMarketingGalleryData = cache(async (): Promise<{
  frontPage: FrontPageImageRow[];
  showcase: ShowcaseImageRow[];
}> => {
  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return { frontPage: [], showcase: [] };
  }

  const [fpRes, shRes] = await Promise.all([
    supabase.rpc("list_front_page_images_thumbs", { p_limit: 3 }),
    supabase.rpc("list_showcase_images", { p_limit: 24 }),
  ]);

  return {
    frontPage: (fpRes.data ?? []) as FrontPageImageRow[],
    showcase: (shRes.data ?? []) as ShowcaseImageRow[],
  };
});

export type LandingAssetSlot =
  | "hero"
  | "pillar_build_look"
  | "pillar_photoshoot"
  | "pillar_experiment"
  | "walkthrough_slide_1";

export type LandingAssetsMap = Partial<Record<LandingAssetSlot, string>>;

/**
 * Fetch admin-managed landing-page image URLs from public.landing_assets.
 * Returns an empty map if Supabase isn't configured or the table is missing —
 * callers should fall back to bundled static defaults in landing-assets.ts.
 */
export const loadLandingAssets = cache(async (): Promise<LandingAssetsMap> => {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("landing_assets")
    .select("slot, url");

  if (error || !data) return {};

  const out: LandingAssetsMap = {};
  for (const row of data as { slot: string; url: string | null }[]) {
    if (!row.url) continue;
    if (
      row.slot === "hero" ||
      row.slot === "pillar_build_look" ||
      row.slot === "pillar_photoshoot" ||
      row.slot === "pillar_experiment" ||
      row.slot === "walkthrough_slide_1"
    ) {
      out[row.slot] = row.url;
    }
  }
  return out;
});
