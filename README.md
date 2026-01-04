# TubeStar - Creator Studio

A YouTube video creation helper app designed for 8-12 year old kids. Create amazing content with idea generators, script writers, thumbnail designers, and more!

## Features

- **Dashboard**: Personalized welcome screen with creator profile setup and quick action links
- **Idea Generator**: Get random video ideas across Gaming, Tech, Vlog, and React categories
- **Script Writer**: Template-based script creation with Gaming Highlight, Product Review, and Daily Vlog templates
- **Templates**: Browse professional video templates for trending styles (Stranger Things, Minecraft, Challenges, etc.)
- **Thumbnail Designer**: Create eye-catching thumbnails with colors, emojis, and quick templates
- **Soundboard**: Fun sound effect buttons with visual feedback animations
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

## Build for Production

```bash
npm run build
npm start
```

## Open in GitHub Codespaces ☁️

The easiest way to start developing is with GitHub Codespaces:

1. Click the green "Code" button on the repository page
2. Select the "Codespaces" tab
3. Click "Create codespace on main"
4. Wait for the environment to set up (dependencies install automatically)
5. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string
6. Run `npm run db:push` to set up the database schema
7. Run `npm run dev` to start the development server

The Codespace comes pre-configured with Node.js 20 and all required extensions.

## Deploy to Replit ⭐

This app is fully Replit-ready with one-click deployment! See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step instructions.

**Quick Start on Replit:**
1. Go to [replit.com](https://replit.com) and click "Create Repl"
2. Select "Import from GitHub" and paste: `https://github.com/ismaelloveexcel/aidanyoutubeapp`
3. In Tools → Database, create a PostgreSQL database (auto-configures `DATABASE_URL`)
4. Open Shell and run `npm run db:push`
5. Click "Run" ▶️ to start development
6. Click "Deploy" 🚀 for production deployment

**Why Replit?**
- Visual IDE - no command line required
- Built-in PostgreSQL database
- One-click deployment
- Automatic HTTPS
- Easy environment variable management

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