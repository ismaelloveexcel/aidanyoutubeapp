# TubeStar Creator Studio

## Overview

TubeStar Creator Studio is a YouTube video creation helper app designed for 8-12 year old kids. It provides a complete content creation workflow with features including idea generation, script writing, thumbnail design, video recording, editing, and upload preparation. The app emphasizes kid-safe content through built-in moderation filters.

## Recent Changes (January 2026)

- **Aurora Nexus Arcade Theme**: Premium gaming aesthetic redesign with cosmic midnight backgrounds, holographic card effects, and neon glow accents (NO PINK - per user preference)
- **Gaming-Inspired Visual Language**: References to Stranger Things (portal gradients), Squid Game (circle/triangle/square progress indicators), and Fortnite (holographic card effects)
- **Aurora Nexus Color Palette**:
  - Plasma Cyan (#2BD4FF) - Primary accent
  - Reactor Gold (#F3C94C) - Secondary accent
  - Nebula Violet (#4E4DFF) - Tertiary accent
  - Luminous Lime (#6DFF9C / #4BCC7A for gradients) - Success/completion
  - Eclipse Base (#050B1F) - Dark background
  - Warp Grid (#122046) - Card backgrounds
- **Typography**: Rajdhani display font for headings (geometric futurism), Plus Jakarta Sans for body text
- **Gaming Terminology**: "Victory Royale", "Quest Log", "Player Setup", "Next Mission" throughout the UX
- **5-Step Workflow**: Generate Idea, Write Script, Record Video, Edit Video, Upload & Share
- **Progress Tracking**: Users can mark steps as complete by clicking the step numbers
- **Holographic Nav Bar**: Glassmorphism header with glow effects and neon borders
- **Professional Layout**: Centered pill navigation (3-section header: logo, nav, utility), responsive two-column dashboard grid
- **Player Setup Modal**: Cohesive onboarding experience with 5-column avatar grid

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state, React Context for local state (creator profile)
- **Styling**: Tailwind CSS v4 with custom theme variables, Framer Motion for animations
- **UI Components**: Custom shadcn/ui-inspired component library in `client/src/components/ui/`
- **Design System**: Aurora Nexus Arcade with cosmic backgrounds (Eclipse Base/Warp Grid), holographic card effects (glassmorphism), and gaming-inspired UI elements (Squid Game shapes, Stranger Things portal gradients)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful JSON API with routes defined in `server/routes.ts`
- **Database**: PostgreSQL with Drizzle ORM
- **Security Middleware**: Helmet (security headers), CORS, express-rate-limit
- **Content Moderation**: Custom kid-safe text filtering in `server/moderation.ts`
- **Password Security**: bcrypt hashing with 12 salt rounds

### Database Schema
Located in `shared/schema.ts` using Drizzle ORM:
- **users**: id (UUID), username, password (hashed), xp, level, createdAt
- **scripts**: id, templateId, title, steps (JSON array), timestamps
- **ideas**: id, title, description, category, saved flag, createdAt
- **thumbnails**: id, title, bgColor, emoji, createdAt

### Build System
- **Development**: `tsx server/index.ts` runs TypeScript directly
- **Production Build**: Vite builds frontend to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- **Database Migrations**: `npm run db:push` uses Drizzle Kit

### Key Design Decisions
1. **Shared Schema**: Database schemas and Zod validation schemas are shared between client and server via `@shared/*` path alias
2. **Content Moderation**: All user-generated text passes through moderation before storage to ensure kid-safety
3. **Progressive Enhancement**: Features like video recording/editing work client-side without backend processing
4. **Local Storage**: Creator profile (name, avatar) persists in browser localStorage

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connected via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and migrations

### Security & Middleware
- **helmet**: Security headers (CSP in production only)
- **cors**: Cross-origin request handling
- **express-rate-limit**: API rate limiting
- **bcrypt**: Password hashing

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animations and transitions
- **lucide-react**: Icon library
- **wouter**: Lightweight routing

### Build Tools
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server bundler for production
- **drizzle-kit**: Database migration tool

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Set to "production" for deployment
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins (production only)