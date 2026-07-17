"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Swords,
  Trophy,
  Zap,
  Menu,
  X,
  User,
  Crown,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn] = useState(false);
  const { t } = useI18n();

  const navLinks = [
    { href: "/challenges", label: t.nav.challenges, icon: Zap },
    { href: "/contests", label: t.nav.contests, icon: Swords },
    { href: "/leaderboard", label: t.nav.leaderboard, icon: Trophy },
    { href: "/premium", label: t.nav.premium, icon: Crown },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary transition-all group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-wider">
              <span className="neon-text">AR</span>
              <span className="text-foreground">KA</span>
              <span className="neon-text-purple">NUM</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                  {t.nav.dashboard}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {t.auth.login}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    <Zap className="h-4 w-4" />
                    {t.landing.getStarted}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border glass-strong">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <div className="px-3 pb-2">
                <LanguageSwitcher />
              </div>
              <Link href="/login" className="block" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  {t.auth.login}
                </Button>
              </Link>
              <Link href="/register" className="block mt-2" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">
                  <Zap className="h-4 w-4" />
                  {t.landing.getStarted}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
