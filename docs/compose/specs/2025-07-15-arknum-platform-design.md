# ARKANUM Platform — Design Spec

## [S1] Problem

Build a production-ready SaaS platform for ethical hacking competitions ("АРКАНУМ") that generates real revenue through:
- Competition entry fees (18–25% platform commission)
- Monthly premium subscriptions
- USDT (TRC20) as primary payment/withdrawal method

Owner is based in Tajikistan (Dushanbe). Platform must work 24/7, accept real payments, and enable simple USDT withdrawals.

## [S2] Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Auth | Auth.js v5 (Credentials + OAuth) |
| Cache | Redis (sessions, leaderboards, rate limiting) |
| Payments | USDT TRC20 (Cryptomus/NOWPayments integration) |
| Deployment | Docker + docker-compose |
| i18n | next-intl (EN + RU) |

## [S3] Design Language

Dark fantasy-cyber-magical theme:
- Base: deep dark (#0a0a0f), accent: neon cyan (#00f0ff), secondary: purple (#8b5cf6)
- Glassmorphism cards with backdrop-blur
- Runic decorative elements, subtle particle effects
- Typography: Inter (body) + Orbitron (headings/brand)
- Responsive: mobile-first, breakpoints at sm/md/lg/xl

## [S4] Core Entities

### User
- id, email, username, displayName, avatar
- xp (experience points), level, rank (Bronze→Diamond)
- balance (in-platform credits), usdtAddress (TRC20)
- role: USER | ADMIN | OWNER
- isPremium, premiumExpiresAt
- createdAt, updatedAt

### Competition
- id, title, description, difficulty (EASY/MEDIUM/HARD/EXPERT)
- entryFee (in USDT), prizePool, platformFee (18-25%)
- status: UPCOMING | ACTIVE | COMPLETED | CANCELLED
- startTime, endTime, maxParticipants
- creatorId (admin), challengeIds[]

### Challenge
- id, title, description, difficulty, category
- type: CTF | VULN_SCAN | CODE_AUDIT | CRYPTO | FORENSICS
- points, timeLimit (seconds)
- flag (for CTF), testCases, scoringRubric

### CompetitionEntry
- id, userId, competitionId, score, rank
- paidAt, amountPaid, status

### Transaction
- id, userId, type (DEPOSIT | WITHDRAWAL | ENTRY_FEE | PRIZE | SUBSCRIPTION)
- amount, currency (USDT), status (PENDING | COMPLETED | FAILED)
- txHash (blockchain), walletAddress

### Progress
- id, userId, trackId, completedChallenges[], currentChallenge
- totalXp, startedAt, lastActivityAt

### Subscription
- id, userId, plan (MONTHLY | YEARLY), status
- startDate, endDate, autoRenew

## [S5] Page Architecture

```
/                    — Landing page (hero, features, CTA)
/login               — Auth (login/register tabs)
/dashboard           — User dashboard (stats, balance, recent activity)
/leaderboard         — Global real-time leaderboard
/competitions        — Browse competitions
/competitions/[id]   — Competition detail + join
/tracks              — Learning paths
/tracks/[id]         — Track detail + progress
/challenges          — Standalone challenges
/challenges/[id]     — Challenge detail + solve
/profile/[username]  — Public profile
/settings            — Account settings, wallet, premium
/admin               — Admin panel (competitions, users, stats)
/admin/finance       — Owner finance dashboard (revenue, withdrawals)
```

## [S6] Monetization Flow

### Entry Fee Flow
1. User browses competitions → sees entry fee in USDT
2. User clicks "Join" → redirected to payment
3. Payment via Cryptomus/NOWPayments → USDT TRC20
4. On success: entry confirmed, 18-25% retained as platform fee
5. Remaining goes to prize pool

### Premium Subscription Flow
1. User sees premium badge + pricing on dashboard
2. Clicks "Subscribe" → monthly/yearly plan selection
3. Payment via same USDT gateway
4. Premium activated: no ads, priority entry, exclusive tracks

### Owner Withdrawal Flow
1. Owner sees revenue dashboard (total earned, pending, withdrawn)
2. Clicks "Withdraw" → enters TRC20 wallet address
3. Platform sends USDT from treasury wallet
4. Transaction logged with txHash

## [S7] Deployment Architecture

```
docker-compose.yml:
  - postgres:16 (port 5432, persistent volume)
  - redis:7-alpine (port 6379)
  - arknum-app (Next.js, port 3000)
  
Health checks: /api/health endpoint
Auto-restart: unless-stopped
Environment: .env file with all secrets
```

## [S8] Phases

| Phase | Scope | Key Deliverables |
|-------|-------|-----------------|
| 1 | Init + Structure + Docker + Base Design | Project scaffold, theme system, layout, Docker |
| 2 | DB + Auth + Users + Balances | Prisma schema, auth flow, user profiles, balance system |
| 3 | Learning Tracks + Progress | Tracks CRUD, challenge browser, progress tracking |
| 4 | Competitions + Entry Fee + USDT + Leaderboard | Competition lifecycle, payment integration, real-time ranks |
| 5 | Premium + Owner Dashboard + Withdrawals | Subscription system, revenue dashboard, USDT withdrawals |
| 6 | Admin Panel + Polish | Admin CRUD, analytics, UI polish, performance |
| 7 | Docker Hardening + Deploy Guide + README | Production config, deploy docs, README |

## [S9] Ethical Constraints

- All challenges run in sandboxed environments (Docker containers or browser-based)
- No real system exploitation — educational scenarios only
- Age restriction: 18+ (displayed on registration)
- Terms of Service: white-hat only, no unauthorized testing
- Content moderation on community features
