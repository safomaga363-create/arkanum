"use client";

import { createContext, useContext } from "react";
import en from "./en";
import type { Translations } from "./en";

export type Locale = "en" | "ru";

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  setLocale: () => {},
  t: en,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function getTranslations(locale: Locale): Translations {
  if (locale === "ru") {
    // Lazy import is not possible in sync context; caller should have loaded it
    // For now, we re-export the static import
    return ru;
  }
  return en;
}

// We import ru at the top level for simplicity in the provider
import ru from "./ru";
