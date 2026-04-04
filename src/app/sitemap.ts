import type { MetadataRoute } from "next";

import { MARKETING_SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${MARKETING_SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${MARKETING_SITE_URL}/`,
          de: `${MARKETING_SITE_URL}/de`,
          fr: `${MARKETING_SITE_URL}/fr`,
        },
      },
    },
    {
      url: `${MARKETING_SITE_URL}/de`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${MARKETING_SITE_URL}/`,
          de: `${MARKETING_SITE_URL}/de`,
          fr: `${MARKETING_SITE_URL}/fr`,
        },
      },
    },
    {
      url: `${MARKETING_SITE_URL}/fr`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${MARKETING_SITE_URL}/`,
          de: `${MARKETING_SITE_URL}/de`,
          fr: `${MARKETING_SITE_URL}/fr`,
        },
      },
    },
  ];
}
