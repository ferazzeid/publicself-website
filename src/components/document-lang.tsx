"use client";

import { useEffect } from "react";

/** Keeps <html lang> aligned with the marketing locale (root layout defaults to en). */
export function DocumentLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
