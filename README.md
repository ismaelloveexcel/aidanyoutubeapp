# TubeStar - Creator Studio

[![Deploy to Fly.io](https://img.shields.io/badge/Deploy-Fly.io-blueviolet?logo=fly.io)](./GITHUB_DEPLOYMENT.md)
[![Deploy to Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](./RENDER_DEPLOYMENT.md)
[![Deploy to Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway&logoColor=white)](./RAILWAY_DEPLOYMENT.md)
[![Deploy to Replit](https://img.shields.io/badge/Deploy-Replit-F26207?logo=replit&logoColor=white)](./DEPLOYMENT.md)
[![CI/CD Status](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](../../actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

A YouTube video creation helper app designed for 8-12 year old kids. Create amazing content with idea generators, script writers, thumbnail designers, and more!

> **🚀 Deploy for FREE in 5-20 minutes!** Choose from 4 free platforms with detailed guides. See [FREE_DEPLOYMENT_COMPARISON.md](./FREE_DEPLOYMENT_COMPARISON.md) to find the best option for you.

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

---

## 🚀 Free Deployment Options - Choose Your Platform!

Deploy TubeStar Creator Studio **completely free** on any of these platforms. All options include PostgreSQL database and HTTPS!

### Quick Comparison

| Platform | Setup Time | Always-On? | Best For | Guide |
|----------|------------|------------|----------|-------|
| **Fly.io** | 15-20 min | ✅ Yes | Production, CI/CD | [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) |
| **Render** | 5-10 min | ⚠️ Auto-sleep (workaround available) | Personal projects | [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) |
| **Railway** | 10-15 min | ✅ Yes | Side projects | [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) |
| **Replit** | 5 min | ⚠️ Auto-sleep | Beginners, learning | [DEPLOYMENT.md](./DEPLOYMENT.md) |

### 📊 Detailed Comparison

See [FREE_DEPLOYMENT_COMPARISON.md](./FREE_DEPLOYMENT_COMPARISON.md) for a comprehensive feature-by-feature comparison to help you choose the best platform.

### 🎯 Our Recommendations

**For Production Apps (Public Facing):**
- **Best Choice:** [Fly.io with GitHub Actions](./GITHUB_DEPLOYMENT.md)
  - ✅ Always-on (no cold starts)
  - ✅ Professional CI/CD pipeline
  - ✅ Best performance and reliability
  - ✅ Global edge network
  - ✅ 3GB PostgreSQL included

**For Personal Projects & Demos:**
- **Easiest:** [Render](./RENDER_DEPLOYMENT.md)
  - ✅ 5-minute setup via web dashboard
  - ✅ 750 hours/month (can run 24/7)
  - ✅ Infrastructure-as-code with `render.yaml`
  - ✅ Use UptimeRobot to prevent auto-sleep

**For Learning & Beginners:**
- **Most Beginner-Friendly:** [Replit](./DEPLOYMENT.md)
  - ✅ Visual IDE in browser
  - ✅ No CLI or terminal required
  - ✅ One-click GitHub import
  - ✅ Built-in database and deployment

**For Developers & Side Projects:**
- **Best Developer Experience:** [Railway](./RAILWAY_DEPLOYMENT.md)
  - ✅ Great CLI and dashboard
  - ✅ No auto-sleep
  - ✅ Simple database setup
  - ✅ $5 free credit/month

### 🚀 Quick Start Links

Click any badge at the top of this README to jump directly to the deployment guide for that platform!

---

## 🔒 Security & Development

### GitHub Codespaces (Development Environment)

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