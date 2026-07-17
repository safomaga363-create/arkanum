"use client";

import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useI18n();

  const footerLinks = {
    [t.footer.platform]: [
      { href: "/learning-paths", label: t.nav.learningPaths },
      { href: "/challenges", label: t.nav.challenges },
      { href: "/contests", label: t.nav.contests },
      { href: "/leaderboard", label: t.nav.leaderboard },
      { href: "/wallet", label: t.nav.wallet },
      { href: "/premium", label: t.nav.premium },
    ],
    [t.footer.legal]: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/ethics", label: "Ethics Policy" },
    ],
  };

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-wider">
                <span className="neon-text">AR</span>
                <span className="text-foreground">KA</span>
                <span className="neon-text-purple">NUM</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ARKANUM. {t.footer.rights}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            All systems operational
          </div>
          <p className="text-xs text-muted-foreground">
            {t.footer.madeFor}
          </p>
        </div>
      </div>
    </footer>
  );
}
