type LandingJsonLdProps = {
  data: Record<string, unknown>;
};

export function LandingJsonLd({ data }: LandingJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
