# ARKANUM — Premium Ethical Hacking Arena

<p align="center">
  <strong>The premier platform for competitive ethical hacking, CTF challenges, and cybersecurity learning.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql" />
  <img src="https://img.shields.io/badge/USDT-TRC20-26A17B?style=flat-square" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker" />
</p>

---

## Features

### For Users
- **Learning Paths** — Structured courses: Web Security, Cryptography, Binary Exploitation, Reverse Engineering, Forensics, Networking
- **200+ Challenges** — SQL injection, XSS, buffer overflow, RSA cracking, and more in sandboxed environments
- **Compete & Earn** — Join paid contests with entry fees. Top performers earn real USDT prizes
- **XP & Rank System** — Earn XP, level up, climb from Bronze to Legendary
- **Wallet** — Deposit/withdraw USDT (TRC20), track transaction history
- **Premium** — $29.99/mo for 2x XP, exclusive challenges, priority contest entry
- **Leaderboard** — Global rankings by XP

### For Owner
- **20% Commission** — Platform takes commission on every contest entry fee
- **Premium Revenue** — 100% of subscription revenue
- **Admin Panel** — Create contests, approve deposits/withdrawals, view analytics
- **USDT Withdrawal** — Withdraw earnings to your TRC20 wallet

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Backend | Next.js API Routes, Prisma ORM, Auth.js v5 |
| Database | PostgreSQL 16, Redis 7 |
| Payments | USDT (TRC20) via Cryptomus/NOWPayments |
| Containerization | Docker, Docker Compose |
| State Management | Zustand, React Query |

---

## Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or use Docker)
- npm

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ARKANUM
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/arkanum?schema=public"
AUTH_SECRET="run-openssl-rand-base64-32"
OWNER_USDT_WALLET="your-trc20-wallet-address"
```

### 3. Start Database

```bash
docker-compose up -d db redis
```

### 4. Initialize Database

```bash
npx prisma db push
npx prisma generate
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Create Admin Account

Register a user, then make them admin via Prisma Studio:

```bash
npx prisma studio
```

Find your user in the `users` table and change `role` from `USER` to `SUPER_ADMIN`.

---

## Docker Deployment (24/7)

### One-Command Deploy

```bash
# 1. Clone and configure
git clone <your-repo-url>
cd ARKANUM
cp .env.example .env
nano .env  # Set AUTH_SECRET, OWNER_USDT_WALLET

# 2. Build and start
docker-compose up -d --build

# 3. Initialize database
docker-compose exec app npx prisma db push
docker-compose exec app npm run db:seed

# 4. Verify
curl http://localhost:3000/api/health
```

### Docker Services

| Service | Port | Purpose |
|---------|------|---------|
| app | 3000 | Next.js application |
| db | 5432 | PostgreSQL database |
| redis | 6379 | Cache (optional) |

### Health Check

```bash
curl http://localhost:3000/api/health
# {"status":"ok","database":"connected","version":"1.0.0"}
```

### Auto-Restart

Docker Compose includes `restart: unless-stopped` — the app auto-restarts on crash or server reboot.

---

## VPS Deployment

### Recommended Providers

| Provider | Price | Payment | Notes |
|----------|-------|---------|-------|
| Hetzner | €4.50/mo | Crypto, Card | Best value, EU servers |
| DigitalOcean | $4/mo | Card, Crypto | Easy setup |
| Vultr | $2.50/mo | Crypto, Card | Global locations |
| Contabo | $5/mo | Card | Very affordable |

### Step-by-Step (Ubuntu 22.04)

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker && systemctl start docker
apt install docker-compose -y

# Deploy
git clone <your-repo-url>
cd ARKANUM
cp .env.example .env
nano .env  # Configure

docker-compose up -d --build
docker-compose exec app npx prisma db push
docker-compose exec app npm run db:seed

# Verify
docker-compose ps
curl localhost:3000/api/health
```

### SSL/HTTPS

```bash
apt install certbot nginx -y
certbot --nginx -d yourdomain.com

# Auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## USDT (TRC20) Payment Setup

### How It Works

```
User deposits USDT → Admin approves → Balance credited
User enters contest → Balance deducted → Prize pool funded
User wins → Prize distributed → Withdraws to TRC20 wallet
```

### For the Owner (Receiving Money)

1. **Get a TRC20 wallet**: Use TronLink, Trust Wallet, or Binance
2. **Set wallet in `.env`**: `OWNER_USDT_WALLET="your-address"`
3. **Users deposit**: They send USDT to your wallet, submit tx hash
4. **You approve**: In admin panel, verify and approve deposits
5. **Withdraw earnings**: Request withdrawal from admin panel to your wallet

### Payment Gateways (Optional)

For automatic payment verification:

**Cryptomus:**
1. Register at cryptomus.com
2. Get API key and Merchant ID
3. Add to `.env`:
   ```
   CRYPTOMUS_API_KEY=your-key
   CRYPTOMUS_MERCHANT_ID=your-id
   ```

**NOWPayments:**
1. Register at nowpayments.io
2. Get API key
3. Add to `.env`:
   ```
   NOWPAYMENTS_API_KEY=your-key
   ```

---

## Withdrawing Money to Tajikistan

### Recommended Flow

```
ARKANUM balance → USDT (TRC20) → Binance P2P → TJS → Bank card
```

### Step-by-Step

1. **In ARKANUM**: Wallet → Withdraw → Enter amount + TRC20 address
2. **Receive USDT** in your wallet (within 24 hours)
3. **Transfer to Binance**: Send USDT to your Binance account
4. **Sell for TJS**: Binance P2P → Sell USDT → Choose TJS buyer
5. **Receive TJS**: Buyer sends to your bank card (Visa/Mastercard)

### Fees

| Step | Fee |
|------|-----|
| ARKANUM withdrawal | 1% |
| TRC20 transfer | ~$1 |
| Binance P2P | 0.1-0.5% |
| **Total** | **~1.5-2%** |

### Minimum Withdrawal

- ARKANUM: $10 USDT
- Binance P2P: ~$10 equivalent

---

## Running Contests & Earning

### Revenue Model

| Source | Rate | Your Share |
|--------|------|------------|
| Contest entry fees | 20% commission | $0.20 per $1 entry |
| Premium subscriptions | 100% | $29.99/mo per user |

### Example

- 100 users × $25 entry = $2,500 prize pool
- Platform keeps 20% = **$500 per contest**
- 50 premium users × $29.99 = **$1,499.50/mo**
- **Monthly revenue: ~$2,000+**

### Growth Potential

| Month | Users | Revenue Estimate |
|-------|-------|-----------------|
| 1-2 | 100-500 | $500-2,000 |
| 3-4 | 500-2,000 | $2,000-10,000 |
| 5-6 | 2,000-5,000 | $10,000-30,000 |
| 7-12 | 5,000-20,000 | $30,000-100,000+ |

### Marketing Tips

1. Post challenges on Twitter/X, Reddit r/netsec, LinkedIn
2. Create YouTube walkthrough videos
3. Partner with cybersecurity Discord communities
4. University CS department partnerships
5. Referral program (give users commission for invites)

---

## Project Structure

```
ARKANUM/
├── prisma/
│   ├── schema.prisma          # 12 database models
│   └── seed.ts                # 20 challenges, 6 learning paths, 3 contests
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login, Register pages
│   │   ├── (main)/            # Dashboard, Challenges, Contests, etc.
│   │   ├── admin/             # Admin panel with contest creation
│   │   ├── api/               # 15+ API routes
│   │   ├── terms/             # Terms of Service
│   │   ├── privacy/           # Privacy Policy
│   │   └── ethics/            # Ethics Policy
│   ├── components/
│   │   ├── ui/                # 10 shadcn-style components
│   │   ├── layout/            # Navbar, Footer
│   │   └── landing/           # Hero, Features, Ranks, CTA
│   ├── lib/                   # auth.ts, prisma.ts, utils.ts
│   ├── store/                 # Zustand state
│   └── types/                 # TypeScript types
├── docker-compose.yml         # PostgreSQL + Redis + App
├── Dockerfile                 # Multi-stage production build
├── .env.example               # Environment template
└── README.md                  # This file
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check with DB status |
| `/api/auth/[...nextauth]` | GET/POST | Auth.js handlers |
| `/api/auth/register` | POST | User registration |
| `/api/challenges` | GET | List challenges (search, filter, paginate) |
| `/api/challenges/[id]` | GET | Challenge detail |
| `/api/challenges/progress` | GET/POST | Track challenge progress |
| `/api/learning-paths` | GET | List learning paths |
| `/api/contests` | GET/POST | List/create contests |
| `/api/contests/[id]` | GET | Contest detail with leaderboard |
| `/api/contests/enter` | POST | Enter contest (pay entry fee) |
| `/api/leaderboard` | GET | Global rankings |
| `/api/payments/deposit` | POST | Submit USDT deposit |
| `/api/payments/withdraw` | GET/POST | Withdrawal requests |
| `/api/payments/history` | GET | Payment history |
| `/api/payments/premium` | GET/POST | Premium subscription |
| `/api/admin/stats` | GET | Platform statistics |
| `/api/admin/deposits` | GET/POST | Approve/reject deposits |
| `/api/admin/withdrawals` | GET/POST | Approve/reject withdrawals |

---

## Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run start            # Production server
npm run db:push          # Push schema to database
npm run db:seed          # Seed with sample data
npm run db:studio        # Open Prisma Studio
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Secret for Auth.js sessions |
| `NEXTAUTH_URL` | Yes | App URL (e.g., http://localhost:3000) |
| `OWNER_USDT_WALLET` | Yes | Your TRC20 wallet address |
| `PLATFORM_COMMISSION_PERCENT` | No | Default: 20 |
| `CRYPTOMUS_API_KEY` | Optional | Cryptomus payment gateway |
| `NOWPAYMENTS_API_KEY` | Optional | NOWPayments gateway |
| `PREMIUM_PRICE_USD` | No | Default: 29.99 |

---

## License

Proprietary. All rights reserved.

---

<p align="center">
  <strong>ARKANUM — Enter the Arena. Earn USDT. Master Cybersecurity.</strong>
</p>
