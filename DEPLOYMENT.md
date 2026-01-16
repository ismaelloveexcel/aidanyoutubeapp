# Deployment Guide for TubeStar Creator Studio

## Deployment Status (Repository Review)

This repository includes deployment configurations (`fly.toml` with the app name defined in the file, `.replit`, and `.github/workflows/deploy.yml`), but does **not** contain a live deployment URL or runtime status. Deployment status **cannot be confirmed** from the repository alone.

### Confirm Deployment Status

- **Fly.io**: Use `flyctl status -a <app-name>` where `<app-name>` can be found using `flyctl apps list` or in `fly.toml`.
- **GitHub Actions**: Check the **Actions** tab for the latest successful run of `.github/workflows/deploy.yml` on `main`.
- **Replit**: Open the Replit project → **Deployments** tab → verify a live deployment and test `/health` if available; otherwise load the app root URL or check logs for 200 responses.

## Deploying to Replit (Quick & Easy) ⭐

Replit is the easiest platform for deploying TubeStar Creator Studio with a visual interface, built-in database, and one-click deployment.

### Why Replit?

**Benefits:**
- One-click import from GitHub
- Built-in PostgreSQL database support
- Visual IDE for making changes
- Free tier available (with some limitations)
- No CLI or terminal knowledge required
- Automatic HTTPS on deployment
- Easy environment variable management via Secrets

### Prerequisites

1. **Create a Replit account**: Sign up at [replit.com](https://replit.com)
2. Have access to this GitHub repository

### Step 1: Import the Repository to Replit

1. Go to [replit.com](https://replit.com) and click **"Create Repl"**
2. Select **"Import from GitHub"**
3. Paste the repository URL: `https://github.com/ismaelloveexcel/aidanyoutubeapp`
4. Click **"Import from GitHub"**

Replit will automatically detect the Node.js project and use the `.replit` configuration file.

### Step 2: Set Up the Database

1. In your Repl, click on the **"Tools"** panel (left sidebar)
2. Find and click **"Database"** (or search for "PostgreSQL")
3. Click **"Create Database"** to create a PostgreSQL database
4. Replit will automatically set the `DATABASE_URL` environment variable

**Alternative - Use Secrets for External Database:**
If you prefer an external database:
1. Click on the **"Secrets"** tool (🔒 icon in Tools)
2. Add a new secret:
   - Key: `DATABASE_URL`
   - Value: Your PostgreSQL connection string (e.g., `postgresql://user:password@host:5432/dbname`)

### Step 3: Initialize the Database Schema

1. Open the **Shell** tab in Replit
2. Run the database migration:
   ```bash
   npm run db:push
   ```

This creates all the necessary database tables.

### Step 4: Run the Application (Development)

1. Click the **"Run"** button (▶️) at the top
2. Replit will run `npm run dev` and start the development server
3. A webview will open showing your application at the Replit URL

### Step 5: Deploy to Production

1. Click the **"Deploy"** button (rocket icon 🚀) at the top right
2. Choose **"Autoscale"** or **"Reserved VM"** deployment type:
   - **Autoscale**: Scales automatically, pay per use
   - **Reserved VM**: Always on, fixed monthly cost (recommended for demos)
3. Click **"Deploy"**

Replit will automatically:
- Run `npm run build` to build the production bundle
- Deploy using `node ./dist/index.cjs`
- Provide you with a production URL

### Step 6: Verify Deployment

1. Visit your deployed URL (shown in the deployment panel)
2. Check the health endpoint: `https://your-app.replit.app/health`
3. Test all features to ensure everything works

### Managing Environment Variables

Add any additional environment variables in **Secrets**:

| Key | Description | Example |
|-----|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Environment mode | `production` (auto-set on deploy) |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://your-app.replit.app` |

### Updating Your Deployed App

**Option 1 - Manual Update:**
1. Make changes in the Replit editor
2. Click **"Deploy"** → **"Redeploy"**

**Option 2 - Sync from GitHub:**
1. Click **"Version Control"** (Git icon in Tools)
2. Pull latest changes from GitHub
3. Click **"Deploy"** → **"Redeploy"**

### Troubleshooting Replit Deployment

#### App Not Starting
- Check the **Console** for error messages
- Verify `DATABASE_URL` is set in Secrets
- Try running `npm install` in the Shell

#### Database Connection Issues
- Ensure the database is created in Tools → Database
- Check that `DATABASE_URL` secret is correct
- Run `npm run db:push` to sync the schema

#### Build Failures
- Clear the cache: In Shell, run `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

#### Port Issues
- The app runs on port 5000 internally
- Replit automatically routes external traffic (port 80/443) to port 5000
- No changes needed - the `.replit` file handles this

### Replit Free Tier Limitations

- Apps may sleep after inactivity (wake up time ~10-30 seconds)
- Limited CPU and memory
- Storage limits apply

For production use, consider upgrading to Replit Pro or using the Reserved VM deployment option.

---

## Deploying to Fly.io (Alternative)

Fly.io is an alternative platform for deploying TubeStar Creator Studio. It offers a generous free tier with always-on availability, included PostgreSQL database, and automatic HTTPS.

### Why Fly.io?

**Free Tier Benefits:**
- 3 shared-cpu VMs with 256MB RAM each
- Included PostgreSQL with 3GB persistent storage
- No auto-sleep - your app stays online 24/7
- Automatic HTTPS with custom domain support
- 160GB outbound data transfer per month
- Built-in health checks and monitoring
- Deploy from anywhere with the Fly CLI

### Prerequisites

1. **Create a Fly.io account**: Sign up at [fly.io](https://fly.io)
2. **Install Fly CLI**:
   ```bash
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   
   # Windows (PowerShell)
   pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```
3. **Login to Fly.io**:
   ```bash
   fly auth login
   ```

### Step 1: Initialize Your Fly.io App

From the project root directory:

```bash
fly launch
```

This command will:
- Detect your Node.js application automatically
- Generate a `fly.toml` configuration file (already included in this repo)
- Prompt you to choose an app name (must be globally unique)
- Ask which region to deploy to (choose one closest to your users)
- Offer to set up a PostgreSQL database

**Important**: When prompted about the app name, you can:
- Accept the suggested name
- Or choose your own unique name (e.g., `tubestar-yourname-2024`)

### Step 2: Create and Attach PostgreSQL Database

Create a PostgreSQL database:

```bash
fly postgres create
```

When prompted:
- Choose an app name for your database (e.g., `tubestar-db`)
- Select the same region as your app
- Choose the "Development" configuration for free tier

Attach the database to your app:

```bash
fly postgres attach <your-postgres-app-name>
```

This automatically sets the `DATABASE_URL` secret for your app.

### Step 3: Configure Environment Variables

Set any additional environment variables as secrets:

```bash
# NODE_ENV is already set in fly.toml, but you can override if needed
fly secrets set NODE_ENV=production

# If you need ALLOWED_ORIGINS for CORS (comma-separated domains)
fly secrets set ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

View your secrets:
```bash
fly secrets list
```

### Step 4: Deploy Your Application

Deploy to Fly.io:

```bash
fly deploy
```

This will:
1. Build your Docker image
2. Push it to Fly.io's registry
3. Create and start your VM
4. Run health checks
5. Make your app available at `https://your-app-name.fly.dev`

**First deployment takes 2-5 minutes.** Subsequent deployments are faster.

### Step 5: Initialize Database Schema

After successful deployment, run database migrations:

```bash
# Connect to your Fly.io app's shell
fly ssh console

# Once connected, run migrations
npm run db:push

# Exit the shell
exit
```

**Note**: If this is your first deployment and you need to force schema synchronization, use:
```bash
npm run db:push -- --force-sync
```

**Alternative approach** (if you prefer to run migrations locally):
```bash
# Get your database connection string
fly secrets list | grep DATABASE_URL

# Run migrations locally with the production database URL
DATABASE_URL="postgresql://..." npm run db:push
```

### Step 6: Verify Deployment

Check your app status:

```bash
fly status
```

View logs:

```bash
fly logs
```

Open your app in a browser:

```bash
fly open
```

Test the health check endpoint:

```bash
curl https://your-app-name.fly.dev/health
```

### Custom Domain Setup (Optional)

To use your own domain:

1. **Add your domain to Fly.io**:
   ```bash
   fly certs add yourdomain.com
   fly certs add www.yourdomain.com
   ```

2. **Update DNS records** (at your domain registrar):
   - Add an `A` record pointing to Fly.io's IP addresses (shown after running `fly certs add`)
   - Add an `AAAA` record for IPv6 (also shown in cert command output)

3. **Wait for DNS propagation** (usually 5-60 minutes)

4. **Verify certificate**:
   ```bash
   fly certs show yourdomain.com
   ```

### Monitoring and Logs

**View real-time logs**:
```bash
fly logs
```

**View app status and metrics**:
```bash
fly status
fly vm status
```

**Check database status**:
```bash
fly postgres db list -a <your-postgres-app-name>
```

**Monitor resource usage**:
```bash
fly dashboard
```

This opens the Fly.io web dashboard where you can see:
- CPU and memory usage
- Request metrics
- Error rates
- Health check status

### Scaling Your App

The free tier includes 3 shared-cpu VMs. To scale:

**Scale up resources** (requires upgrading from free tier):
```bash
fly scale vm shared-cpu-2x --memory 512
```

**Add more instances** (use your 3 free VMs):
```bash
fly scale count 2
```

**Scale down**:
```bash
fly scale count 1
```

### Updating Your App

When you make code changes:

1. Commit your changes to git
2. Deploy the update:
   ```bash
   fly deploy
   ```

Fly.io performs **zero-downtime deployments** by default.

### Managing Secrets

**Add/update a secret**:
```bash
fly secrets set KEY=value
```

**Remove a secret**:
```bash
fly secrets unset KEY
```

**List secrets** (values are hidden):
```bash
fly secrets list
```

**Import secrets from file**:
```bash
fly secrets import < .env.production
```

## Alternative Free Deployment Platforms

While Fly.io is recommended, here are other free options:

### Render

**Free Tier**: 750 hours/month, auto-sleep after 15 min inactivity

Create `render.yaml` in your repo root:
```yaml
services:
  - type: web
    name: tubestar-creator-studio
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
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
```

Deploy:
1. Connect your GitHub repo to Render
2. Render auto-deploys on git push
3. Free PostgreSQL included (90-day expiry, but data is preserved)

**Pros**: Simple, good free tier, auto-deploy from GitHub
**Cons**: Apps sleep after inactivity, limited to 750 hours/month

### Railway

**Free Tier**: $5 credit/month (depletes with usage)

Deploy via CLI:
```bash
npm install -g railway
railway login
railway init
railway up
```

Or connect your GitHub repo via the Railway dashboard.

Add PostgreSQL:
```bash
railway add --plugin postgresql
```

**Pros**: Great developer experience, generous resource limits
**Cons**: Credit-based free tier (not truly unlimited)

### Vercel + Neon (Serverless)

For a serverless approach with separate database:

1. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Database on Neon**:
   - Sign up at [neon.tech](https://neon.tech)
   - Create a PostgreSQL database (0.5GB free)
   - Copy connection string to Vercel environment variables

**Pros**: Excellent for frontend, unlimited bandwidth
**Cons**: Not ideal for stateful apps, cold starts, complex backend setup

### Replit

See the **[Deploying to Replit](#deploying-to-replit-quick--easy-)** section at the top of this guide for detailed instructions.

**Pros**: Easy for beginners, built-in IDE, one-click GitHub import
**Cons**: Auto-sleep on free tier, limited resources

## Database Options Comparison

| Provider | Free Storage | Auto-Sleep | Regions | Notes |
|----------|--------------|------------|---------|-------|
| **Replit PostgreSQL** | Included | No | US | Built-in, auto-configured ⭐ |
| **Fly.io Postgres** | 3GB | No | Global | Included with Fly.io app |
| **Neon** | 0.5GB | Yes (14 days) | US, EU | Good for serverless |
| **Supabase** | 500MB | No | Global | Includes auth, storage |
| **CockroachDB** | 5GB | No | Global | Best for scale |
| **Railway** | Unlimited* | No | Global | *Uses $5 monthly credit |

**Recommendation**: For Replit, use the built-in PostgreSQL. For Fly.io, use Fly.io Postgres for best performance and no additional setup.

## Environment Variables Reference

| Variable | Required | Description | Default | Example |
|----------|----------|-------------|---------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | None | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Yes | Environment mode | `production` | `production` |
| `PORT` | No | Server port | `5000` | `5000` |
| `ALLOWED_ORIGINS` | No* | CORS allowed origins (comma-separated) | Same-origin only | `https://yourdomain.com` |

*Required in production if you need to allow cross-origin requests. If not set, only same-origin requests are allowed.

**Security Note**: Never commit these values to git. Use secrets management:
- Fly.io: `fly secrets set`
- Render: Environment variables in dashboard
- Railway: Environment variables in dashboard
- Replit: Secrets tab

## Security Checklist for Deployment

Before deploying to production, review [SECURITY.md](./SECURITY.md) and ensure:

- [ ] `DATABASE_URL` is stored as a secret (never in code)
- [ ] `NODE_ENV=production` is set
- [ ] Rate limiting is enabled (already configured in code)
- [ ] Helmet security headers are active (already configured in code)
- [ ] CORS is properly configured with `ALLOWED_ORIGINS`
- [ ] HTTPS is enforced (automatic on Fly.io)
- [ ] Error messages don't leak sensitive information
- [ ] Database connection strings use SSL in production

**⚠️ CRITICAL**: Review [SECURITY.md](./SECURITY.md) for important security considerations before production use.

## Troubleshooting

### Common Fly.io Issues

#### Build Failures

**Error**: "npm ci failed"
```bash
# Check your package-lock.json is committed
git status

# Rebuild without cache
fly deploy --remote-only
```

**Error**: "Build exceeds memory limit"
```bash
# Use larger build resources temporarily
fly deploy --vm-memory 1024
```

#### Database Connection Issues

**Error**: "Cannot connect to database"
```bash
# Check DATABASE_URL is set
fly secrets list

# Verify database is running
fly status -a <your-postgres-app-name>

# Check connection from your app
fly ssh console
echo $DATABASE_URL
exit
```

**Error**: "too many clients"
- PostgreSQL has connection limits
- Ensure your app properly closes connections
- Consider connection pooling with PgBouncer

#### Port Binding Issues

**Error**: "App not responding on port 5000"
- Check `fly.toml` has `internal_port = 5000`
- Verify your app listens on `process.env.PORT`
- Check logs: `fly logs`

#### Health Check Failures

**Error**: "Health checks failing"
```bash
# Test health endpoint locally
curl https://your-app-name.fly.dev/health

# Check logs for errors
fly logs

# Increase health check timeout in fly.toml
# Change timeout from "2s" to "5s"
```

#### Memory/Resource Limits

**Error**: "Out of memory" or "Process killed"
```bash
# Check current resources
fly vm status

# Scale up memory (requires paid plan)
fly scale vm shared-cpu-1x --memory 512

# Or optimize your app to use less memory
```

### General Troubleshooting

**Enable detailed logging**:
```javascript
// In your app code
DEBUG=express:* npm start
```

**Check build output**:
```bash
npm run build
ls -la dist/
```

**Verify dependencies**:
```bash
npm ci
npm run build
npm start
```

**Test locally with production settings**:
```bash
NODE_ENV=production npm run build && npm start
```

## Database Backups

### Backup Your Fly.io Database

```bash
# Create a backup
fly postgres backup create -a <your-postgres-app-name>

# List backups
fly postgres backup list -a <your-postgres-app-name>

# Download a backup
fly ssh console -a <your-postgres-app-name>
pg_dump <database-name> > backup.sql
exit
```

### Restore from Backup

```bash
# Upload backup file
fly ssh console -a <your-postgres-app-name>
psql <database-name> < backup.sql
exit
```

### Automated Backups

Fly.io PostgreSQL automatically creates backups:
- Daily backups retained for 7 days (free tier)
- Point-in-time recovery available (paid tiers)

## Performance Optimization

### Caching

Add Redis for caching (available on Fly.io):
```bash
fly redis create
fly redis attach <redis-app-name>
```

### CDN for Static Assets

Use Fly.io's built-in CDN or integrate with Cloudflare:
1. Point your domain to Fly.io
2. Enable Cloudflare proxy (orange cloud)
3. Configure caching rules for `/public/*`

### Database Optimization

- Add indexes to frequently queried columns
- Use connection pooling
- Enable query caching
- Monitor slow queries with `fly pg logs`

## Cost Management

### Staying in Free Tier

To stay within Fly.io's free tier:
- Keep `min_machines_running = 1` (current config)
- Use `shared-cpu-1x` VMs (current config)
- Limit memory to 256MB per VM (current config)
- Stay under 3 VMs total
- Monitor outbound bandwidth (160GB/month limit)

### Monitoring Usage

```bash
# View current usage
fly dashboard

# Check billing
fly dashboard billing
```

### Cost Optimization Tips

1. Use a single VM for low-traffic apps
2. Enable auto-stop for development environments
3. Use Fly.io Postgres instead of external databases
4. Compress static assets
5. Implement caching to reduce database queries

## Getting Help

### Documentation
- [Fly.io Docs](https://fly.io/docs/)
- [Fly.io Community](https://community.fly.io/)
- [Project Issues](https://github.com/ismaelloveexcel/aidanyoutubeapp/issues)

### Support Channels
- Fly.io Community Forum
- Fly.io Discord
- GitHub Issues (for app-specific problems)

### Useful Commands

```bash
# Get help for any command
fly help <command>

# SSH into your app
fly ssh console

# Restart your app
fly restart

# Destroy your app (careful!)
fly destroy

# View all apps
fly apps list

# View app info
fly info
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@1.5
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Get your `FLY_API_TOKEN`:
```bash
fly auth token
```

Add it to GitHub repository secrets.

## Next Steps

After successful deployment:

1. ✅ Test all features in production
2. ✅ Set up monitoring and alerts
3. ✅ Configure custom domain (optional)
4. ✅ Set up automated backups
5. ✅ Review and implement [SECURITY.md](./SECURITY.md) recommendations
6. ✅ Configure CI/CD for automatic deployments
7. ✅ Add error tracking (e.g., Sentry)
8. ✅ Set up uptime monitoring (e.g., UptimeRobot)

## License

Made with 💜 for young creators
