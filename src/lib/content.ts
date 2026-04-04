import type { Metadata } from "next";

import deMessages from "@/messages/de.json";
import enMessages from "@/messages/en.json";
import frMessages from "@/messages/fr.json";
import { heroImages } from "@/lib/landing-assets";
import { getLocaleUrl, type Locale } from "@/lib/site";

const messagesByLocale = {
  en: enMessages,
  de: deMessages,
  fr: frMessages,
} as const;

export type LandingMessages = typeof enMessages;

export function getMessages(locale: Locale): LandingMessages {
  return messagesByLocale[locale];
}

export function buildLandingMetadata(locale: Locale): Metadata {
  const messages = getMessages(locale);
  const canonical = getLocaleUrl(locale);
  const previewImage = heroImages.after;

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
