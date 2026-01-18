# Render.com Deployment Guide for TubeStar Creator Studio

## Quick Deploy to Render

Render offers a generous free tier with 750 hours per month per service, which is perfect for personal projects and demos. It includes PostgreSQL and automatic HTTPS.

### Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com) (free, no credit card required)
2. **GitHub Repository**: Fork or have access to this repository

---

## Option 1: Deploy via Render Dashboard (Easiest)

### Step 1: Create Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select `ismaelloveexcel/aidanyoutubeapp` repository
5. Click **"Connect"**

### Step 2: Configure Web Service

Fill in the configuration:

| Field | Value |
|-------|-------|
| **Name** | `tubestar-creator-studio` |
| **Region** | Choose closest to you (Oregon, Frankfurt, Singapore) |
| **Branch** | `main` |
| **Root Directory** | Leave blank |
| **Environment** | `Node` |
| **Build Command** | `npm ci && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

Click **"Advanced"** and add:
- **Health Check Path**: `/health`
- **Auto-Deploy**: `Yes` (enables auto-deploy on git push)

### Step 3: Add PostgreSQL Database

Before creating the service, scroll down to **"Environment Variables"** section.

Then go back and create the database:

1. Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `tubestar-db`
   - **Database**: `tubestar`
   - **User**: `tubestar`
   - **Region**: Same as web service
   - **Plan**: `Free` (256MB RAM, 1GB storage)
3. Click **"Create Database"**

**Important**: Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 4: Configure Environment Variables

Back in your web service configuration, add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | (Paste the Internal Database URL from step 3) |
| `PORT` | `5000` |

Optional variables (add later via dashboard):
- `GEMINI_API_KEY` - For AI features
- `YOUTUBE_CLIENT_ID` - For YouTube integration
- `YOUTUBE_CLIENT_SECRET` - For YouTube integration
- `ALLOWED_ORIGINS` - Your Render URL (e.g., `https://tubestar-creator-studio.onrender.com`)

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render automatically starts building and deploying
3. Build takes 3-5 minutes for first deployment
4. Monitor progress in the **"Logs"** tab

### Step 6: Initialize Database Schema

After deployment completes, initialize the database:

**Option A - Via Render Shell:**
1. In Render dashboard, go to your web service
2. Click **"Shell"** tab in the top menu
3. Run in the shell:
   ```bash
   npm run db:push
   ```

**Option B - Via Local CLI with Render Database URL:**
```bash
# Copy DATABASE_URL from Render dashboard
DATABASE_URL="postgresql://user:pass@host/db" npm run db:push
```

### Step 7: Verify Deployment

1. Click on your service in Render dashboard
2. Copy the **public URL**: `https://tubestar-creator-studio.onrender.com`
3. Test the health endpoint:
   ```bash
   curl https://tubestar-creator-studio.onrender.com/health
   ```

Expected response:
```json
{"status":"ok","timestamp":"..."}
```

---

## Option 2: Deploy via Blueprint (render.yaml)

This repository includes `render.yaml` for infrastructure-as-code deployment.

### Step 1: Deploy from Blueprint

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render detects `render.yaml` automatically
5. Review the configuration:
   - Web service: `tubestar-creator-studio`
   - PostgreSQL: `tubestar-db`
6. Click **"Apply"**

Render creates both services and connects them automatically!

### Step 2: Verify Configuration

Check that environment variables are set:
1. Go to your web service
2. Click **"Environment"** tab
3. Verify `DATABASE_URL` is set (auto-connected from database)
4. Add any optional variables needed

### Step 3: Initialize Database

Follow Step 6 from Option 1 above.

---

## Blueprint Configuration (render.yaml)

This repository includes a `render.yaml` file:

```yaml
services:
  - type: web
    name: tubestar-creator-studio
    runtime: node
    buildCommand: npm ci && npm run build
    startCommand: npm start
    healthCheckPath: /health
    plan: free
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: tubestar-db
          property: connectionString

databases:
  - name: tubestar-db
    databaseName: tubestar
    user: tubestar
    plan: free
```

**Benefits of Blueprint:**
- Single-click deployment of entire stack
- Database automatically connected
- Version controlled infrastructure
- Easy to replicate environments

---

## Automatic Deployments

Render automatically deploys on every push to your connected branch:

1. Make code changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Render detects the push and automatically redeploys
4. Build takes 2-4 minutes
5. Zero-downtime deployment (on paid plans)

**Monitor deployments:** Render dashboard → Your service → **"Events"** tab

---

## Custom Domain Setup

### Add Your Domain

1. In Render dashboard, go to your web service
2. Click **"Settings"** → **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter your domain: `tubestar.com`

### Update DNS Records

At your domain registrar, add these records:

**For Apex Domain (tubestar.com):**
- **Type**: `A`
- **Name**: `@`
- **Value**: Render's IP addresses (shown in Render dashboard)

**For Subdomain (www.tubestar.com):**
- **Type**: `CNAME`
- **Name**: `www`
- **Value**: Your Render URL (e.g., `tubestar-creator-studio.onrender.com`)

### Update Environment Variables

After domain is active, update CORS:

1. Go to your service → **"Environment"**
2. Add or update:
   - `ALLOWED_ORIGINS` = `https://tubestar.com,https://www.tubestar.com`
3. Render automatically redeploys

### SSL Certificate

Render automatically provisions SSL certificates via Let's Encrypt:
- Free HTTPS for all custom domains
- Auto-renewal every 90 days
- No configuration needed

---

## Free Tier Limitations

### Web Service (Free Tier)
- **Auto-sleep**: Apps sleep after 15 minutes of inactivity
- **Wake time**: ~30 seconds cold start
- **Uptime**: 750 hours/month (enough for 1 always-on service)
- **Resources**: 512MB RAM, shared CPU
- **Bandwidth**: Generous (no specific limit published)
- **SSL**: Included

### PostgreSQL (Free Tier)
- **Storage**: 1GB
- **RAM**: 256MB
- **Expiry**: 90 days (warning shown, but data preserved)
- **Backups**: Not included (manual backups required)

### Important Notes

**Auto-sleep behavior:**
- First request after sleep takes ~30 seconds
- Keep-alive services can reduce sleep (not recommended for free tier)
- Consider upgrading to paid plan for always-on ($7/month)

**Database expiry:**
- After 90 days, Render shows expiry warning
- Data is preserved, database continues working
- Upgrade to paid plan ($7/month) for no expiry

---

## Monitoring and Logs

### View Logs

**Via Dashboard:**
1. Go to Render dashboard
2. Click your web service
3. Click **"Logs"** tab
4. Real-time log streaming

**Filter logs:**
- By date range
- By deploy event
- Search for specific text

### Monitor Resource Usage

**Metrics available:**
1. **Events**: Deployment history, restarts
2. **Logs**: Application output, errors
3. **Metrics** (paid plans): CPU, memory, requests

**Free tier monitoring:**
- Limited to logs and events
- No built-in metrics dashboard
- Consider external monitoring (e.g., UptimeRobot)

---

## Database Management

### Access Database

**Via Render Dashboard:**
1. Go to PostgreSQL service
2. Click **"Info"** tab
3. Use the connection details:
   - Internal URL (from web service)
   - External URL (from anywhere)

**Connection strings:**
- **Internal**: `postgresql://user:pass@host/db` (within Render)
- **External**: `postgresql://user:pass@external-host/db` (from local machine)

**Via psql:**
```bash
# Copy External Database URL from Render dashboard
psql "postgresql://user:pass@external-host/db"
```

### Manual Backups

Render free tier doesn't include automatic backups. To backup:

**Option 1 - Via Render Shell:**
```bash
# In your web service shell
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

**Option 2 - Via Local Machine:**
```bash
# Get External Database URL from Render
pg_dump "postgresql://user:pass@external-host/db" > backup.sql
```

**Restore from backup:**
```bash
psql "postgresql://user:pass@external-host/db" < backup.sql
```

### Backup Automation

For regular backups:
1. Use GitHub Actions to run scheduled backups
2. Store backups in GitHub repository (encrypt sensitive data)
3. Or use external backup service (e.g., automated pg_dump to S3)

---

## Preventing Auto-Sleep (Free Tier Workarounds)

### Option 1: External Keep-Alive Service (Recommended)

Use a free uptime monitoring service to ping your app every 10-14 minutes:

**UptimeRobot** (free tier):
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add a new monitor:
   - Type: HTTP(s)
   - URL: Your health endpoint (e.g., `https://your-app.onrender.com/health`)
   - Interval: 5 minutes (free tier)
3. UptimeRobot pings your app, preventing sleep

**Cron-Job.org** (free):
1. Sign up at [cron-job.org](https://cron-job.org)
2. Create a new cron job:
   - URL: Your health endpoint
   - Schedule: Every 10 minutes
3. Keeps app awake without violating Render ToS

**Note**: Render allows reasonable keep-alive for legitimate use cases. Avoid excessive pinging.

### Option 2: Upgrade to Paid Plan

Most reliable solution:
- **Paid plan**: $7/month per service
- Always-on (no sleep)
- Better performance
- No cold starts

---

## Scaling and Optimization

### Optimize for Free Tier

To maximize free tier benefits:

1. **Accept cold starts**: First request after sleep takes ~30 seconds
2. **Optimize build**: Faster builds = faster deploys
3. **Use caching**: Reduce database queries
4. **Compress responses**: Already configured in app
5. **Monitor 750 hour limit**: Track in Render dashboard

### Upgrade Options

When you outgrow free tier:

**Web Service Plans:**
- **Starter**: $7/month - Always-on, no sleep, better resources
- **Standard**: $25/month - More resources, faster builds
- **Pro**: $85/month - Dedicated resources, priority support

**Database Plans:**
- **Starter**: $7/month - 1GB storage, no expiry, backups included
- **Standard**: $20/month - 10GB storage, more RAM
- **Pro**: $90/month - 100GB storage, high availability

---

## Troubleshooting

### Build Failures

**Error**: "npm ci failed"
- Ensure `package-lock.json` is committed to git
- Check Render build logs for specific error
- Try re-deploying: Click **"Manual Deploy"** → **"Clear build cache & deploy"**

**Error**: "Build command timed out"
- Render has 15-minute build timeout
- Optimize build process or contact support

### Database Connection Issues

**Error**: "Cannot connect to database"
- Verify `DATABASE_URL` environment variable is set
- Use **Internal Database URL** (not External) for web service
- Check database is running: Go to database service, ensure status is "Available"

**Error**: "Too many connections"
- PostgreSQL free tier has connection limits
- Ensure app properly closes connections
- Consider connection pooling (e.g., PgBouncer)

### App Not Responding

**Error**: "Service unavailable"
- Check if app is sleeping (free tier auto-sleeps)
- Wait 30 seconds for wake-up
- Check logs for startup errors

**Error**: Health check failing
- Verify `/health` endpoint works locally
- Check logs: `curl https://your-app.onrender.com/health`
- Ensure app binds to `process.env.PORT`

### Auto-Sleep Issues

**Issue**: App sleeps too frequently
- Use UptimeRobot or similar to ping every 10-14 minutes
- Upgrade to paid plan for always-on service

---

## Migration from Other Platforms

### From Fly.io

1. **Export database**:
   ```bash
   fly postgres backup create -a your-postgres-app
   # Download backup
   ```

2. **Deploy to Render** (follow steps above)

3. **Import database**:
   ```bash
   psql "External_Database_URL_from_Render" < backup.sql
   ```

### From Railway

1. Export Railway database
2. Deploy to Render
3. Import database using Render's External Database URL

### From Replit

1. Export Replit PostgreSQL data
2. Deploy to Render (similar Node.js setup)
3. Import data to Render PostgreSQL

---

## Comparison: Render vs Alternatives

| Feature | Render | Fly.io | Railway | Replit |
|---------|--------|--------|---------|--------|
| **Free Tier** | 750 hours/month | 3 VMs, no limit | $5 credit/month | Limited, auto-sleep |
| **Auto-Sleep** | Yes (15 min) | No | No | Yes |
| **Wake Time** | ~30s | N/A | N/A | ~10-30s |
| **PostgreSQL** | 1GB free (90 day) | 3GB free | Included | Included |
| **Build Time** | 3-5 min | 2-4 min | 2-3 min | 1-2 min |
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Best For** | Personal projects | Production | Dev/side projects | Learning |

---

## Cost Management

### Staying in Free Tier

To maximize 750 hours/month:

1. **Single service**: One web service + one database
2. **Accept auto-sleep**: Wake time is acceptable for demos
3. **Monitor usage**: Dashboard shows hours consumed
4. **Use keep-alive cautiously**: Only if needed

**750 hours = ~31 days of continuous uptime**, so a single service can run 24/7 on free tier!

### When to Upgrade

Upgrade to paid plan if you need:
- Zero cold starts (always-on)
- More than 512MB RAM
- Database larger than 1GB
- Database backups included
- Better performance
- Priority support

---

## Getting Help

### Resources

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Render Community**: [community.render.com](https://community.render.com)
- **Render Status**: [status.render.com](https://status.render.com)
- **Project Issues**: [GitHub Issues](https://github.com/ismaelloveexcel/aidanyoutubeapp/issues)

### Support Channels

- Render Community Forum (fastest for free tier)
- Email support (paid plans get priority)
- GitHub Discussions (app-specific issues)

---

## Quick Reference

### Render Dashboard Navigation

```
Dashboard → New + → Web Service/PostgreSQL
Service → Logs (real-time logging)
Service → Shell (run commands)
Service → Environment (manage variables)
Service → Settings (configure service)
```

### Common Tasks

**Redeploy manually:**
1. Go to service → **"Manual Deploy"**
2. Select branch, click **"Deploy"**

**Update environment variables:**
1. Service → **"Environment"**
2. Add/edit variables
3. Save (auto-redeploys)

**View build logs:**
- Service → **"Logs"** → Filter by deploy event

**Access database:**
- PostgreSQL service → **"Info"** → Connection details

---

## Success! 🎉

You now have TubeStar Creator Studio deployed on Render with:
- ✅ Automatic deployments on git push
- ✅ PostgreSQL database included
- ✅ Free HTTPS/SSL certificates
- ✅ Custom domain support
- ✅ 750 hours/month free hosting

**Your app auto-deploys on every push to main branch!**

---

## Next Steps

1. ✅ Test all features in production
2. ✅ Set up UptimeRobot to reduce auto-sleep
3. ✅ Configure custom domain (optional)
4. ✅ Set up manual database backup schedule
5. ✅ Review [SECURITY.md](./SECURITY.md)
6. ✅ Monitor usage to stay within 750 hours
7. ✅ Consider upgrade if cold starts become an issue

---

**Made with 💜 for young creators**
