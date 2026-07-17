"use client";

import React, { useState, useCallback, useMemo } from "react";
import { I18nContext, type Locale } from "@/lib/i18n/context";
import en from "@/lib/i18n/en";
import ru from "@/lib/i18n/ru";

const STORAGE_KEY = "arkanum-locale";

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ru" || stored === "en") return stored;
  const browserLang = navigator.language.split("-")[0];
  if (browserLang === "ru") return "ru";
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useMemo(() => (locale === "ru" ? ru : en), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}
