# Railway Deployment Guide for TubeStar Creator Studio

## Quick Deploy to Railway

Railway offers $5 of free credits per month, which is enough for a small-to-medium traffic app. It provides excellent developer experience with automatic deployments and includes PostgreSQL.

### Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app) (free, GitHub login)
2. **GitHub Repository**: Fork or have access to this repository

---

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Connect GitHub Repository

1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub account
4. Select `ismaelloveexcel/aidanyoutubeapp` repository
5. Railway will detect the Node.js app automatically

### Step 2: Add PostgreSQL Database

1. In your project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway automatically creates the database and sets `DATABASE_URL`

### Step 3: Configure Environment Variables

Railway should auto-detect most settings, but verify:

1. Click on your service
2. Go to **"Variables"** tab
3. Ensure these are set:
   - `NODE_ENV` = `production` (should be auto-set)
   - `DATABASE_URL` = (auto-set when database is added)
   - `PORT` = `5000` (or let Railway auto-assign)

Add optional variables as needed:
```
GEMINI_API_KEY=your-api-key
YOUTUBE_CLIENT_ID=your-client-id
YOUTUBE_CLIENT_SECRET=your-client-secret
ALLOWED_ORIGINS=https://your-app.railway.app
```

### Step 4: Deploy

1. Railway automatically builds and deploys on detection
2. Monitor the deployment in the **"Deployments"** tab
3. Build takes 2-5 minutes for first deployment

### Step 5: Initialize Database

After deployment completes:

1. Click on your service
2. Go to **"Settings"** → **"Deploy"** section
3. Use the Railway CLI or web terminal:

**Option A - Via Railway CLI:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run database migration
railway run npm run db:push
```

**Option B - Via Web Terminal:**
1. In Railway dashboard, open your service
2. Click **"Shell"** tab (if available)
3. Run: `npm run db:push`

### Step 6: Get Your URL

1. In Railway dashboard, go to your service
2. Click **"Settings"** → **"Networking"**
3. Railway generates a public URL: `https://your-app.railway.app`
4. Or click **"Generate Domain"** for a custom Railway subdomain

### Step 7: Verify Deployment

Test your deployment:
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"..."}
```

---

## Option 2: Deploy via Railway CLI

For more control, use the Railway CLI:

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login and Initialize

```bash
# Login to Railway
railway login

# Initialize project
cd /path/to/aidanyoutubeapp
railway init
```

Choose:
- Create a new project or select existing
- Name your project (e.g., `tubestar-creator-studio`)

### Step 3: Add PostgreSQL

```bash
railway add --plugin postgresql
```

This creates a PostgreSQL database and sets `DATABASE_URL` automatically.

### Step 4: Deploy

```bash
railway up
```

Railway will:
1. Detect your Node.js app
2. Run `npm ci && npm run build`
3. Start with `npm start`
4. Deploy to Railway's infrastructure

### Step 5: Set Environment Variables

```bash
railway variables set NODE_ENV=production
railway variables set ALLOWED_ORIGINS=https://your-app.railway.app
```

### Step 6: Run Database Migrations

```bash
railway run npm run db:push
```

### Step 7: Open Your App

```bash
railway open
```

---

## Configuration Files

This repository includes `railway.json` for Railway-specific configuration:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Note**: Railway can also use the existing `Dockerfile` if you prefer container-based deployment.

---

## Automatic Deployments

Railway automatically deploys on every push to your connected branch (usually `main`):

1. Make code changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Railway automatically detects the push and redeploys

**Monitor deployments** in the Railway dashboard under **"Deployments"** tab.

---

## Custom Domain Setup

### Add Your Domain

1. In Railway dashboard, go to your service
2. Click **"Settings"** → **"Networking"** → **"Custom Domain"**
3. Click **"Add Domain"**
4. Enter your domain: `yourdomain.com`

### Update DNS Records

At your domain registrar, add a CNAME record:

- **Type**: CNAME
- **Name**: `@` (or subdomain like `www`)
- **Value**: Your Railway app URL (shown in Railway dashboard)

### Update Environment Variables

After domain is active:

```bash
railway variables set ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Monitoring and Logs

### View Logs

**Via Dashboard:**
1. Go to Railway dashboard
2. Click your service
3. Click **"Deployments"** → Select deployment → **"View Logs"**

**Via CLI:**
```bash
railway logs
```

### Monitor Resource Usage

1. Railway dashboard → Your project
2. View **"Metrics"** tab for:
   - CPU usage
   - Memory usage
   - Network traffic
   - Credit consumption

### Usage Limits

**Free Tier ($5/month credit):**
- Credits consumed based on resource usage
- ~500 hours of runtime (estimate, varies by usage)
- 100GB outbound bandwidth
- 1GB RAM per service
- 1 vCPU per service

**Typical consumption:**
- Small app: ~$3-5/month (within free tier)
- Medium traffic: May need to upgrade

**Monitor usage:** Railway dashboard → Billing section

---

## Database Management

### Access Database

**Via Railway CLI:**
```bash
# Get database connection URL
railway variables

# Connect to PostgreSQL
railway connect postgres
```

**Via Dashboard:**
1. Click on PostgreSQL service
2. Go to **"Connect"** tab
3. Copy connection string or use web SQL client

### Backups

Railway doesn't include automatic backups on free tier. Manual backup:

```bash
# Get DATABASE_URL from Railway
railway variables | grep DATABASE_URL

# Backup database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

For production, consider:
- Paid Railway plan with automated backups
- External backup service
- Regular manual backups via cron job

---

## Scaling and Optimization

### Increase Resources

Railway automatically scales within your plan limits. For more resources:

1. Go to **"Settings"** → **"Resources"**
2. Adjust memory allocation (costs credits)
3. Add more services or databases

### Optimize Credit Usage

To stay within free tier:
1. **Enable auto-sleep** (if available in Railway)
2. **Optimize database queries** to reduce CPU time
3. **Use caching** (add Redis if needed)
4. **Compress responses** (already configured in app)
5. **Monitor metrics** regularly

---

## Troubleshooting

### Build Failures

**Error**: "npm ci failed"
- Check `package-lock.json` is committed
- View build logs in Railway dashboard
- Try re-running deployment

**Error**: "Build exceeds memory limit"
- Railway builds use 8GB RAM by default
- If issues persist, contact Railway support

### Database Connection Issues

**Error**: "Cannot connect to database"
- Verify PostgreSQL service is running
- Check `DATABASE_URL` is set: `railway variables`
- Ensure database and app are in same Railway project

### App Not Starting

**Error**: Port binding issues
- Railway auto-assigns `PORT` environment variable
- Ensure your app uses `process.env.PORT`
- Current app defaults to 5000 but can be overridden

### Out of Credits

**Error**: "Service stopped due to insufficient credits"
- Check credit balance: Railway dashboard → Billing
- Free tier: $5/month (resets monthly)
- Upgrade to paid plan if needed
- Optimize resource usage to reduce consumption

---

## Migration from Other Platforms

### From Fly.io

1. Export database:
   ```bash
   fly postgres backup create -a your-postgres-app
   ```
2. Deploy to Railway (steps above)
3. Import database:
   ```bash
   railway connect postgres < backup.sql
   ```

### From Replit

1. Export database from Replit
2. Deploy to Railway
3. Import database using Railway CLI

### From Vercel

If currently using serverless:
1. Railway better suited for stateful apps
2. No code changes needed
3. Just deploy and configure database

---

## Comparison: Railway vs Alternatives

| Feature | Railway | Fly.io | Replit | Render |
|---------|---------|--------|--------|--------|
| **Free Tier** | $5 credit/month | 3 VMs, no credit | Limited, auto-sleep | 750 hours/month |
| **Auto-Sleep** | No | No | Yes (free tier) | Yes (15 min) |
| **PostgreSQL** | Included | 3GB free | Included | 90-day free |
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **CI/CD** | Auto-deploy | GitHub Actions | Git sync | Auto-deploy |
| **Best For** | Quick setup, dev apps | Production, always-on | Beginners, learning | Side projects |

---

## Cost Management

### Staying in Free Tier

To maximize your $5 monthly credit:

1. **Single service deployment** (don't over-provision)
2. **Optimize code** (reduce CPU/memory usage)
3. **Monitor usage** weekly in dashboard
4. **Use Railway for dev**, other platform for production if needed

### When to Upgrade

Consider Railway Pro ($5/month + usage) if:
- Consistently exceeding $5 credit
- Need more than 100GB bandwidth
- Require automated backups
- Need priority support

---

## Getting Help

### Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Railway Status**: [status.railway.app](https://status.railway.app)
- **Project Issues**: [GitHub Issues](https://github.com/ismaelloveexcel/aidanyoutubeapp/issues)

### Support Channels

- Railway Discord (fastest response)
- Railway Help Center
- GitHub Discussions (for app-specific issues)

---

## Quick Reference Commands

### Railway CLI Commands

```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# View logs
railway logs

# Open in browser
railway open

# Add PostgreSQL
railway add --plugin postgresql

# Run commands
railway run npm run db:push

# View variables
railway variables

# Set variable
railway variables set KEY=value

# Connect to database
railway connect postgres

# Link to project
railway link

# Status
railway status
```

---

## Success! 🎉

You now have TubeStar Creator Studio deployed on Railway with:
- ✅ Automatic deployments on git push
- ✅ PostgreSQL database included
- ✅ HTTPS automatically configured
- ✅ Custom domain support
- ✅ Resource monitoring

**Every push to your connected branch automatically redeploys!**

---

## Next Steps

1. ✅ Test all features in production
2. ✅ Set up custom domain (optional)
3. ✅ Configure monitoring/alerts
4. ✅ Set up regular database backups
5. ✅ Review [SECURITY.md](./SECURITY.md) for security best practices
6. ✅ Monitor credit usage to stay within free tier
7. ✅ Add error tracking (e.g., Sentry)

---

**Made with 💜 for young creators**
