# ARKANUM — Environment Variables Guide

## How to Generate AUTH_SECRET

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64))"
```

It will output something like: `xK9z8v2mN4pQ7rT1wY3bC5dF6gH8jL0=`

Copy that value — it's your AUTH_SECRET.

---

## Railway Variables (Copy-Paste)

Go to Railway Dashboard → Your App → Variables tab → Add each:

### Required Variables

```
AUTH_SECRET=xK9z8v2mN4pQ7rT1wY3bC5dF6gH8jL0=
```
(Replace with your generated secret)

```
NEXTAUTH_URL=https://your-app-name.up.railway.app
```
(Replace with your actual Railway URL)

```
NEXT_PUBLIC_APP_URL=https://your-app-name.up.railway.app
```
(Same as NEXTAUTH_URL)

```
OWNER_USDT_WALLET=your-trc20-wallet-address
```
(Your TRON wallet address for receiving payments)

### Optional Variables (Have Defaults)

```
PLATFORM_COMMISSION_PERCENT=20
```
(Platform takes 20% of contest entry fees)

```
PREMIUM_PRICE_USD=29.99
```
(Monthly premium subscription price)

```
CRYPTOMUS_API_KEY=
CRYPTOMUS_MERCHANT_ID=
```
(Leave empty if not using Cryptomus)

```
NOWPAYMENTS_API_KEY=
```
(Leave empty if not using NOWPayments)

### Auto-Provided by Railway

```
DATABASE_URL=postgresql://postgres:xxx@xxx.railway.app:5432/railway
```
(Railway provides this automatically when you add PostgreSQL)

---

## Local Development Variables

For running locally, create `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/arkanum?schema=public"
AUTH_SECRET="your-local-secret"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OWNER_USDT_WALLET="your-trc20-wallet"
PLATFORM_COMMISSION_PERCENT=20
PREMIUM_PRICE_USD=29.99
```

---

## Variable Descriptions

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| AUTH_SECRET | Yes | Random secret for session encryption |
| NEXTAUTH_URL | Yes | Full URL of your app (https://...) |
| NEXT_PUBLIC_APP_URL | Yes | Same as NEXTAUTH_URL |
| OWNER_USDT_WALLET | Yes | Your TRC20 wallet to receive payments |
| PLATFORM_COMMISSION_PERCENT | No | Default 20% |
| PREMIUM_PRICE_USD | No | Default $29.99 |
| CRYPTOMUS_API_KEY | No | For automatic crypto payments |
| CRYPTOMUS_MERCHANT_ID | No | For automatic crypto payments |
| NOWPAYMENTS_API_KEY | No | Alternative crypto gateway |

---

## After Setting Variables

1. Redeploy the app (Railway auto-redeploys on variable change)
2. Wait for build to complete
3. Open your app URL
4. Register an account
5. Make yourself admin via Railway Shell:
   ```bash
   npx prisma studio
   ```
6. Change your user's `role` from `USER` to `SUPER_ADMIN`
