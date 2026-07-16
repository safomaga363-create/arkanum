# Phase 2: Auth, Database, User Model — Implementation Plan

> **For agentic workers:** Use compose:subagent or compose:execute to implement this plan task-by-task.

**Goal:** Make the auth system fully functional — users can register, login, see session data, and access protected routes.

**Architecture:** Wire NextAuth v5 with a SessionProvider, add type augmentation, split auth config for Edge middleware, implement route protection, and make UI components session-aware.

**Tech Stack:** Next.js 15, Auth.js v5, Prisma, TypeScript, bcryptjs

## Global Constraints
- Next.js 15 App Router with `src/` directory
- Auth.js v5 beta (`next-auth@5.0.0-beta.25`)
- Tailwind CSS 4 with custom theme variables
- All client components need `"use client"` directive
- Use shadcn-style UI components from `src/components/ui/`

---

### Task 1: SessionProvider Wrapper + Root Layout Integration

**Files:**
- Create: `src/app/providers.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `next-auth/react` SessionProvider
- Produces: `Providers` component wrapping children, used in root layout

- [ ] **Step 1: Create providers.tsx**

```tsx
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

- [ ] **Step 2: Wrap root layout with Providers**

In `src/app/layout.tsx`, import and wrap:

```tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

### Task 2: NextAuth Type Augmentation

**Files:**
- Create: `src/types/next-auth.d.ts`

**Interfaces:**
- Produces: Extended `Session.user` with id, username, role, xp, level, rank, balance, totalEarned, isPremium

- [ ] **Step 1: Create type augmentation**

```ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      xp: number;
      level: number;
      rank: string;
      balance: number;
      totalEarned: number;
      isPremium: boolean;
    } & DefaultSession["user"];
  }
}
```

---

### Task 3: Split Auth Config for Edge Middleware

**Files:**
- Create: `src/lib/auth.config.ts`
- Modify: `src/lib/auth.ts` (import from auth.config)
- Modify: `src/middleware.ts` (use auth.config)

**Interfaces:**
- Consumes: Prisma, bcryptjs (main config only)
- Produces: Lightweight Edge-compatible auth config + NextAuth middleware export

- [ ] **Step 1: Create auth.config.ts**

```ts
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // authorize logic moved to auth.ts (server-side only)
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;
```

- [ ] **Step 2: Update auth.ts to import config**

Refactor `src/lib/auth.ts` to import from `auth.config.ts` and add the server-side authorize logic.

- [ ] **Step 3: Update middleware.ts**

```ts
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAuth = req.nextUrl.pathname.startsWith("/login") || 
                   req.nextUrl.pathname.startsWith("/register");
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isOnProtected = req.nextUrl.pathname.startsWith("/dashboard") ||
                        req.nextUrl.pathname.startsWith("/profile");

  if (isOnAdmin && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
  if (isOnProtected && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
  if (isOnAuth && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

### Task 4: Wire Up Login Page with Session

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`

**Interfaces:**
- Consumes: `next-auth/react` signIn, useSession
- Produces: Redirect to /dashboard on successful login

- [ ] **Step 1: Verify login page uses signIn correctly**

The current login page already uses `signIn("credentials", ...)` from next-auth/react. Verify the import path and ensure it works with the SessionProvider from Task 1. Add redirect to `/dashboard` after successful login using `router.push("/dashboard")`.

---

### Task 5: Sign-Out Functionality

**Files:**
- Modify: `src/app/(main)/layout.tsx` (sidebar user section)
- Modify: `src/app/(main)/profile/page.tsx` (sign out button)

**Interfaces:**
- Consumes: `next-auth/react` signOut, useSession

- [ ] **Step 1: Add signOut to sidebar**

In the main layout, add a signOut button that calls `signOut({ callbackUrl: "/" })`.

- [ ] **Step 2: Wire profile sign-out button**

The profile page already has a "Sign Out of All Devices" button. Wire it to `signOut()`.

---

### Task 6: Session-Aware UI Components

**Files:**
- Modify: `src/app/(main)/layout.tsx` (sidebar user info)
- Modify: `src/app/(main)/dashboard/page.tsx` (stats from session)

**Interfaces:**
- Consumes: `next-auth/react` useSession
- Produces: Dynamic user data in sidebar and dashboard

- [ ] **Step 1: Update sidebar with session data**

Replace hardcoded "Arena User" / "Bronze - 0 XP" with session.user data.

- [ ] **Step 2: Update dashboard with session data**

Replace hardcoded stats with actual session user data (xp, level, rank, balance, totalEarned).

---

### Task 7: Admin Route Protection

**Files:**
- Modify: `src/app/admin/layout.tsx` (create if needed)
- Modify: `src/middleware.ts`

**Interfaces:**
- Consumes: session user role
- Produces: Admin pages only accessible to ADMIN/SUPER_ADMIN roles

- [ ] **Step 1: Add admin role check to middleware**

The middleware from Task 3 already redirects unauthenticated users from /admin. Add a role check: if user is not ADMIN or SUPER_ADMIN, redirect to /dashboard.

---

### Task 8: Verification

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

- [ ] **Step 3: Verify auth flow manually**

1. Navigate to /register — create account
2. Navigate to /login — sign in
3. Verify redirect to /dashboard
4. Verify sidebar shows correct user info
5. Verify /profile sign out works
6. Verify /admin redirects for non-admin users
