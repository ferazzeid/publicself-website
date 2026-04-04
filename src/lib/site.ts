export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = ["en", "de", "fr"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
};

const DEFAULT_MARKETING_SITE_URL = "https://publicself.app";
const DEFAULT_PRODUCT_SITE_URL = "https://studio.publicself.app";

function normalizeBaseUrl(url: string | undefined, fallback: string) {
  return (url?.trim() || fallback).replace(/\/$/, "");
}

/** Tool app must not use the marketing apex; mis-set env would keep CTAs on publicself.app. */
function sanitizeProductSiteUrl(url: string): string {
  const u = url.replace(/\/$/, "");
  if (
    u === "https://publicself.app" ||
    u === "https://www.publicself.app" ||
    u === "http://publicself.app" ||
    u === "http://www.publicself.app"
  ) {
    return DEFAULT_PRODUCT_SITE_URL;
  }
  return u;
}

export const MARKETING_SITE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL,
  DEFAULT_MARKETING_SITE_URL,
);

export const PRODUCT_SITE_URL = sanitizeProductSiteUrl(
  normalizeBaseUrl(process.env.NEXT_PUBLIC_PRODUCT_SITE_URL, DEFAULT_PRODUCT_SITE_URL),
);

export function isSupportedLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function getLocalePrefix(locale: Locale) {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

export function getLocalizedPath(locale: Locale, path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") {
    return locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
  }

  return `${getLocalePrefix(locale)}${normalizedPath}`;
}

export function getLocaleUrl(locale: Locale, path = "/") {
  return `${MARKETING_SITE_URL}${getLocalizedPath(locale, path)}`;
}

export function getProductUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${PRODUCT_SITE_URL}${normalizedPath}`;
}

export function getLocalizedProductUrl(locale: Locale, path = "/") {
  return `${PRODUCT_SITE_URL}${getLocalizedPath(locale, path)}`;
}
