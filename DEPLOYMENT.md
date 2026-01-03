# Deployment Guide for TubeStar Creator Studio

## Deploying to Replit

This project is fully configured for Replit deployment with autoscaling support.

### Prerequisites
- A Replit account
- A PostgreSQL database (Replit PostgreSQL or external like Neon, Supabase)

### Step 1: Import to Replit

1. Go to [Replit](https://replit.com)
2. Click "Create Repl"
3. Choose "Import from GitHub"
4. Enter repository URL: `https://github.com/ismaelloveexcel/aidanyoutubeapp`
5. Click "Import from GitHub"

### Step 2: Configure Environment Variables (Secrets)

In Replit, go to the "Secrets" tab (lock icon) and add:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
PORT=5000
```

**Important**: Never commit these values to the repository!

### Step 3: Set Up Database

#### Option A: Using Replit PostgreSQL (Recommended for testing)
1. In your Repl, click "Tools" → "Database"
2. Enable PostgreSQL
3. Copy the connection string to your Secrets as `DATABASE_URL`

#### Option B: Using External PostgreSQL (Recommended for production)
Services like Neon, Supabase, or Railway offer free PostgreSQL:
- [Neon](https://neon.tech) - Free tier with 0.5GB storage
- [Supabase](https://supabase.com) - Free tier with 500MB database
- [Railway](https://railway.app) - $5 free credit monthly

### Step 4: Install Dependencies

In the Replit shell:
```bash
npm install
```

### Step 5: Initialize Database

Run migrations to set up database tables:
```bash
npm run db:push
```

### Step 6: Build and Run (Development)

#### Development Mode
```bash
npm run dev
```

Click the "Run" button in Replit to start the development server!

### Step 7: Deploy to Production with Replit Deployments

This repository includes a pre-configured `.replit` file with deployment settings for Replit's autoscale deployment feature.

#### Using Replit Deployments (Recommended for Production)

1. Click the "Deploy" button in the top right corner of your Repl
2. Select "Autoscale" deployment type (already configured)
3. Review the deployment settings:
   - **Build command**: `npm run build`
   - **Run command**: `npm install --production && npm start`
4. Add your production environment secrets in the deployment settings
5. Click "Deploy" to publish your app

#### Deployment Configuration

The `.replit` file includes these deployment settings:

```toml
[deployment]
run = ["sh", "-c", "npm install --production && npm start"]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
```

This configuration ensures:
- Your app is built before deployment
- Production dependencies are installed
- The app starts with `npm start` in production mode
- Autoscaling handles traffic automatically

### Step 8: Access Your App

- **Development**: Click the "Open in new tab" button in Replit
- **Production**: Your deployed app will have a URL like `https://your-repl-name-your-username.replit.app`

## Replit Configuration Files

The repository includes these Replit-specific files:
- `.replit` - Main configuration (run commands, ports)
- `replit.nix` - Environment dependencies (Node.js, PostgreSQL)
- `.replitignore` - Files to exclude from the Repl

## Common Issues and Solutions

### Issue: "Cannot connect to database"
**Solution**: Check that DATABASE_URL is set correctly in Secrets

### Issue: "Module not found"
**Solution**: Run `npm install` in the shell

### Issue: "Port already in use"
**Solution**: Restart the Repl or change PORT in Secrets

### Issue: "Build fails"
**Solution**: Ensure all dependencies are installed and TypeScript compiles

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |
| `PORT` | No | Server port (default: 5000) | `5000` |

## Security Checklist for Production

Before making your Repl public, review [SECURITY.md](./SECURITY.md) and ensure:

- [ ] DATABASE_URL is stored in Replit Secrets (not hardcoded)
- [ ] User passwords are hashed (currently NOT implemented - see SECURITY.md)
- [ ] Authentication is implemented (currently NOT implemented - see SECURITY.md)
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] Security headers are added
- [ ] Error messages don't leak sensitive info

**⚠️ CRITICAL**: This app currently stores passwords in plain text and has no authentication. See [SECURITY.md](./SECURITY.md) for required security fixes before production use.

## Database Backups

### Backup Your Database
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore from Backup
```bash
psql $DATABASE_URL < backup.sql
```

## Monitoring and Logs

In Replit:
1. Check "Console" tab for application logs
2. Use "Resources" tab to monitor CPU/memory usage
3. Use Replit's built-in monitoring tools

## Scaling Considerations

### Replit Development (Free Tier)
- Limited CPU and memory
- Repls may sleep after inactivity
- Great for development and testing

### Replit Deployments (Production)
This app is configured for Replit's Autoscale deployment:
- **Always-on**: Your deployed app stays running 24/7
- **Auto-scaling**: Handles traffic spikes automatically
- **Custom domains**: Connect your own domain
- **Production-ready**: Optimized for performance

To upgrade your deployment:
1. Go to your Repl's Deploy settings
2. Choose a deployment plan that fits your needs
3. Configure scaling options if needed

### Alternative Platforms
For heavy production use, consider:
- Deploying to Vercel, Railway, or Render
- Using a dedicated server
- Implementing caching (Redis)
- Setting up CDN for static assets

## Alternative Deployment Platforms

### Vercel
```bash
npm install -g vercel
vercel
```

### Railway
```bash
npm install -g railway
railway up
```

### Render
Create `render.yaml`:
```yaml
services:
  - type: web
    name: tubestar
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
```

## Troubleshooting

### Enable Detailed Logging
Set environment variable:
```
DEBUG=express:*
```

### Check Database Connection
```bash
node -e "require('./server/db.ts')"
```

### Verify Build
```bash
npm run build
ls -la dist/
```

## Getting Help

- Check [Issues](https://github.com/ismaelloveexcel/aidanyoutubeapp/issues)
- Read [README.md](./README.md)
- Review [SECURITY.md](./SECURITY.md)

## License

Made with 💜 for young creators
