# Deployment Checklist

Use this checklist when setting up automated deployment for the first time or troubleshooting deployment issues.

## Initial Setup Checklist

### Prerequisites
- [ ] GitHub account created
- [ ] Fly.io account created ([fly.io/signup](https://fly.io/signup))
- [ ] Git installed locally
- [ ] Node.js 20+ installed locally
- [ ] Fly CLI installed locally

### Fly.io Setup
- [ ] Logged into Fly.io CLI (`fly auth login`)
- [ ] Created Fly.io app (`fly launch`)
  - [ ] App name chosen (e.g., `tubestar-yourname`)
  - [ ] Region selected (closest to users)
  - [ ] Declined immediate deployment
- [ ] PostgreSQL database created (`fly postgres create`)
  - [ ] Database name chosen (e.g., `tubestar-db`)
  - [ ] Same region as app selected
  - [ ] Development configuration selected (free tier)
- [ ] Database attached to app (`fly postgres attach`)
- [ ] `DATABASE_URL` secret automatically configured (verify with `fly secrets list`)

### GitHub Configuration
- [ ] Repository forked or cloned
- [ ] Fly.io API token obtained (`fly auth token`)
- [ ] `FLY_API_TOKEN` added to GitHub Secrets:
  - [ ] Settings → Secrets and variables → Actions
  - [ ] New repository secret created
  - [ ] Token value pasted
  - [ ] Secret saved

### Initial Deployment
- [ ] First deployment completed (`fly deploy`)
- [ ] Database schema initialized (`fly ssh console` → `npm run db:push`)
- [ ] Health check passed (`curl https://your-app.fly.dev/health`)
- [ ] App opens in browser (`fly open`)

### GitHub Actions Verification
- [ ] Workflow file exists (`.github/workflows/deploy.yml`)
- [ ] Test commit made to `main` branch
- [ ] GitHub Actions workflow triggered
- [ ] All jobs passed:
  - [ ] Build and Test
  - [ ] Security Scan
  - [ ] Deploy
- [ ] Deployment successful
- [ ] App accessible at Fly.io URL

## Environment Variables Checklist

### Required Variables (Fly.io Secrets)
- [ ] `DATABASE_URL` - Set automatically by `fly postgres attach`
- [ ] `NODE_ENV` - Set to `production` in `fly.toml`

### Optional Variables (if needed)
- [ ] `GEMINI_API_KEY` - For AI features (`fly secrets set`)
- [ ] `YOUTUBE_CLIENT_ID` - For YouTube integration
- [ ] `YOUTUBE_CLIENT_SECRET` - For YouTube integration
- [ ] `YOUTUBE_REDIRECT_URI` - For YouTube integration
- [ ] `ALLOWED_ORIGINS` - For CORS (custom domain)

### Verify Secrets
- [ ] Listed all secrets (`fly secrets list`)
- [ ] No secrets committed to git
- [ ] Secrets documented in `.env.example`

## Security Checklist

### Before Production
- [ ] Reviewed [SECURITY.md](./SECURITY.md)
- [ ] `npm audit` shows no high/critical issues
- [ ] CodeQL security scan enabled in GitHub Actions
- [ ] Helmet security headers configured (already in code)
- [ ] CORS properly configured (already in code)
- [ ] Rate limiting enabled (already in code)
- [ ] Password hashing implemented (already in code)
- [ ] Database uses SSL in production
- [ ] No API keys in code or git history

### GitHub Security
- [ ] Dependabot alerts enabled
- [ ] Dependabot security updates enabled
- [ ] CodeQL analysis running on PRs
- [ ] Security tab monitored regularly

## Deployment Workflow Checklist

### GitHub Actions Configuration
- [ ] Workflow runs on push to `main`
- [ ] Workflow runs on pull requests (build/test only)
- [ ] Workflow can be triggered manually
- [ ] Build job checks:
  - [ ] Type checking (`npx tsc --noEmit`)
  - [ ] Build succeeds (`npm run build`)
  - [ ] Build artifacts verified
  - [ ] Security audit runs
- [ ] Security scan job runs (CodeQL)
- [ ] Deploy job:
  - [ ] Only runs on `main` branch
  - [ ] Requires build job to succeed
  - [ ] Uses correct API token
  - [ ] Verifies deployment health

### Test Deployment
- [ ] Made test change to code
- [ ] Committed and pushed to `main`
- [ ] GitHub Actions triggered automatically
- [ ] Workflow completed successfully
- [ ] Changes visible on production URL
- [ ] Health check passes after deployment

## Monitoring Checklist

### Post-Deployment Monitoring
- [ ] App status checked (`fly status`)
- [ ] Logs reviewed (`fly logs`)
- [ ] Health endpoint responding (`/health`)
- [ ] Database connection working
- [ ] All features tested in production
- [ ] Error rates monitored

### Ongoing Monitoring
- [ ] GitHub Actions workflows checked weekly
- [ ] Fly.io dashboard reviewed weekly
- [ ] Security alerts addressed promptly
- [ ] Dependencies updated monthly
- [ ] Backups verified (Fly.io auto-backup)

## Custom Domain Checklist (Optional)

### Domain Configuration
- [ ] Domain registered
- [ ] SSL certificate added (`fly certs add`)
- [ ] DNS records configured:
  - [ ] A record for apex domain
  - [ ] AAAA record for IPv6 (if supported)
  - [ ] CNAME for www subdomain
- [ ] DNS propagation completed (5-60 minutes)
- [ ] Certificate verified (`fly certs show`)
- [ ] Domain accessible via HTTPS

### CORS Configuration
- [ ] `ALLOWED_ORIGINS` secret updated with custom domain
- [ ] App restarted after secret change
- [ ] CORS tested from custom domain

## Scaling Checklist (If Needed)

### Resource Scaling
- [ ] Current resource usage reviewed
- [ ] Free tier limits understood
- [ ] Scaling requirements determined
- [ ] Resources scaled appropriately:
  - [ ] Memory (`fly scale memory`)
  - [ ] VM count (`fly scale count`)
  - [ ] VM size (`fly scale vm`)

### Performance Optimization
- [ ] Database queries optimized
- [ ] Static assets cached
- [ ] CDN configured (if needed)
- [ ] Connection pooling enabled
- [ ] Slow queries identified and fixed

## Troubleshooting Checklist

### If Deployment Fails

#### GitHub Actions Failure
- [ ] Checked workflow logs in Actions tab
- [ ] Verified `FLY_API_TOKEN` is set correctly
- [ ] Tested build locally (`npm ci && npm run build`)
- [ ] Checked for TypeScript errors (`npx tsc --noEmit`)
- [ ] Reviewed recent commits for breaking changes

#### Fly.io Deployment Failure
- [ ] Checked Fly.io logs (`fly logs`)
- [ ] Verified app status (`fly status`)
- [ ] Confirmed `fly.toml` configuration is correct
- [ ] Tested health endpoint
- [ ] Restarted app (`fly restart`)

#### Database Issues
- [ ] Verified `DATABASE_URL` is set (`fly secrets list`)
- [ ] Checked database status (`fly status -a tubestar-db`)
- [ ] Ran database migrations (`fly ssh console` → `npm run db:push`)
- [ ] Checked database logs
- [ ] Verified connection string format

#### Application Issues
- [ ] Reviewed application logs (`fly logs`)
- [ ] Tested locally with production build
- [ ] Checked for missing environment variables
- [ ] Verified all dependencies installed
- [ ] Cleared build cache and rebuilt

### If App is Slow/Unresponsive
- [ ] Checked VM status (`fly vm status`)
- [ ] Reviewed resource usage (memory, CPU)
- [ ] Analyzed slow database queries
- [ ] Considered scaling resources
- [ ] Enabled auto-start machines (already configured)

## Rollback Checklist

### If New Deployment Has Issues
- [ ] Identified problematic deployment
- [ ] Viewed release history (`fly releases`)
- [ ] Rolled back to previous version (`fly releases rollback`)
- [ ] Verified rollback successful
- [ ] Investigated root cause
- [ ] Fixed issue in code
- [ ] Re-deployed after fix

## Documentation Checklist

### Project Documentation
- [ ] README.md updated with deployment info
- [ ] GITHUB_DEPLOYMENT.md reviewed and accurate
- [ ] DEPLOYMENT.md covers Replit alternative
- [ ] SECURITY.md security measures documented
- [ ] `.env.example` includes all required variables
- [ ] Pull request template in place

### Team Documentation
- [ ] Deployment process documented
- [ ] Team members have access to:
  - [ ] GitHub repository
  - [ ] Fly.io account (if needed)
  - [ ] Secrets documentation (secure location)
- [ ] Incident response plan documented
- [ ] Backup and recovery procedures documented

## Success Criteria

### Deployment is Successful When:
- [x] GitHub Actions workflow runs automatically on push to `main`
- [x] All CI/CD jobs pass (build, test, security, deploy)
- [x] Application deploys to Fly.io without errors
- [x] Health check endpoint responds with 200 OK
- [x] Database connection works
- [x] All features work in production
- [x] HTTPS is enforced
- [x] No security vulnerabilities detected
- [x] Logs show no errors
- [x] Application is accessible via public URL

### Monitoring is Set Up When:
- [ ] Can view logs in real-time (`fly logs`)
- [ ] Can check app status anytime (`fly status`)
- [ ] GitHub Actions shows build/deploy history
- [ ] Security alerts are monitored
- [ ] Uptime monitoring configured (optional)
- [ ] Error tracking configured (optional)

## Post-Deployment Tasks

### Immediate (Within 24 hours)
- [ ] Monitor application logs
- [ ] Test all critical features
- [ ] Verify database backups working
- [ ] Check GitHub Actions workflows
- [ ] Address any security alerts

### Short-term (Within 1 week)
- [ ] Set up additional monitoring (optional)
- [ ] Configure uptime checks (optional)
- [ ] Add error tracking (optional)
- [ ] Review performance metrics
- [ ] Document any issues encountered

### Long-term (Ongoing)
- [ ] Weekly log reviews
- [ ] Monthly dependency updates
- [ ] Quarterly security audits
- [ ] Regular backup verification
- [ ] Performance optimization as needed

---

## Quick Command Reference

```bash
# Fly.io
fly status                    # Check app status
fly logs                      # View logs
fly ssh console               # SSH into app
fly restart                   # Restart app
fly deploy                    # Manual deploy
fly secrets list              # List secrets
fly secrets set KEY=value     # Add secret
fly dashboard                 # Open web dashboard

# Git
git status                    # Check changes
git add .                     # Stage changes
git commit -m "message"       # Commit
git push origin main          # Push (triggers deploy)

# npm
npm ci                        # Clean install
npm run dev                   # Dev server
npm run build                 # Build production
npx tsc --noEmit              # Type check
npm audit                     # Security check
```

---

**Need help?** See [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) for detailed instructions.
