import Link from "next/link";

import { getLocalizedPath, LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from "@/lib/site";

type LanguageSwitcherProps = {
  currentLocale: Locale;
};

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  return (
    <nav aria-label="Language switcher" className="flex items-center gap-2">
      {SUPPORTED_LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center gap-2">
          {index > 0 ? <span className="text-[10px] text-white/30">|</span> : null}
          <Link
            href={getLocalizedPath(locale)}
            className={`text-[10px] font-black uppercase tracking-[0.22em] transition-opacity ${
              locale === currentLocale ? "text-white" : "text-white/60 hover:text-white/90"
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
