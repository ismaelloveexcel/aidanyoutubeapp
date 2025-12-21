# Deployment Guide for TubeStar Creator Studio

## Deploying to Replit

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

### Step 6: Build and Run

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

### Step 7: Access Your App

Click the "Open in new tab" button in Replit to see your app running!

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

Replit free tier limitations:
- Limited CPU and memory
- Repls may sleep after inactivity
- Consider upgrading to Replit Hacker plan for always-on

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
