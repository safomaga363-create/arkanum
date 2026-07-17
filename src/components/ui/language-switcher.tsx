"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-border",
        className
      )}
    >
      <Globe className="h-4 w-4 text-muted-foreground ml-1" />
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "px-2.5 py-1 rounded-md text-xs font-semibold transition-all",
          locale === "en"
            ? "bg-primary/20 text-primary border border-primary/30"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("ru")}
        className={cn(
          "px-2.5 py-1 rounded-md text-xs font-semibold transition-all",
          locale === "ru"
            ? "bg-primary/20 text-primary border border-primary/30"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        RU
      </button>
    </div>
  );
}
