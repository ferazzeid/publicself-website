import type { Metadata } from "next";

import deMessages from "@/messages/de.json";
import enMessages from "@/messages/en.json";
import frMessages from "@/messages/fr.json";
import deDeep from "@/messages/deep/de.json";
import enDeep from "@/messages/deep/en.json";
import frDeep from "@/messages/deep/fr.json";
import { heroImages } from "@/lib/landing-assets";
import { getLocaleUrl, type Locale } from "@/lib/site";

const messagesByLocale = {
  en: enMessages,
  de: deMessages,
  fr: frMessages,
} as const;

const deepByLocale = {
  en: enDeep.deep,
  de: deDeep.deep,
  fr: frDeep.deep,
} as const;

export type LandingMessages = (typeof enMessages) & { deep: (typeof enDeep)["deep"] };

export function getMessages(locale: Locale): LandingMessages {
  return { ...messagesByLocale[locale], deep: deepByLocale[locale] };
}

export function buildLandingMetadata(locale: Locale, previewImageUrl?: string): Metadata {
  const messages = getMessages(locale);
  const canonical = getLocaleUrl(locale);
  const previewImage = previewImageUrl ?? heroImages.after;

  return {
    title: messages.seo.title,
    description: messages.seo.description,
    alternates: {
      canonical,
      languages: {
        en: getLocaleUrl("en"),
        de: getLocaleUrl("de"),
        fr: getLocaleUrl("fr"),
        "x-default": getLocaleUrl("en"),
      },
    },
    openGraph: {
      title: messages.seo.title,
      description: messages.seo.description,
      url: canonical,
      siteName: "PublicSelf",
      locale,
      type: "website",
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: messages.hero.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.seo.title,
      description: messages.seo.description,
      images: [previewImage],
    },
  };
}
