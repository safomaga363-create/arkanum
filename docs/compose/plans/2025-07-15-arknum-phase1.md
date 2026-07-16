# ARKANUM Phase 1 — Project Init, Design System, Docker

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the ARKANUM platform with Next.js 15, dark fantasy theme, i18n support, Docker infrastructure, and core layout components.

**Architecture:** Next.js 15 App Router with shadcn/ui components customized for a dark fantasy theme. PostgreSQL + Redis in Docker. next-intl for EN/RU localization.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, next-intl, Docker, PostgreSQL, Redis

## Global Constraints

- Next.js 15 App Router (NOT Pages Router)
- TypeScript strict mode
- Tailwind CSS for all styling (no CSS modules)
- shadcn/ui component library (NOT Radix directly)
- next-intl for i18n (EN + RU)
- Dark theme only (no light mode toggle)
- All colors via CSS custom properties for theme consistency
- Node.js 20+ required
- Docker Compose for local dev

---

## Task 1: Initialize Next.js Project

**Covers:** [S2, S3]

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `src/lib/utils.ts`

**Interfaces:**
- Produces: working Next.js app with TypeScript + Tailwind

- [ ] **Step 1: Create Next.js project**

```bash
cd C:\Users\admin\Desktop\ARKANUM
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

Select defaults when prompted. This creates the base project structure.

- [ ] **Step 2: Install core dependencies**

```bash
npm install next-intl @auth/prisma-adapter @prisma/client next-auth@beta
npm install -D prisma
```

- [ ] **Step 3: Initialize Prisma**

```bash
npx prisma init
```

This creates `prisma/schema.prisma` and `.env` with DATABASE_URL.

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on http://localhost:3000, default Next.js page renders.

- [ ] **Step 5: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js 15 project with TypeScript and Tailwind"
```

---

## Task 2: Set Up shadcn/ui

**Covers:** [S3]

**Files:**
- Create: `components.json` (shadcn config)
- Create: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, etc.
- Modify: `tailwind.config.ts` (shadcn theme)

**Interfaces:**
- Produces: shadcn/ui components available for use

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

Select: New York style, Zinc base color, CSS variables = yes.

- [ ] **Step 2: Add core components**

```bash
npx shadcn@latest add button card input label badge separator avatar dropdown-menu sheet navigation-menu
```

- [ ] **Step 3: Verify components render**

Edit `src/app/page.tsx` to render a shadcn Button:

```tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button>ARKANUM Test</Button>
    </div>
  );
}
```

Run dev server, verify button renders with default styling.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add shadcn/ui components"
```

---

## Task 3: Dark Fantasy Theme System

**Covers:** [S3]

**Files:**
- Modify: `src/app/globals.css` (CSS custom properties)
- Modify: `tailwind.config.ts` (extend colors, fonts)
- Create: `src/lib/theme.ts` (theme constants)

**Interfaces:**
- Produces: CSS custom properties for dark theme, extended Tailwind config

- [ ] **Step 1: Define CSS custom properties in globals.css**

Replace the content of `src/app/globals.css` with:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: #0a0a0f;
  --color-foreground: #e4e4e7;
  --color-card: #111118;
  --color-card-foreground: #e4e4e7;
  --color-primary: #00f0ff;
  --color-primary-foreground: #0a0a0f;
  --color-secondary: #1a1a2e;
  --color-secondary-foreground: #e4e4e7;
  --color-muted: #16161f;
  --color-muted-foreground: #71717a;
  --color-accent: #8b5cf6;
  --color-accent-foreground: #ffffff;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;
  --color-border: #1e1e2e;
  --color-input: #1e1e2e;
  --color-ring: #00f0ff;
  --color-neon-cyan: #00f0ff;
  --color-neon-purple: #8b5cf6;
  --color-neon-pink: #ec4899;
  --color-neon-green: #10b981;
  --radius: 0.75rem;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Orbitron", ui-sans-serif, system-ui, sans-serif;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Glassmorphism utility */
.glass {
  background: rgba(17, 17, 24, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 240, 255, 0.1);
}

/* Neon glow effect */
.neon-glow {
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3), 0 0 30px rgba(0, 240, 255, 0.1);
}

.neon-text {
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3);
}

/* Runic border animation */
@keyframes runeGlow {
  0%, 100% { border-color: rgba(0, 240, 255, 0.2); }
  50% { border-color: rgba(0, 240, 255, 0.6); }
}

.rune-border {
  animation: runeGlow 3s ease-in-out infinite;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}
```

- [ ] **Step 2: Update tailwind.config.ts**

Add the dark class to the body and extend with custom colors:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        neon: {
          cyan: "var(--color-neon-cyan)",
          purple: "var(--color-neon-purple)",
          pink: "var(--color-neon-pink)",
          green: "var(--color-neon-green)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

- [ ] **Step 3: Update layout.tsx to use dark class and fonts**

```tsx
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ARKANUM — Premium Ethical Hacking Arena",
  description: "The premier platform for competitive ethical hacking challenges, CTF competitions, and cybersecurity learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify theme renders correctly**

Run dev server, verify:
- Dark background (#0a0a0f)
- Neon cyan primary color on buttons
- Glassmorphism works on cards
- Fonts load correctly (Orbitron for display, Inter for body)

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: implement dark fantasy theme with neon colors and glassmorphism"
```

---

## Task 4: i18n Setup (EN + RU)

**Covers:** [S2]

**Files:**
- Create: `src/i18n/config.ts`
- Create: `src/i18n/request.ts`
- Create: `messages/en.json`, `messages/ru.json`
- Modify: `next.config.ts`
- Create: `middleware.ts`

**Interfaces:**
- Produces: i18n routing, translation system

- [ ] **Step 1: Create i18n config**

```typescript
// src/i18n/config.ts
export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

- [ ] **Step 2: Create request file for next-intl**

```typescript
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { locales } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as any)) {
    locale = "en";
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Create translation files**

```json
// messages/en.json
{
  "common": {
    "appName": "ARKANUM",
    "tagline": "Premium Ethical Hacking Arena",
    "login": "Login",
    "register": "Register",
    "dashboard": "Dashboard",
    "competitions": "Competitions",
    "leaderboard": "Leaderboard",
    "tracks": "Learning Tracks",
    "challenges": "Challenges",
    "profile": "Profile",
    "settings": "Settings",
    "logout": "Logout"
  },
  "home": {
    "hero": {
      "title": "Master the Art of Ethical Hacking",
      "subtitle": "Compete in premium CTF challenges, climb the ranks, and prove your skills in the ultimate cybersecurity arena.",
      "cta": "Enter the Arena",
      "secondary": "Explore Tracks"
    },
    "features": {
      "competitions": {
        "title": "Live Competitions",
        "description": "Join real-time hacking competitions with prize pools and global rankings."
      },
      "tracks": {
        "title": "Learning Tracks",
        "description": "Structured paths from beginner to expert with progress tracking."
      },
      "rewards": {
        "title": "Earn Rewards",
        "description": "Win USDT prizes, climb the leaderboard, and unlock exclusive content."
      }
    }
  },
  "auth": {
    "loginTitle": "Welcome Back",
    "loginSubtitle": "Enter your credentials to access the arena",
    "registerTitle": "Join the Arena",
    "registerSubtitle": "Create your account and start your journey",
    "email": "Email",
    "password": "Password",
    "username": "Username",
    "confirmPassword": "Confirm Password",
    "forgotPassword": "Forgot password?",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?",
    "ageRestriction": "You must be 18+ to register"
  }
}
```

```json
// messages/ru.json
{
  "common": {
    "appName": "АРКАНУМ",
    "tagline": "Премиальная арена этичного хакерства",
    "login": "Войти",
    "register": "Регистрация",
    "dashboard": "Панель управления",
    "competitions": "Конкурсы",
    "leaderboard": "Таблица лидеров",
    "tracks": "Обучающие пути",
    "challenges": "Челленджи",
    "profile": "Профиль",
    "settings": "Настройки",
    "logout": "Выйти"
  },
  "home": {
    "hero": {
      "title": "Овладей Искусством Этичного Хакерства",
      "subtitle": "Соревнуйся в премиальных CTF-челленджах, поднимайся в рейтинге и докажи свои навыки на главной арене кибербезопасности.",
      "cta": "Войти в Арену",
      "secondary": "Изучить Пути"
    },
    "features": {
      "competitions": {
        "title": "Живые Конкурсы",
        "description": "Участвуй в соревнованиях в реальном времени с призовыми фондами и мировым рейтингом."
      },
      "tracks": {
        "title": "Обучающие Пути",
        "description": "Структурированные маршруты от новичка до эксперта с отслеживанием прогресса."
      },
      "rewards": {
        "title": "Получай Награды",
        "description": "Выигрывай призы в USDT, поднимайся в рейтинге и открывай эксклюзивный контент."
      }
    }
  },
  "auth": {
    "loginTitle": "С Возвращением",
    "loginSubtitle": "Войдите в свой аккаунт для доступа к арене",
    "registerTitle": "Присоединяйся к Арене",
    "registerSubtitle": "Создай аккаунт и начни своё путешествие",
    "email": "Электронная почта",
    "password": "Пароль",
    "username": "Имя пользователя",
    "confirmPassword": "Подтвердите пароль",
    "forgotPassword": "Забыли пароль?",
    "noAccount": "Нет аккаунта?",
    "hasAccount": "Уже есть аккаунт?",
    "ageRestriction": "Вам должно быть 18+ для регистрации"
  }
}
```

- [ ] **Step 4: Update next.config.ts**

```typescript
// next.config.ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 5: Create middleware for locale routing**

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./src/i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

- [ ] **Step 6: Create localized layout structure**

Rename `src/app/page.tsx` to `src/app/[locale]/page.tsx` and update:

```tsx
// src/app/[locale]/page.tsx
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations("home");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-display text-4xl font-bold neon-text">
        {t("hero.title")}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {t("hero.subtitle")}
      </p>
      <div className="mt-8 flex gap-4">
        <Button size="lg" className="neon-glow">
          {t("hero.cta")}
        </Button>
        <Button size="lg" variant="outline">
          {t("hero.secondary")}
        </Button>
      </div>
    </div>
  );
}
```

Update `src/app/layout.tsx` to handle locale:

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ARKANUM",
  description: "Premium Ethical Hacking Arena",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

Create `src/app/[locale]/layout.tsx`:

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Orbitron } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={params.locale} className="dark">
      <body className={`${inter.variable} ${orbitron.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Verify i18n works**

Run dev server:
- `http://localhost:3000/en` → English content
- `http://localhost:3000/ru` → Russian content
- `http://localhost:3000` → Redirects to `/en`

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add i18n support with EN and RU translations"
```

---

## Task 5: Core Layout Components

**Covers:** [S3, S5]

**Files:**
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/layout/mobile-nav.tsx`

**Interfaces:**
- Produces: reusable layout components for all pages

- [ ] **Step 1: Create Header component**

```tsx
// src/components/layout/header.tsx
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "./mobile-nav";
import { Menu, Shield } from "lucide-react";

export function Header() {
  const t = useTranslations("common");

  return (
    <header className="sticky top-0 z-50 border-b border-border glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="font-display text-xl font-bold neon-text">
            {t("appName")}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/competitions"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t("competitions")}
          </Link>
          <Link
            href="/tracks"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t("tracks")}
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t("leaderboard")}
          </Link>
          <Link
            href="/challenges"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t("challenges")}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button asChild className="neon-glow">
            <Link href="/register">{t("register")}</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 glass">
            <MobileNav />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create MobileNav component**

```tsx
// src/components/layout/mobile-nav.tsx
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

export function MobileNav() {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <span className="font-display text-lg font-bold neon-text">
          {t("appName")}
        </span>
      </Link>

      <nav className="flex flex-col gap-4">
        <Link
          href="/competitions"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {t("competitions")}
        </Link>
        <Link
          href="/tracks"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {t("tracks")}
        </Link>
        <Link
          href="/leaderboard"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {t("leaderboard")}
        </Link>
        <Link
          href="/challenges"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {t("challenges")}
        </Link>
      </nav>

      <Separator />

      <div className="flex flex-col gap-2">
        <Button variant="outline" asChild>
          <Link href="/login">{t("login")}</Link>
        </Button>
        <Button asChild className="neon-glow">
          <Link href="/register">{t("register")}</Link>
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Footer component**

```tsx
// src/components/layout/footer.tsx
import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold neon-text">
                ARKANUM
              </span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Premium Ethical Hacking Arena
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/competitions" className="hover:text-primary transition-colors">Competitions</Link></li>
              <li><Link href="/tracks" className="hover:text-primary transition-colors">Learning Tracks</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/ethical-rules" className="hover:text-primary transition-colors">Ethical Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://discord.gg/arknum" className="hover:text-primary transition-colors">Discord</a></li>
              <li><a href="https://github.com/arknum" className="hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ARKANUM. All rights reserved.</p>
          <p className="mt-1">White-hat only. Age 18+.</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create page layout wrapper**

```tsx
// src/components/layout/page-layout.tsx
import { Header } from "./header";
import { Footer } from "./footer";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Update homepage to use PageLayout**

```tsx
// src/app/[locale]/page.tsx
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords, BookOpen, Trophy } from "lucide-react";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations("home");

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold neon-text">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="neon-glow text-lg px-8">
              {t("hero.cta")}
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              {t("hero.secondary")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass rune-border">
              <CardHeader>
                <Swords className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="font-display">
                  {t("features.competitions.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t("features.competitions.description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass rune-border">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="font-display">
                  {t("features.tracks.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t("features.tracks.description")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass rune-border">
              <CardHeader>
                <Trophy className="h-10 w-10 text-neon-green mb-2" />
                <CardTitle className="font-display">
                  {t("features.rewards.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {t("features.rewards.description")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
```

- [ ] **Step 6: Verify all components render**

Run dev server, verify:
- Header with logo, nav links, auth buttons
- Hero section with title, subtitle, CTAs
- Feature cards with glassmorphism effect
- Footer with links and copyright
- Mobile hamburger menu works

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add core layout components (header, footer, page-layout)"
```

---

## Task 6: Docker Infrastructure

**Covers:** [S5, S7]

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `.dockerignore`
- Create: `.env.example`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces: Docker setup for local development and production

- [ ] **Step 1: Create Dockerfile**

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

- [ ] **Step 2: Update next.config.ts for standalone output**

```typescript
// next.config.ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 3: Create docker-compose.yml**

```yaml
# docker-compose.yml
version: "3.8"

services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: arknum
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-arknum_dev_2024}
      POSTGRES_DB: arknum
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U arknum"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://arknum:${POSTGRES_PASSWORD:-arknum_dev_2024}@db:5432/arknum
      REDIS_URL: redis://redis:6379
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:-your-secret-key-change-in-production}
      NEXTAUTH_URL: ${NEXTAUTH_URL:-http://localhost:3000}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
```

- [ ] **Step 4: Create .dockerignore**

```
node_modules
.next
.git
.gitignore
*.md
.env
.env.local
docker-compose.yml
Dockerfile
.dockerignore
```

- [ ] **Step 5: Create .env.example**

```env
# Database
DATABASE_URL=postgresql://arknum:arknum_dev_2024@localhost:5432/arknum

# Redis
REDIS_URL=redis://localhost:6379

# Auth.js
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Payments (USDT TRC20)
CRYPTOMUS_API_KEY=
CRYPTOMUS_MERCHANT_ID=
NOWPAYMENTS_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 6: Create health check API route**

```typescript
// src/app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
```

- [ ] **Step 7: Test Docker builds**

```bash
# Test build
docker-compose build

# Start services
docker-compose up -d

# Verify all services healthy
docker-compose ps

# Check app accessible
curl http://localhost:3000/api/health

# Stop services
docker-compose down
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add Docker infrastructure with PostgreSQL, Redis, and health checks"
```

---

## Task 7: Create Placeholder Pages

**Covers:** [S5]

**Files:**
- Create: `src/app/[locale]/login/page.tsx`
- Create: `src/app/[locale]/register/page.tsx`
- Create: `src/app/[locale]/dashboard/page.tsx`
- Create: `src/app/[locale]/competitions/page.tsx`
- Create: `src/app/[locale]/leaderboard/page.tsx`
- Create: `src/app/[locale]/tracks/page.tsx`
- Create: `src/app/[locale]/challenges/page.tsx`
- Create: `src/app/[locale]/profile/page.tsx`
- Create: `src/app/[locale]/settings/page.tsx`
- Create: `src/app/[locale]/admin/page.tsx`

**Interfaces:**
- Produces: page stubs for all routes

- [ ] **Step 1: Create all placeholder pages**

Create each page with a consistent pattern:

```tsx
// src/app/[locale]/login/page.tsx
import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto glass">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Login</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Login form coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
```

Repeat for all pages with appropriate titles:
- `/login` → "Login"
- `/register` → "Register"
- `/dashboard` → "Dashboard"
- `/competitions` → "Competitions"
- `/leaderboard` → "Leaderboard"
- `/tracks` → "Learning Tracks"
- `/challenges` → "Challenges"
- `/profile` → "Profile"
- `/settings` → "Settings"
- `/admin` → "Admin Panel"

- [ ] **Step 2: Verify all routes work**

Run dev server and navigate to each route, verify they render correctly.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add placeholder pages for all routes"
```

---

## Task 8: Final Verification

**Covers:** [S1-S9]

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Run linting**

```bash
npm run lint
```

Expected: No errors (warnings acceptable).

- [ ] **Step 3: Test Docker deployment**

```bash
docker-compose up -d --build
docker-compose ps
curl http://localhost:3000/api/health
```

Expected: All services healthy, app responds.

- [ ] **Step 4: Test i18n routing**

```bash
curl -I http://localhost:3000/
curl -I http://localhost:3000/en
curl -I http://localhost:3000/ru
```

Expected: Proper redirects and content.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: Phase 1 complete - project init, theme, i18n, Docker"
```

---

## Summary

Phase 1 delivers:
- ✅ Next.js 15 project with TypeScript
- ✅ shadcn/ui component library
- ✅ Dark fantasy theme (neon colors, glassmorphism, runic effects)
- ✅ i18n with EN + RU translations
- ✅ Core layout (header, footer, mobile nav)
- ✅ Docker infrastructure (PostgreSQL, Redis, health checks)
- ✅ Placeholder pages for all routes
- ✅ Build and deployment ready

**Next:** Phase 2 — Database schema, Auth.js, User model, balance system
