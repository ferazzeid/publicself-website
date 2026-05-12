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
  slide_description: string | null;
};

/** Slot order matches Admin "walkthrough" uploads (captions from messages.screenshots.slides[i]). */
export const LANDING_WALKTHROUGH_SLOTS = [
  "walkthrough_slide_1",
  "walkthrough_slide_2",
  "walkthrough_slide_3",
] as const;

export type WalkthroughSlideFromCms = {
  src: string;
  /** 0 = slide_1 … 2 = slide_3 — used to pick i18n caption even if earlier slots are empty */
  slotIndex: number;
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
  walkthroughSlides: WalkthroughSlideFromCms[];
}> => {
  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return { frontPage: [], showcase: [], walkthroughSlides: [] };
  }

  const [fpRes, shRes, laRes] = await Promise.all([
    supabase.rpc("list_front_page_images_thumbs", { p_limit: 3 }),
    supabase.rpc("list_showcase_images", { p_limit: 24 }),
    supabase.from("landing_assets").select("slot, url").in("slot", [...LANDING_WALKTHROUGH_SLOTS]),
  ]);

  const bySlot = new Map<string, string>();
  for (const row of (laRes.data ?? []) as { slot: string; url: string }[]) {
    if (row.slot && row.url?.trim()) {
      bySlot.set(row.slot, row.url.trim());
    }
  }

  const walkthroughSlides: WalkthroughSlideFromCms[] = LANDING_WALKTHROUGH_SLOTS.map((slot, slotIndex) => {
    const url = bySlot.get(slot);
    if (!url) return null;
    return { src: url, slotIndex };
  }).filter((x): x is WalkthroughSlideFromCms => x !== null);

  return {
    frontPage: (fpRes.data ?? []) as FrontPageImageRow[],
    showcase: (shRes.data ?? []) as ShowcaseImageRow[],
    walkthroughSlides,
  };
});

export const LANDING_EXAMPLE_SLOTS = [
  "example_1",
  "example_2",
  "example_3",
  "example_4",
  "example_5",
  "example_6",
  "example_7",
  "example_8",
  "example_9",
] as const;

export type LandingExampleSlot = (typeof LANDING_EXAMPLE_SLOTS)[number];

export type LandingAssetSlot =
  | "hero"
  | "pillar_build_look"
  | "pillar_photoshoot"
  | "pillar_experiment"
  | "walkthrough_slide_1"
  | "walkthrough_slide_2"
  | "walkthrough_slide_3"
  | LandingExampleSlot;

export type LandingAssetsMap = Partial<Record<LandingAssetSlot, string>>;

const KNOWN_SLOTS: ReadonlySet<string> = new Set([
  "hero",
  "pillar_build_look",
  "pillar_photoshoot",
  "pillar_experiment",
  "walkthrough_slide_1",
  "walkthrough_slide_2",
  "walkthrough_slide_3",
  ...LANDING_EXAMPLE_SLOTS,
]);

/**
 * Free credits granted at signup. Read from the same `app_config` row the
 * studio's admin tab writes (key: `default_signup_credits`, value shape:
 * `{ credits: number }`). Public read is granted by the stepin migration
 * `allow_public_read_default_signup_credits`. Falls back to 5 if Supabase
 * isn't configured or the row is missing.
 */
const FALLBACK_SIGNUP_CREDITS = 5;

export const loadDefaultSignupCredits = cache(async (): Promise<number> => {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return FALLBACK_SIGNUP_CREDITS;

  const { data, error } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", "default_signup_credits")
    .maybeSingle();

  if (error || !data) return FALLBACK_SIGNUP_CREDITS;
  const value = (data as { value?: { credits?: number } }).value;
  if (typeof value?.credits === "number" && value.credits >= 0) {
    return Math.min(1000, Math.floor(value.credits));
  }
  return FALLBACK_SIGNUP_CREDITS;
});

/**
 * Fetch admin-managed landing-page image URLs from public.landing_assets.
 * Returns an empty map if Supabase isn't configured or the table is missing —
 * callers should fall back to bundled static defaults in landing-assets.ts.
 *
 * Single source of truth for the marketing site: hero, pillars, walkthrough
 * screenshots, and the examples carousel are all driven by this map. The
 * admin Marketing tab writes to these same slots.
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
    if (KNOWN_SLOTS.has(row.slot)) {
      out[row.slot as LandingAssetSlot] = row.url;
    }
  }
  return out;
});
