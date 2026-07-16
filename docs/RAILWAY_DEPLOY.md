# ARKANUM — Railway Deployment Guide

## Quick Deploy (5 minutes)

### Step 1: Push to GitHub

```bash
cd ARKANUM
git add .
git commit -m "Initial commit: ARKANUM platform"
```

Create a new repository on GitHub (public or private), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/arkanum.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

### Step 3: Add PostgreSQL Database

1. In your Railway project, click "New" → "Database" → "PostgreSQL"
2. Wait for it to deploy
3. Copy the `DATABASE_URL` from the database variables

### Step 4: Deploy the App

1. Click "New" → "GitHub Repo"
2. Select your `arkanum` repository
3. Railway will auto-detect Next.js and deploy

### Step 5: Configure Environment Variables

Go to the app's "Variables" tab and add:

```
AUTH_SECRET=your-secret-here-run-openssl-rand-base64-32
NEXTAUTH_URL=https://your-app.up.railway.app
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
DATABASE_URL=postgresql://postgres:password@host:5432/railway
OWNER_USDT_WALLET=your-trc20-wallet-address
PLATFORM_COMMISSION_PERCENT=20
PREMIUM_PRICE_USD=29.99
```

**Note:** Railway auto-provides `DATABASE_URL` when you add PostgreSQL. You can reference it as `${{PostgreSQL.DATABASE_URL}}`.

### Step 6: Deploy

Railway will auto-deploy when you push to GitHub. Or click "Deploy" manually.

### Step 7: Initialize Database

After first deploy, go to "Deployments" → click latest → "View Logs" to verify.

Then run in Railway Shell (or locally with production URL):
```bash
npx prisma db push
npx prisma db seed
```

### Step 8: Create Admin Account

1. Open your Railway app URL
2. Register an account
3. Go to Railway Shell or use Prisma Studio:
   ```bash
   npx prisma studio
   ```
4. Find your user, change `role` from `USER` to `SUPER_ADMIN`

---

## Manual Deploy (Alternative)

If you prefer CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Add database
railway add postgresql

# Set environment variables
railway variables set AUTH_SECRET="your-secret"
railway variables set NEXTAUTH_URL="https://your-app.up.railway.app"
railway variables set OWNER_USDT_WALLET="your-wallet"

# Deploy
railway up

# Run database setup
railway run npx prisma db push
railway run npx prisma db seed
```

---

## Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| PostgreSQL | 500 MB, 100 hours/mo | $5/mo for 1 GB |
| App (hobby) | $5 credit/mo | $5/mo + usage |
| **Total** | **~$0-5/mo** | **$10-20/mo** |

Railway gives $5 free credit per month — enough for a small platform.

---

## Custom Domain (Optional)

1. In Railway dashboard, go to "Settings" → "Networking"
2. Click "Generate Domain" for a free `*.up.railway.app` URL
3. Or add your custom domain and update DNS

---

## Troubleshooting

### Build fails
- Check build logs in Railway dashboard
- Ensure `prisma generate` runs during build

### Database connection error
- Verify `DATABASE_URL` is set correctly
- Railway provides internal networking — use the internal URL

### App crashes on start
- Check deploy logs
- Ensure all environment variables are set

### Health check fails
- Railway checks `/api/health` endpoint
- Ensure database is connected
