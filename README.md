# TubeStar - Creator Studio

[![Deploy to Fly.io](https://img.shields.io/badge/Deploy-Fly.io-blueviolet?logo=fly.io)](./GITHUB_DEPLOYMENT.md)
[![Deploy to Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](./RENDER_DEPLOYMENT.md)
[![Deploy to Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway&logoColor=white)](./RAILWAY_DEPLOYMENT.md)
[![Deploy to Replit](https://img.shields.io/badge/Deploy-Replit-F26207?logo=replit&logoColor=white)](./DEPLOYMENT.md)
[![CI/CD Status](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](../../actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

A YouTube video creation helper app designed for 8-12 year old kids. Create amazing content with idea generators, script writers, thumbnail designers, and more!

> **🚀 Deploy for FREE in 5-20 minutes!** Choose from 4 free platforms with detailed guides. 
> - **Quick Start**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Step-by-step deployment with decision flowchart
> - **Compare Options**: [FREE_DEPLOYMENT_COMPARISON.md](./FREE_DEPLOYMENT_COMPARISON.md) - Choose the best platform for you

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Design](#design)
- [Getting Started (Local Development)](#getting-started)
- [🚀 Free Deployment Options](#-free-deployment-options---choose-your-platform)
- [YouTube Integration](#youtube-integration-optional)
- [Database Tables](#database-tables)
- [Safety Features](#safety-features)
- [License](#license)

---

## Features

### 🎨 **Core Creation Tools**
- **Dashboard**: Personalized welcome with guided onboarding, progress stats, and quick action links
- **Idea Generator**: Random ideas + trending section, export to clipboard/.txt/.pdf
- **Script Writer**: Templates with quality scoring, voice input, and quick-edit buttons
- **Templates**: 10 professional video templates with step-by-step guides
- **Thumbnail Designer**: Face emojis, desktop/mobile preview, 1280×720 optimization
- **Soundboard**: 12 synthesized sound effects with premium animations

### 🚀 **Premium Experience**
- **Breathing Backgrounds**: Time-aware gradients that shift throughout the day
- **Floating Particles**: Ambient particle effects for magical atmosphere
- **Coach Tips**: Context-aware tips on every page with rotating advice
- **Celebration Effects**: Multi-layer confetti, emojis, and fireworks
- **Tactile Feedback**: Spring-based button animations and glow effects
- **Keyboard Shortcuts**: Navigate with Ctrl+H/I/S/T/P/C, help with Ctrl+/

### 🏆 **Progress & Gamification**
- **Progress Tracking**: Track ideas, scripts, thumbnails, and streaks
- **Badge System**: 15+ unlockable achievements with celebrations
- **Challenge Mode**: Daily and weekly challenges with XP rewards
- **Level System**: XP-based progression with visual feedback
- **Streak Tracking**: Daily activity tracking with fire emoji

### 🔒 **Safety & Quality**
- **Content Moderation**: Kid-safe filtering with prompt injection protection
- **Error Boundaries**: Graceful error handling throughout
- **Parental Controls**: YouTube setup requires guardian assistance
- **COPPA Compliance**: Age-appropriate with parental permission system
- **Advanced Settings**: Accessibility and productivity controls

### 📱 **Accessibility & Mobile**
- **Full Keyboard Navigation**: All features accessible via keyboard
- **Mobile Optimized**: 48px touch targets, responsive grids
- **Reduced Motion**: Respects prefers-reduced-motion
- **High Contrast**: Toggle for better visibility
- **Screen Reader**: ARIA labels throughout

### 🎓 **Educational Elements**
- **Onboarding Wizard**: 5-step interactive tutorial for first-time users
- **Quality Scoring**: Checks scripts for hooks, CTAs, energy, and completeness
- **Pro Tips**: Age-appropriate advice on thumbnails, scripts, and ideas
- **Export Tools**: Copy, .txt, .pdf for offline use in CapCut/Canva

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

- **Theme**: Premium Aurora Nexus with Sticker Pop accents
- **Colors**: Cyan (#2BD4FF), Yellow (#F3C94C), Green (#6DFF9C), Purple (#A259FF)
- **Style**: Breathing gradients, glow effects, floating particles, spring animations
- **Typography**: Rajdhani (display), Plus Jakarta Sans (body)
- **Premium**: Time-aware backgrounds, tactile interactions, celebration effects
- **Inspired by**: gameforge-mobile premium patterns

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

- **users**: User authentication with XP and level tracking
- **scripts**: Saved video scripts with template metadata
- **ideas**: Saved video ideas with categories
- **thumbnails**: Saved thumbnail designs with colors and emojis
- **videoProjects**: Video editing projects with clips and overlays
- **achievements**: User badge unlocks with timestamps
- **calendarEvents**: Content scheduling and reminders
- **analytics**: Video performance metrics
- **dailyChallenges**: Challenge completion tracking
- **recordings**: Saved video recordings

## Premium Components

TubeStar includes a professional component library:

- **BreathingBackground**: Time-aware animated gradients
- **FloatingParticles**: CSS-only ambient effects  
- **TactileButton**: Spring-based interactions
- **PremiumCelebration**: Multi-layer confetti + emojis
- **LoadingState**: 5 unique loading animations
- **GlowCard**: Hover glow effects
- **MagneticButton**: Cursor attraction
- **AnimatedBackground**: Canvas particle system

See [PREMIUM_FEATURES.md](./PREMIUM_FEATURES.md) for complete documentation.

## Safety Features

The app includes server-side content moderation to block:
- Inappropriate language
- Violence and dangerous content
- Adult content
- Bullying and mean words

All user-generated content is automatically filtered to keep the platform kid-safe!

## Documentation

- **README.md** - Quick start and overview
- **FEATURES_COMPLETE.md** - Complete feature checklist
- **PREMIUM_FEATURES.md** - Premium component documentation
- **VISUAL_SHOWCASE.md** - Visual tour of every page
- **SUPER_MODE_SUMMARY.md** - Transformation overview
- **DEPLOYMENT.md** - Deployment guides
- **SECURITY.md** - Security considerations

## Keyboard Shortcuts

Power users can navigate quickly with:
- `Ctrl+H` - Dashboard
- `Ctrl+I` - Idea Generator
- `Ctrl+Shift+S` - Script Writer
- `Ctrl+T` - Thumbnail Designer
- `Ctrl+P` - Progress Tracking
- `Ctrl+Shift+C` - Challenge Mode
- `Ctrl+/` - Toggle shortcuts panel

## License

Made with 💜 for young creators

## Credits

Premium components inspired by [gameforge-mobile](https://github.com/ismaelloveexcel/gameforge-mobile) design patterns.