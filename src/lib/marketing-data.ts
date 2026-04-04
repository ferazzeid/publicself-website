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
