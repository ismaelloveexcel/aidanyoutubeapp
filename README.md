# TubeStar - Creator Studio

[![Deploy to Fly.io](https://img.shields.io/badge/Deploy-Fly.io-blueviolet?logo=fly.io)](./GITHUB_DEPLOYMENT.md)
[![CI/CD Status](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](../../actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

A YouTube video creation helper app designed for 8-12 year old kids. Create amazing content with idea generators, script writers, thumbnail designers, and more!

> **🚀 Ready to deploy?** This app has automated deployment configured! See [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) for the complete guide.

## Features

- **Dashboard**: Personalized welcome screen with creator profile setup and quick action links
- **Idea Generator**: Get random video ideas across Gaming, Tech, Vlog, and React categories
- **Script Writer**: Template-based script creation with Gaming Highlight, Product Review, and Daily Vlog templates
- **Templates**: Browse professional video templates for trending styles (Stranger Things, Minecraft, Challenges, etc.)
- **Thumbnail Designer**: Create eye-catching thumbnails with colors, emojis, and quick templates
- **Soundboard**: Fun sound effect buttons with visual feedback animations
- **YouTube Integration**: Connect your YouTube account to upload videos directly (requires parental setup)
- **Analytics**: Track your channel performance after connecting your YouTube account
- **Content Moderation**: Kid-safe content filtering built-in

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS v4
- Framer Motion
- TanStack Query
- Wouter (routing)
- shadcn/ui components

### Backend
- Express.js
- TypeScript
- Drizzle ORM
- PostgreSQL
- Google OAuth (YouTube API)

## Design

- **Theme**: Sticker Pop aesthetic with neon colors
- **Colors**: Hot Pink, Cyan, Bright Yellow on dark backgrounds
- **Style**: 4px borders, hard shadows, sticker-like tilts, bouncy animations
- **Typography**: Carter One (display), Inter (body)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your database
3. Install dependencies:
   ```bash
   npm install
   ```
   > Note: Vite/rollup needs the platform-specific native binding (`@rollup/rollup-linux-x64-gnu`).
   > The included `.npmrc` forces optional dependencies on so the native build is installed when the npm registry is reachable.
   > If installs still fail, verify outbound registry access or pre-populate your npm cache with the rollup binary.

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5000](http://localhost:5000) in your browser

## YouTube Integration (Optional)

To enable YouTube account connection and video uploads, parents/guardians need to set up YouTube API credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > OAuth client ID**
6. Select **Web application** as the application type
7. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/youtube/callback`
   - Production: `https://your-domain.com/api/auth/youtube/callback`
8. Copy the **Client ID** and **Client Secret**
9. Add them to your `.env` file:
   ```
   YOUTUBE_CLIENT_ID=your-client-id
   YOUTUBE_CLIENT_SECRET=your-client-secret
   YOUTUBE_REDIRECT_URI=http://localhost:5000/api/auth/youtube/callback
   ```

**Note**: YouTube connection requires parental permission for creators under 13 in compliance with COPPA guidelines.

## Build for Production

```bash
npm run build
npm start
```

## 🚀 Automated Deployment with GitHub Actions (Recommended)

**The easiest way to deploy with professional CI/CD!** This app is configured for completely free, automated deployment using GitHub Actions + Fly.io.

### Why GitHub Actions + Fly.io?
- ✅ **Completely free** - No credit card required, no auto-sleep
- ✅ **Fully automated** - Push to `main` → automatic deployment
- ✅ **Production-ready** - Security scanning, build tests, health checks
- ✅ **Professional CI/CD** - Build, test, scan, deploy pipeline
- ✅ **Always-on** - No cold starts or wake delays
- ✅ **Included PostgreSQL** - 3GB free database storage

### Quick Setup (5 minutes):
1. Fork this repository on GitHub
2. Sign up at [fly.io](https://fly.io/signup) (free, no credit card)
3. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
4. Run `fly launch` and create your app + PostgreSQL database
5. Get your API token: `fly auth token`
6. Add `FLY_API_TOKEN` to GitHub repository secrets
7. Push to `main` branch - automatic deployment! 🎉

**📖 Complete guide**: See [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) for detailed step-by-step instructions.

### What Happens Automatically:
- ✅ TypeScript type checking
- ✅ Build verification
- ✅ Security scanning (CodeQL)
- ✅ Dependency audit
- ✅ Deployment to Fly.io
- ✅ Health check verification

Every push to `main` triggers the full CI/CD pipeline!

---

## Alternative Deployment Options

### Deploy to Replit (Visual IDE)

Good for beginners who prefer visual interfaces! See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

**Quick Start:**
1. Go to [replit.com](https://replit.com) and click "Create Repl"
2. Select "Import from GitHub" and paste: `https://github.com/ismaelloveexcel/aidanyoutubeapp`
3. In Tools → Database, create a PostgreSQL database
4. Open Shell and run `npm run db:push`
5. Click "Run" ▶️ to start, "Deploy" 🚀 for production

**Replit Pros:**
- Visual IDE - no command line required
- Built-in PostgreSQL database
- One-click deployment
- Good for learning

**Replit Cons:**
- Apps sleep after inactivity on free tier
- Wake time ~10-30 seconds
- Less control than GitHub Actions

### GitHub Codespaces (Development)

Perfect for development and testing:

1. Click the green "Code" button on the repository page
2. Select the "Codespaces" tab
3. Click "Create codespace on main"
4. Wait for environment setup (automatic)
5. Copy `.env.example` to `.env` and configure `DATABASE_URL`
6. Run `npm run db:push` to set up the database schema
7. Run `npm run dev` to start the development server

The Codespace comes pre-configured with Node.js 20 and all required extensions.

---

**⚠️ Security Note**: Before deploying to production, review [SECURITY.md](./SECURITY.md) for important security considerations.

## Database Tables

- **users**: User authentication
- **scripts**: Saved video scripts
- **ideas**: Saved video ideas
- **thumbnails**: Saved thumbnail designs

## Safety Features

The app includes server-side content moderation to block:
- Inappropriate language
- Violence and dangerous content
- Adult content
- Bullying and mean words

All user-generated content is automatically filtered to keep the platform kid-safe!

## License

Made with 💜 for young creators