import Link from "next/link";

import { getLocalizedPath, LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from "@/lib/site";

type LanguageSwitcherProps = {
  currentLocale: Locale;
  /** Light text on photography / dark hero overlays */
  overlay?: boolean;
};

export function LanguageSwitcher({ currentLocale, overlay = false }: LanguageSwitcherProps) {
  const sep = overlay ? "text-white/25" : "text-white/30";
  const idle = overlay ? "text-white/65 hover:text-white/95" : "text-white/60 hover:text-white/90";

  return (
    <nav aria-label="Language switcher" className="flex items-center gap-2">
      {SUPPORTED_LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center gap-2">
          {index > 0 ? <span className={`text-[10px] ${sep}`}>|</span> : null}
          <Link
            href={getLocalizedPath(locale)}
            className={`text-[10px] font-black uppercase tracking-[0.22em] transition-opacity ${
              locale === currentLocale ? "text-white" : idle
            }`}
            aria-current={locale === currentLocale ? "page" : undefined}
          >
            {LOCALE_LABELS[locale]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
