/**
 * JSON-LD for the marketing landing (GEO + classic SEO).
 */

export function buildLandingJsonLd(args: {
  baseUrl: string;
  locale: string;
  siteName: string;
  description: string;
  faqItems: { q: string; a: string }[];
}): Record<string, unknown> {
  const { baseUrl, locale, siteName, description, faqItems } = args;
  const origin = baseUrl.replace(/\/$/, "");

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: origin,
      name: siteName,
      inLanguage: locale,
      description,
    },
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: siteName,
      url: origin,
    },
    {
      "@type": "WebApplication",
      "@id": `${origin}/#webapp`,
      name: siteName,
      applicationCategory: "PhotographyApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      description,
    },
  ];

  if (faqItems.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${origin}/#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
