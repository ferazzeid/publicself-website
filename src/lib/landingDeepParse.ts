export type TocItem = { anchor: string; label: string };

export type LandingRichBlock = {
  h3: string;
  paragraphs: string[];
  bullets?: string[];
};

export type FaqItem = { q: string; a: string };

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function parseTocItems(raw: unknown): TocItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is TocItem => isRecord(x) && typeof x.anchor === "string" && typeof x.label === "string")
    .map((x) => ({ anchor: x.anchor, label: x.label }));
}

export function parseRichBlocks(raw: unknown): LandingRichBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x) => isRecord(x) && typeof x.h3 === "string")
    .map((x) => {
      const paragraphs = Array.isArray(x.paragraphs)
        ? (x.paragraphs as unknown[]).filter((p): p is string => typeof p === "string")
        : [];
      const bullets = Array.isArray(x.bullets)
        ? (x.bullets as unknown[]).filter((b): b is string => typeof b === "string")
        : undefined;
      return {
        h3: x.h3,
        paragraphs,
        bullets: bullets && bullets.length > 0 ? bullets : undefined,
      };
    });
}

export function parseFaqItems(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x) => isRecord(x) && typeof x.q === "string" && typeof x.a === "string")
    .map((x) => ({ q: x.q, a: x.a }));
}

export type LandingDeepPillar = {
  h2: string;
  lead: string;
  imageAlt: string;
  blocks: LandingRichBlock[];
};

export function parsePillar(raw: unknown): LandingDeepPillar | null {
  if (!isRecord(raw)) return null;
  const h2 = typeof raw.h2 === "string" ? raw.h2 : "";
  const lead = typeof raw.lead === "string" ? raw.lead : "";
  const imageAlt = typeof raw.imageAlt === "string" ? raw.imageAlt : "";
  const blocks = parseRichBlocks(raw.blocks);
  if (!h2 || blocks.length === 0) return null;
  return { h2, lead, imageAlt, blocks };
}
