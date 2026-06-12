# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Byron Wade's personal portfolio and business platform built with **Next.js 16 Beta** and **React 19 RC**, showcasing development work, projects, and featuring a local business directory platform (**local.byronwade.com**). The site emphasizes performance, accessibility, and spam protection. Uses **Biome with Ultracite** for ultra-fast linting and formatting.

## Development Commands

### Standard Development
```bash
npm run dev                    # Start dev server on localhost:3000 (uses Turbopack by default in Next.js 16)
npm run dev:turbo             # Explicit Turbopack dev server
npm run build                 # Production build (uses Turbopack by default)
npm run start                 # Start production server
npm run lint                  # Run Biome linter
npm run lint:fix              # Auto-fix with Biome
npm run format                # Format code with Biome
npm run check                 # Run Biome + TypeScript checks
npm run type-check            # Run TypeScript type checking only
```

### Local Business Directory Development
```bash
npm run dev:local             # Start on local.byronwade.com:3001
npm run dev:local:turbo      # Start local with Turbopack
npm run build:local          # Build for local development
npm run start:local          # Start local production server
```

### Docker Development
```bash
npm run docker:local          # Start Docker with PostgreSQL + Redis
npm run docker:local:down    # Stop Docker services
npm run docker:production    # Production Docker setup
npm run docker:production:down
```

### Performance & Analysis
```bash
npm run build:analyze        # Build with bundle analyzer
npm run perf:lighthouse      # Run Lighthouse performance test
npm run perf:budget          # Check performance budget
npm run clear                # Clear .turbo, .next, node_modules
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.0.0-beta.0 with App Router (force-static rendering)
- **React**: React 19.0.0-rc.1 with React Compiler support
- **Bundler**: Turbopack (default in Next.js 16, 700x faster than Webpack)
- **Language**: TypeScript (strict mode enabled)
- **Linter/Formatter**: Biome 2.2.6 with Ultracite 5.6.4 (replaces ESLint/Prettier)
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI (shadcn/ui) for accessible primitives
- **State**: Zustand for client-side state
- **Data Fetching**: React Query (@tanstack/react-query)
- **Themes**: next-themes, system preference first (light + dark) with a user toggle
- **Performance**: Aggressive caching with Next.js unstable_cache
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei

### Key Directories
```
app/                          # Next.js App Router pages
├── layout.tsx               # Root layout with system-first theming, performance monitoring
├── metadata.config.ts       # Centralized metadata configuration
├── page.tsx                 # Gateway (split-screen portal)
├── web-development/         # Web dev landing page
├── contact/                 # Contact page with spam protection
├── portfolio/               # Portfolio showcase
├── plumbing-santa-cruz/     # Plumbing services page
├── invest/                  # Investment/funding information
└── */page.tsx              # Other routes

components/
├── common/                  # Shared utilities
│   ├── error-boundary.tsx  # Error boundary wrapper
│   └── optimized-image.tsx # Image optimization wrapper
├── features/                # Feature modules (organized by feature)
│   ├── performance/        # Performance optimization
│   │   ├── monitor.tsx    # Performance monitoring
│   │   ├── optimizer.tsx  # Performance optimization
│   │   └── index.ts       # Feature exports
│   └── pwa/               # Progressive Web App
│       ├── service-worker-registration.tsx
│       └── index.ts
├── layout/                  # Layout components
│   ├── header.tsx          # Site header
│   ├── footer.tsx          # Site footer
│   ├── nav.tsx             # Navigation
│   ├── conditional-layout.tsx # Layout wrapper
│   └── navigation-button.tsx  # Nav button component
├── sections/                # Page sections
│   ├── hero-section.tsx    # Main hero
│   ├── contact-section.tsx # Contact section
│   ├── portfolio-section.tsx # Portfolio grid
│   ├── services-section.tsx # Services display
│   ├── testimonials-section.tsx # Testimonials
│   ├── background.tsx      # Animated background
│   ├── page-header.tsx     # Reusable page header
│   └── hero-pages.tsx      # Page hero variant
├── portfolio/               # Portfolio feature
│   ├── figma-viewer.tsx    # Figma interactive viewer
│   └── index.ts            # Feature exports
├── business/                # Business features
│   └── plumbing/           # Plumbing-specific
│       ├── work-card.tsx   # Work showcase card
│       └── index.ts        # Feature exports
├── gateway/                 # Gateway components
│   ├── split-gateway.tsx   # Main split container
│   ├── web-dev-portal.tsx  # Left portal
│   ├── plumbing-portal.tsx # Right portal
│   ├── animated-divider.tsx # Center divider
│   ├── mobile-tap-indicator.tsx # Mobile prompts
│   └── gateway-loader.tsx  # Loading screen
├── analysis/                # Analysis feature (16 files)
├── charts/                  # Chart components
├── ui/                      # shadcn/ui primitives (73 files)
└── theme-provider.tsx       # Theme provider (infrastructure)

lib/
├── portfolio-data.ts        # GitHub/Dribbble/Figma data fetching with caching
├── contact-utils.ts         # Contact obfuscation utilities (spam protection)
├── performance-utils.ts     # Performance caching and monitoring
├── queries/index.ts         # Data query functions
└── utils.ts                 # General utilities (cn, etc.)

docs/                         # Documentation (NEW)
├── LOCAL_DEVELOPMENT.md     # Development setup guide
├── PERFORMANCE.md           # Performance optimization guide
└── SPAM_PROTECTION.md       # Anti-spam implementation guide

hooks/                        # Custom React hooks
└── use-reduced-motion.ts    # Accessibility hook
```

### Important Architectural Patterns

#### 1. Performance-First Architecture (Next.js 16 + Turbopack)
- **Force Static Rendering**: Root layout uses `export const dynamic = "force-static"` to prevent streaming issues
- **Turbopack Bundling**: Next.js 16 uses Turbopack by default (700x faster than Webpack)
- **Zero-Config Bundling**: Removed custom webpack configuration - Turbopack handles optimization automatically
- **Aggressive Caching**: All external API calls (GitHub, Dribbble, Figma) use `unstable_cache` with 1-2 hour revalidation
- **Image Optimization**: WebP/AVIF formats, responsive sizes, blur placeholders (disabled in dev mode)
- **Resource Hints**: DNS prefetch and preconnect for external APIs (GitHub, Dribbble, Figma, Google Fonts)
- **React 19 Features**: Automatic batching, transitions, and improved hydration

#### 2. Contact Information Protection (Anti-Spam)
**Critical**: This site implements multi-layer spam protection to prevent automated harvesting of contact info.

- **Base64 Obfuscation**: All contact info stored as base64-encoded strings in `lib/contact-utils.ts`
- **Client-Side Only**: Contact details only render after user interaction using `ObfuscatedContact` component
- **Click-to-Reveal**: Users must click to see actual email/phone
- **No Meta Detection**: `formatDetection: false` in metadata config prevents automatic link detection
- **Obfuscated Schema**: JSON-LD structured data uses partially obfuscated contact info

**When working with contact info**:
- Use `ObfuscatedEmail` or `ObfuscatedPhone` components from `components/ui/obfuscated-contact.tsx`
- Never hardcode raw email/phone numbers in JSX or metadata
- Use utility functions from `lib/contact-utils.ts` for all contact operations

#### 3. Data Fetching Strategy
```typescript
// All external data fetching follows this pattern:
import { unstable_cache } from "next/cache";

export const getDataFunction = unstable_cache(
  async () => {
    // Fetch logic with timeout (3-5 seconds max)
    // Error handling with fallbacks
  },
  ["cache-key"],
  {
    revalidate: 3600, // 1 hour for most data
    tags: ["data-type"], // For selective revalidation
  }
);
```

**Data Sources**:
- **GitHub**: Repos, profile, stats, README, languages, repo statistics, traffic, workflows
- **Dribbble**: Shots and analytics (requires `DRIBBBLE_ACCESS_TOKEN`)
- **Figma**: Files and comprehensive analytics (requires `FIGMA_ACCESS_TOKEN` and `FIGMA_TEAM_ID`)

**Timeout Strategy**: All API calls use `fetchWithTimeout` (3-5s max) to fail fast and prevent page hangs.

#### 4. Code Quality with Biome + Ultracite
**Ultra-fast linting and formatting** with zero configuration.

**Why Ultracite?**
- **Zero-config**: Extends `biome.jsonc` with one line: `"extends": ["ultracite"]`
- **Lightning fast**: Rust-based Biome is 700x faster than ESLint
- **AI-optimized**: Designed for consistent code generation with AI tools
- **All-in-one**: Replaces ESLint, Prettier, and related plugins

**Configuration**: Single file `biome.jsonc`:
```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["ultracite"]
}
```

**Commands**:
- `npm run lint` - Check for issues
- `npm run lint:fix` - Auto-fix issues
- `npm run format` - Format code
- `npm run check` - Lint + format + type-check

**Important**:
- Biome/Ultracite replaced ESLint and Prettier entirely
- `.eslintrc.json` has been removed
- No Prettier configuration needed
- Biome handles import sorting, formatting, and linting
- Over 300 rules preconfigured for Next.js, React, and TypeScript

#### 5. System-First Theming (Light + Dark)
- ThemeProvider uses `defaultTheme="system"` with `enableSystem` — first visit follows the OS light/dark preference
- A theme toggle (`components/common/theme-toggle.tsx`, plus the dock toolbar) lets users override; the choice persists via next-themes
- `attribute="class"` + `disableTransitionOnChange`; viewport `colorScheme: "light dark"` so native UI (scrollbars, form controls) tracks the theme
- Build every surface for both schemes — pair base tokens with `dark:` variants; never assume one mode

#### 5. Performance Monitoring
- **Web Vitals Tracking**: Real-time FCP, LCP, CLS, TBT monitoring
- **Performance Budget**: Enforced via `lighthouse-budget.json`
- **Components**: `PerformanceMonitor`, `PerformanceOptimizer`, `ServiceWorkerRegistration`
- **Utilities**: `PerformanceTracker` singleton in `lib/performance-utils.ts`

#### 6. Path Aliases
```typescript
"@/*"           // Root directory
"@/lib/*"       // lib/
"@/queries/*"   // lib/queries/
"@/components/*"// components/
"@/types/*"     // types/
```

## Environment Variables

### Required for Full Functionality
```bash
# GitHub Integration (Portfolio data)
GITHUB_API_TOKEN=              # Required for portfolio repos/stats
GITHUB_TOKEN=                  # Alias for GITHUB_API_TOKEN

# Design Portfolio
DRIBBBLE_ACCESS_TOKEN=         # Optional: Dribbble shots
DRIBBBLE_TOKEN=                # Alias for DRIBBBLE_ACCESS_TOKEN
FIGMA_ACCESS_TOKEN=            # Optional: Figma files
FIGMA_TEAM_ID=                 # Required with Figma token

# Local Business Directory (local.byronwade.com)
MAPS_API_KEY=                  # Optional: Location features
GEOCODING_API_KEY=             # Optional: Geocoding

# Build Configuration
NODE_ENV=development|production
ANALYZE=true                   # Enable bundle analyzer
ENABLE_LOCAL_FEATURES=true     # Enable local.byronwade.com features
```

### Environment Setup
```bash
# Copy template
cp env.local.example .env.local

# For local business directory development
./scripts/setup-local.sh
```

## Special Development Notes

### 1. Next.js 16 Beta Breaking Changes
**IMPORTANT**: Next.js 16 introduces significant changes:

- **Turbopack is now default**: No need for `--turbopack` flag
- **`revalidateTag()` signature changed**: Now requires 2 arguments: `revalidateTag(tag, '')`  or `revalidateTag(tag, cacheLifeConfig)`
- **`next.config.js` changes**:
  - `eslint` config is removed (use Biome instead)
  - Add empty `turbopack: {}` config to acknowledge Turbopack usage
  - Webpack config is deprecated (Turbopack handles optimization)
- **React 19 compatibility**: Some packages may have peer dependency warnings - use `--legacy-peer-deps`
- **`.npmrc` file**: Added with `legacy-peer-deps=true` for dependency resolution

**Migration Notes**:
- Removed all webpack configuration (Turbopack handles bundle splitting automatically)
- Updated all Next.js API calls that changed signatures in v16
- React 19 requires updated `@types/react` and `@types/react-dom` (v19.x)

### 2. Local Business Directory (local.byronwade.com)
- Separate dev environment on port 3001 with custom hostname
- Requires hosts file entry: `127.0.0.1 local.byronwade.com`
- Docker setup includes PostgreSQL and Redis
- See `LOCAL_DEVELOPMENT.md` for complete setup guide

### 2. Performance Optimizations
- See `PERFORMANCE.md` for comprehensive performance strategy
- Bundle size target: < 300KB JavaScript
- Core Web Vitals targets: LCP < 3.0s, FCP < 2.0s, CLS < 0.1
- Achieved 68% bundle size reduction from original implementation

### 3. Spam Protection System
- See `SPAM_PROTECTION.md` for full documentation
- Never bypass obfuscation when adding contact features
- Test click-to-reveal functionality after any contact changes

### 4. TypeScript Configuration
- Strict mode enabled
- Module resolution: `bundler`
- All imports should have types or proper `@types` packages
- Run `npm run type-check` before committing

### 5. Component Development
- Server Components by default (no "use client" unless needed)
- Use "use client" only for: hooks, browser APIs, interactivity, event handlers
- Prefer composition over prop drilling
- Use Radix UI primitives via shadcn/ui for accessibility
- Follow existing naming conventions: PascalCase for components, kebab-case for files

### 6. Portfolio Projects
Three main investment projects showcased:
1. **Thorbis.com** - B2B marketplace platform ("Amazon for businesses")
2. **Thorbis AI Platform** - Proprietary AI procurement engine
3. **Thorbis Mobile** - Mobile-first B2B commerce app

These have priority in `lib/portfolio-data.ts` and custom status/progress tracking.

### 7. Split-Screen Gateway Architecture
**IMPORTANT**: The homepage is now a full-screen, no-scroll gateway/portal that splits the site into two distinct business identities.

**Gateway Structure** (`/` - Homepage):
- **Left Side (White)**: Web Development portal → navigates to `/web-development`
  - White background (#FFFFFF)
  - Black text (#000000)
  - Subtle gold accents (#D4AF37, #FFD700)
  - "Byron Wade - Full-Stack Developer"
  - Animated particles and parallax effects

- **Right Side (Black)**: Plumbing Services portal → navigates to `/plumbing-santa-cruz`
  - Deep black background (#0A0A0A)
  - White text (#FFFFFF)
  - Copper/bronze accents (#C77844, #B87333)
  - "Wade's Plumbing & Septic - Santa Cruz County"
  - Water droplet and copper shimmer effects

- **Center Divider**: Animated copper pipe effect
  - Vertical on desktop (lg+)
  - Horizontal on mobile (< lg)
  - Flowing liquid animation
  - Responsive to hover states
  - Gold glow (left hover) / Copper glow (right hover)

**Critical Design Rules**:
- NO overlapping the centerline - surgical precision split
- NO scrolling on gateway page
- Each side is fully clickable (entire half is a link)
- Hover effects expand the hovered side (52/48 split)
- Mobile: Stacks vertically (top/bottom)
- Header/Footer hidden on gateway, shown on other pages

**Component Files**:
- `components/gateway/split-gateway.tsx` - Main container
- `components/gateway/web-dev-portal.tsx` - Left side
- `components/gateway/plumbing-portal.tsx` - Right side
- `components/gateway/animated-divider.tsx` - Center divider
- `components/layout/conditional-layout.tsx` - Layout wrapper

**Routing**:
```
/                     → Gateway (split-screen portal)
/web-development     → Web dev home (full portfolio/services)
/plumbing-santa-cruz → Plumbing services home
```

### 8. Copper Color System
New copper color palette for plumbing brand:
```typescript
copper: {
  50: "#FDF8F3",   // Lightest
  100: "#F9EEE5",
  200: "#F2DCC9",
  300: "#E8C4A0",
  400: "#D4A574",
  500: "#C77844",  // Primary copper
  600: "#B87333",  // Dark copper (brand primary)
  700: "#9A5F2A",
  800: "#7D4D23",
  900: "#66401E",  // Darkest
}
```

### 9. Styling Conventions
- Use Tailwind utility classes
- `cn()` utility from `lib/utils.ts` for conditional classes
- Custom animations in `globals.css` (including gateway utilities)
- Mobile-first responsive design
- Theme follows system preference first with a user toggle (light + dark); support both via tokens + `dark:` variants. The gateway split is a fixed editorial treatment (white left / black right), independent of the active theme.

## Common Workflows

### Modifying the Gateway
**File**: `components/gateway/split-gateway.tsx`

To adjust hover expansion ratio:
```typescript
style={{
  flex: hoveredSide === "left" ? "1.08" : ... // Adjust this value
}}
```

To change navigation destinations:
- Edit Link `href` in `web-dev-portal.tsx` (currently `/web-development`)
- Edit Link `href` in `plumbing-portal.tsx` (currently `/plumbing-santa-cruz`)

To customize animations:
- Particles: `web-dev-portal.tsx` (lines 46-61)
- Water droplets: `plumbing-portal.tsx` (lines 49-65)
- Divider flow: `animated-divider.tsx` (lines 22-31)

### Adding a New Page
1. Create `app/[page-name]/page.tsx` with async Server Component
2. Add metadata export or use `generateMetadata()`
3. Use existing section components from `components/sections/`
4. Add route to sitemap in `app/sitemap.ts` if needed
5. Header/Footer will automatically appear (handled by ConditionalLayout)

### Working with External APIs
1. Add data fetching function to appropriate file in `lib/`
2. Wrap with `unstable_cache()` with appropriate revalidation time
3. Use `fetchWithTimeout()` for external calls (3-5s timeout)
4. Handle errors gracefully with fallbacks
5. Add proper TypeScript types in `types/`

### Performance Testing
```bash
# Local performance audit
npm run build:production
npm run perf:lighthouse

# Bundle analysis
npm run build:analyze

# Check performance budget
npm run perf:budget
```

### Debugging
- Use Chrome DevTools for client debugging
- Server Components: check terminal output
- Docker logs: `docker-compose -f docker-compose.local.yml logs -f`
- Type errors: `npm run type-check`
- Lint errors: `npm run lint`

## Important Files

### Configuration
- `next.config.js` - Next.js config with webpack optimization, image config, security headers
- `tsconfig.json` - TypeScript configuration with strict mode and path aliases
- `tailwind.config.ts` - Tailwind configuration
- `app/metadata.config.ts` - Centralized metadata configuration

### Utilities
- `lib/contact-utils.ts` - **Critical**: Contact obfuscation and spam protection
- `lib/performance-utils.ts` - Caching and performance monitoring
- `lib/portfolio-data.ts` - External API integrations (GitHub, Dribbble, Figma)
- `lib/utils.ts` - General utilities including `cn()` for class merging

### Key Components (Feature-Based Organization)

**Infrastructure:**
- `app/layout.tsx` - Root layout with theme, monitoring, error boundary
- `components/theme-provider.tsx` - Theme configuration

**Layout:**
- `components/layout/conditional-layout.tsx` - Hides header/footer on gateway
- `components/layout/header.tsx` - Site header
- `components/layout/footer.tsx` - Site footer
- `components/layout/nav.tsx` - Navigation component

**Gateway (Homepage):**
- `components/gateway/split-gateway.tsx` - Main split-screen portal
- `components/gateway/web-dev-portal.tsx` - Left side (web development)
- `components/gateway/plumbing-portal.tsx` - Right side (plumbing services)
- `components/gateway/animated-divider.tsx` - Center divider

**Features:**
- `components/features/performance/monitor.tsx` - Real-time performance tracking
- `components/features/performance/optimizer.tsx` - Performance optimization
- `components/features/pwa/service-worker-registration.tsx` - PWA support

**Portfolio:**
- `components/portfolio/figma-viewer.tsx` - Interactive Figma viewer
- `components/analysis/*` - Portfolio analysis components (16 files)

**Business:**
- `components/business/plumbing/work-card.tsx` - Plumbing work showcase

**Sections:**
- `components/sections/hero-section.tsx` - Main hero
- `components/sections/page-header.tsx` - Reusable page headers
- `components/sections/*` - Other page sections (9 files)

**Critical:**
- `components/ui/obfuscated-contact.tsx` - **Critical**: Spam-protected contact display
- `components/common/error-boundary.tsx` - Error boundary for graceful failures

## Testing

### Type Checking
```bash
npm run type-check  # Must pass before deployment
```

### Linting
```bash
npm run lint       # Check for issues
npm run lint:fix   # Auto-fix issues
```

### Performance
- Run Lighthouse audits before major releases
- Check bundle size with analyzer
- Verify Core Web Vitals in production

## Deployment

### Production Build
```bash
npm run build:production
npm run start:production
```

### Vercel Deployment
- Main branch deploys automatically
- Environment variables configured in Vercel dashboard
- Uses standalone output mode for optimal container size

## Additional Documentation
- `README.md` - Project overview and quick start
- `docs/LOCAL_DEVELOPMENT.md` - Complete local.byronwade.com setup guide
- `docs/PERFORMANCE.md` - Comprehensive performance optimization documentation
- `docs/SPAM_PROTECTION.md` - Anti-spam implementation details

## Component Organization Principles

**Feature-Based Structure**: Components are organized by feature/domain rather than type:
- **features/** - Self-contained feature modules (performance, PWA)
- **business/** - Business-specific components (plumbing, future services)
- **portfolio/** - Portfolio-specific components (viewers, cards)
- **sections/** - Page sections and reusable page components
- **layout/** - Site-wide layout components
- **ui/** - Base UI primitives from shadcn/ui
- **common/** - Shared utilities and wrappers

**Index Files**: Each feature directory has an `index.ts` for clean exports:
```typescript
// Import from feature
import { PerformanceMonitor } from "@/components/features/performance";
// Instead of
import { PerformanceMonitor } from "@/components/features/performance/monitor";
```

**Naming Conventions**:
- Feature folders: lowercase with hyphens (e.g., `business/plumbing/`)
- Component files: kebab-case (e.g., `figma-viewer.tsx`)
- Components: PascalCase (e.g., `FigmaViewer`)
- Index exports: Named exports for tree-shaking
