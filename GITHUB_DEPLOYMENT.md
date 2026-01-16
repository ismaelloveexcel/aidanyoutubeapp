# GitHub Automated Deployment Guide

## 🚀 Free Automated Deployment with GitHub Actions + Fly.io

This guide shows you how to set up **completely free, automated deployment** for TubeStar Creator Studio using GitHub Actions and Fly.io's generous free tier.

### Why This Setup?

**✅ Completely Free**
- GitHub Actions: 2,000 CI/CD minutes/month (free tier)
- Fly.io: 3 shared VMs + 3GB PostgreSQL storage (free tier)
- No credit card required for GitHub Actions
- No auto-sleep on Fly.io free tier

**✅ Fully Automated**
- Push to `main` branch → Automatic deployment
- Build + Test + Security Scan → Deploy
- Zero manual commands after initial setup

**✅ Production Ready**
- Automatic HTTPS certificates
- Health checks and monitoring
- PostgreSQL database included
- Global CDN and edge network

---

## Prerequisites

1. **GitHub Account** - You already have this! 😊
2. **Fly.io Account** - Sign up at [fly.io](https://fly.io/signup) (free, no credit card needed)
3. **Git installed locally** - To push code changes

---

## Step 1: Set Up Fly.io Application

### 1.1 Install Fly.io CLI

**macOS/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows (PowerShell):**
```powershell
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 1.2 Login to Fly.io

```bash
fly auth login
```

This opens your browser for authentication.

### 1.3 Launch Your Application

From your project directory:

```bash
fly launch
```

**What happens:**
- Detects your app configuration from `fly.toml`
- Asks you to choose an app name (e.g., `tubestar-yourname`)
- Selects deployment region (choose closest to you)
- **Important**: Say **NO** to deploying now (we'll use GitHub Actions)

Example interaction:
```
? Choose an app name (leave blank to generate one): tubestar-demo-2024
? Choose a region for deployment: Amsterdam, Netherlands (ams)
? Would you like to deploy now? No
```

### 1.4 Create PostgreSQL Database

```bash
fly postgres create
```

Choose:
- **App name**: `tubestar-db` (or similar)
- **Region**: Same as your app
- **Configuration**: Development (free tier)

Attach database to your app:

```bash
fly postgres attach tubestar-db -a tubestar-demo-2024
```

Replace `tubestar-demo-2024` with your app name from step 1.3.

This automatically sets the `DATABASE_URL` secret.

### 1.5 Verify Your Fly.io Setup

```bash
fly status -a tubestar-demo-2024
```

You should see your app information (even though it's not deployed yet).

---

## Step 2: Configure GitHub Secrets

GitHub Actions needs permission to deploy to Fly.io. You'll add your Fly.io API token as a GitHub secret.

### 2.1 Get Your Fly.io API Token

```bash
fly auth token
```

This outputs your API token. **Copy it!** It looks like:
```
fo1_abc123xyz789...
```

### 2.2 Add Token to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add secret:
   - **Name**: `FLY_API_TOKEN`
   - **Secret**: Paste your token from step 2.1
6. Click **Add secret**

**🔒 Security Note**: Never commit API tokens to your code. GitHub Secrets are encrypted and only available to GitHub Actions.

---

## Step 3: Initial Deployment

Now that everything is configured, let's do the first deployment manually to initialize the database:

```bash
fly deploy
```

This builds and deploys your app for the first time. It takes 2-5 minutes.

### 3.1 Initialize Database Schema

After deployment completes, set up your database tables:

```bash
fly ssh console -a tubestar-demo-2024
npm run db:push
exit
```

### 3.2 Verify Deployment

Check your app is running:

```bash
fly status -a tubestar-demo-2024
fly open -a tubestar-demo-2024
```

Test the health endpoint:
```bash
curl https://tubestar-demo-2024.fly.dev/health
```

You should see: `{"status":"ok","timestamp":"..."}`

---

## Step 4: Enable Automated Deployment

Now that the initial setup is complete, every push to your `main` branch will automatically deploy!

### 4.1 How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on every push to `main`:

```
Push to main → GitHub Actions starts
    ↓
1. Build & Test Job
   - Checkout code
   - Install dependencies
   - Type check (TypeScript)
   - Build application
   - Verify build output
   - Security audit
    ↓
2. Security Scan Job (parallel)
   - CodeQL analysis
   - Detect security vulnerabilities
    ↓
3. Deploy Job (if build succeeds)
   - Deploy to Fly.io
   - Verify health
    ↓
Your app is live! 🎉
```

### 4.2 Test Automated Deployment

Make a small change and push:

```bash
# Make a change (e.g., update README)
echo "Test deployment" >> README.md

# Commit and push
git add README.md
git commit -m "Test automated deployment"
git push origin main
```

### 4.3 Monitor Deployment

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You'll see your workflow running
4. Click on it to see real-time logs

Typical deployment time: **2-4 minutes**

---

## Step 5: Configure Environment Variables (Optional)

If you need additional environment variables (like API keys):

### Via Fly.io CLI:

```bash
fly secrets set GEMINI_API_KEY=your-api-key-here -a tubestar-demo-2024
fly secrets set YOUTUBE_CLIENT_ID=your-client-id -a tubestar-demo-2024
fly secrets set YOUTUBE_CLIENT_SECRET=your-secret -a tubestar-demo-2024
```

### Via Fly.io Dashboard:

1. Go to [fly.io/dashboard](https://fly.io/dashboard)
2. Select your app
3. Go to **Secrets** section
4. Add secrets there

After adding secrets, restart your app:
```bash
fly restart -a tubestar-demo-2024
```

---

## Understanding the GitHub Actions Workflow

### Workflow Triggers

The workflow runs on:
- ✅ **Push to main branch** - Automatic deployment
- ✅ **Pull requests to main** - Build and test only (no deploy)
- ✅ **Manual trigger** - Via "Run workflow" button in GitHub Actions tab

### Jobs Breakdown

#### 1. Build and Test Job
- Checks out code
- Installs dependencies with caching (faster builds)
- Runs TypeScript type checking
- Builds production bundle
- Verifies build output exists
- Runs npm security audit

#### 2. Security Scan Job (Parallel)
- Runs CodeQL analysis
- Detects security vulnerabilities
- Results appear in GitHub Security tab

#### 3. Deploy Job
- Only runs on `main` branch pushes (not PRs)
- Requires build-and-test to succeed
- Deploys to Fly.io using your API token
- Verifies deployment health

---

## Monitoring Your Deployment

### View Logs

**Real-time logs:**
```bash
fly logs -a tubestar-demo-2024
```

**Follow logs:**
```bash
fly logs -a tubestar-demo-2024 --follow
```

### Check Status

```bash
fly status -a tubestar-demo-2024
```

### Monitor Resources

```bash
fly vm status -a tubestar-demo-2024
```

### Web Dashboard

Open Fly.io dashboard:
```bash
fly dashboard
```

Or visit: [fly.io/dashboard](https://fly.io/dashboard)

---

## Custom Domain Setup (Optional)

To use your own domain (e.g., `tubestar.com`):

### 1. Add Certificate

```bash
fly certs add tubestar.com -a tubestar-demo-2024
fly certs add www.tubestar.com -a tubestar-demo-2024
```

### 2. Update DNS

At your domain registrar, add these DNS records:

**For tubestar.com:**
- Type: `A`
- Name: `@`
- Value: (IP addresses shown in previous command)

**For www.tubestar.com:**
- Type: `CNAME`
- Name: `www`
- Value: `tubestar-demo-2024.fly.dev`

### 3. Wait for DNS Propagation

Usually takes 5-60 minutes. Check status:

```bash
fly certs show tubestar.com -a tubestar-demo-2024
```

### 4. Update CORS Settings

After domain is active, update allowed origins:

```bash
fly secrets set ALLOWED_ORIGINS=https://tubestar.com,https://www.tubestar.com -a tubestar-demo-2024
```

---

## Staying Within Free Tier Limits

Fly.io free tier includes:
- ✅ 3 shared-cpu VMs (256MB RAM each)
- ✅ 3GB PostgreSQL storage
- ✅ 160GB outbound bandwidth/month
- ✅ No time limits or auto-sleep

**Current Configuration** (in `fly.toml`):
```toml
min_machines_running = 0  # Auto-stop when idle
auto_stop_machines = 'stop'
auto_start_machines = true  # Auto-start on requests
```

This configuration:
- Stops VMs when idle (saves resources)
- Starts VMs automatically on incoming requests
- Keeps you well within free tier limits

**Monitor Usage:**
```bash
fly dashboard billing
```

---

## Troubleshooting

### Deployment Fails in GitHub Actions

**Check workflow logs:**
1. Go to GitHub → Actions tab
2. Click on failed workflow
3. Expand failed step to see error

**Common issues:**
- ❌ `FLY_API_TOKEN` not set → Add it in GitHub Secrets (Step 2)
- ❌ Build fails → Run `npm run build` locally to debug
- ❌ Type errors → Run `npx tsc --noEmit` locally

### Database Connection Issues

**Verify DATABASE_URL is set:**
```bash
fly secrets list -a tubestar-demo-2024
```

Should show `DATABASE_URL`.

**Check database status:**
```bash
fly status -a tubestar-db
```

**Reconnect database:**
```bash
fly postgres attach tubestar-db -a tubestar-demo-2024
```

### App Not Responding

**Check app status:**
```bash
fly status -a tubestar-demo-2024
```

**View recent logs:**
```bash
fly logs -a tubestar-demo-2024
```

**Restart app:**
```bash
fly restart -a tubestar-demo-2024
```

### Build Exceeds Memory

**Use more memory temporarily:**
```bash
fly deploy --vm-memory 1024
```

### Health Check Failures

**Test health endpoint:**
```bash
curl https://tubestar-demo-2024.fly.dev/health
```

If it fails, check logs for errors:
```bash
fly logs -a tubestar-demo-2024
```

---

## Scaling Your App

### Current Setup (Free Tier)

```toml
# fly.toml
memory_mb = 1024  # 1GB RAM per VM
min_machines_running = 0  # Auto-stop when idle
```

### Scale Up (If Needed)

**Increase memory:**
```bash
fly scale memory 512 -a tubestar-demo-2024
```

**Run multiple instances:**
```bash
fly scale count 2 -a tubestar-demo-2024
```

**Scale back down:**
```bash
fly scale count 1 -a tubestar-demo-2024
```

---

## Development Workflow

### Recommended Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and test locally
npm run dev

# 3. Commit changes
git add .
git commit -m "Add new feature"

# 4. Push feature branch
git push origin feature/new-feature

# 5. Create Pull Request on GitHub
# - GitHub Actions runs build & test
# - Review changes
# - Merge to main

# 6. Main branch auto-deploys to production!
```

### Local Development

```bash
# Start development server
npm run dev

# Open http://localhost:5000
```

### Testing Production Build Locally

```bash
# Build
npm run build

# Start production server
NODE_ENV=production npm start

# Open http://localhost:5000
```

---

## Rollback a Deployment

If a deployment introduces bugs, you can rollback:

### View Deployment History

```bash
fly releases -a tubestar-demo-2024
```

### Rollback to Previous Version

```bash
fly releases rollback -a tubestar-demo-2024
```

Or rollback to specific version:
```bash
fly releases rollback v42 -a tubestar-demo-2024
```

---

## Security Best Practices

### ✅ Already Implemented

- ✅ Secrets stored in GitHub Secrets (not in code)
- ✅ HTTPS enforced automatically by Fly.io
- ✅ CodeQL security scanning in GitHub Actions
- ✅ npm audit runs on every build
- ✅ Helmet security headers configured
- ✅ CORS configured with environment variables
- ✅ Rate limiting enabled

### 🔒 Additional Recommendations

1. **Enable Dependabot** (automatic security updates):
   - Go to GitHub → Settings → Security → Dependabot
   - Enable "Dependabot alerts" and "Dependabot security updates"

2. **Review Security Alerts**:
   - Check GitHub → Security tab regularly
   - Address CodeQL findings

3. **Rotate API Tokens**:
   - Rotate `FLY_API_TOKEN` every 90 days
   - Generate new token: `fly auth token`
   - Update in GitHub Secrets

4. **Monitor Logs**:
   - Check Fly.io logs for suspicious activity
   - Set up alerts for errors

---

## Database Backups

### Manual Backup

```bash
# Connect to database
fly ssh console -a tubestar-db

# Create backup
pg_dump tubestar > backup-$(date +%Y%m%d).sql

# Exit
exit
```

### Automated Backups

Fly.io PostgreSQL includes:
- ✅ Daily automated backups (free tier)
- ✅ 7-day retention

**List backups:**
```bash
fly postgres backup list -a tubestar-db
```

### Restore from Backup

```bash
fly ssh console -a tubestar-db
psql tubestar < backup-20240115.sql
exit
```

---

## Cost Monitoring

### Free Tier Limits

Monitor your usage to stay within limits:

```bash
# View usage dashboard
fly dashboard billing
```

**Free tier includes:**
- 3 shared-cpu VMs
- 3GB PostgreSQL storage
- 160GB outbound bandwidth/month
- Unlimited inbound bandwidth

### Stay Within Free Tier

With current configuration (`min_machines_running = 0`), you should never exceed free tier limits for a small-to-medium traffic app.

**Warning signs:**
- Consistently high traffic (>160GB/month outbound)
- Database over 3GB
- Need for more than 3 VMs

If you exceed limits, Fly.io will contact you before charging.

---

## Alternative: Replit Deployment

If you prefer a visual interface over command line, see [DEPLOYMENT.md](./DEPLOYMENT.md) for Replit deployment instructions.

**Replit Pros:**
- Visual IDE (no terminal required)
- One-click import from GitHub
- Built-in database
- Good for beginners

**Replit Cons:**
- Apps sleep on free tier (wake time ~10-30s)
- Limited resources
- Less control

**GitHub + Fly.io Pros:**
- Professional CI/CD pipeline
- No auto-sleep
- More resources
- Better performance
- Full control

---

## Getting Help

### Resources

- **Fly.io Docs**: [fly.io/docs](https://fly.io/docs)
- **Fly.io Community**: [community.fly.io](https://community.fly.io)
- **GitHub Actions Docs**: [docs.github.com/actions](https://docs.github.com/actions)
- **Project Issues**: [GitHub Issues](https://github.com/ismaelloveexcel/aidanyoutubeapp/issues)

### Support Channels

- **Fly.io**: Community forum, Discord
- **GitHub Actions**: GitHub Community forum
- **App-specific**: Create an issue in this repository

---

## Quick Reference Commands

### Fly.io Commands

```bash
# View app status
fly status -a tubestar-demo-2024

# View logs
fly logs -a tubestar-demo-2024

# Deploy manually
fly deploy

# SSH into app
fly ssh console -a tubestar-demo-2024

# Restart app
fly restart -a tubestar-demo-2024

# Open in browser
fly open -a tubestar-demo-2024

# View dashboard
fly dashboard
```

### Git Commands

```bash
# Check status
git status

# Create feature branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "Description"

# Push to GitHub (triggers deployment if main branch)
git push origin main
```

### npm Commands

```bash
# Install dependencies
npm ci

# Development server
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Start production server
npm start

# Database migrations
npm run db:push
```

---

## Success! 🎉

You now have:
- ✅ Fully automated CI/CD pipeline
- ✅ Free production hosting on Fly.io
- ✅ Automatic security scanning
- ✅ PostgreSQL database with backups
- ✅ HTTPS and custom domain support
- ✅ Professional deployment workflow

**Every push to `main` automatically deploys your app to production!**

---

## Next Steps

1. ✅ Make a change and push to test automation
2. ✅ Add your domain (optional)
3. ✅ Set up monitoring/alerts
4. ✅ Review [SECURITY.md](./SECURITY.md) for security best practices
5. ✅ Enable Dependabot for security updates
6. ✅ Add error tracking (e.g., Sentry)
7. ✅ Set up uptime monitoring (e.g., UptimeRobot)

---

**Made with 💜 for young creators**
