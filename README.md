This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Vercel Products Integration

This portfolio integrates several Vercel products for enhanced monitoring, performance tracking, and configuration management:

### Vercel Analytics (`@vercel/analytics`)

- **Automatic page view tracking** - All page views are automatically tracked
- **Custom event tracking** - Portfolio-specific events are tracked:
  - Project views and clicks
  - Blog post views
  - Resume downloads
  - External link clicks
  - Social media link clicks

Usage in code:
```typescript
import { analytics } from "@/lib/analytics";

// Track custom events
analytics.projectView(slug, title);
analytics.resumeDownload("pdf");
analytics.externalLinkClick(url, linkText);
```

### Vercel Speed Insights (`@vercel/speed-insights`)

- **Core Web Vitals monitoring** - Automatic tracking of LCP, FID, CLS, INP, and more
- **Real-time performance dashboard** - View metrics in your Vercel dashboard
- **Automatic metric collection** - No additional configuration needed

Speed Insights automatically tracks performance metrics. View them in your Vercel project dashboard under "Speed Insights".

### Vercel Edge Config (`@vercel/edge-config`)

- **Low-latency configuration** - Store and retrieve configuration at the edge
- **Dynamic content management** - Update site settings without redeployment
- **Feature toggles** - Enable/disable features dynamically

Setup:
1. Create an Edge Config in your Vercel project dashboard
2. Add the `EDGE_CONFIG` environment variable to your project
3. Use the utilities in `lib/edge-config.ts`:

```typescript
import { getEdgeConfigValue, isFeatureEnabled } from "@/lib/edge-config";

// Get a configuration value
const setting = await getEdgeConfigValue<string>("siteSettings.announcement.message");

// Check if a feature is enabled
const enabled = await isFeatureEnabled("features.enableInteractiveDashboard");
```

### Environment Variables

Required environment variables (add to your Vercel project settings):

- `EDGE_CONFIG` - Edge Config connection string (format: `https://edge-config.vercel.app/{edge-config-id}?token={edge-config-token}`)
- `NEXT_PUBLIC_BASE_URL` - Base URL for the application (e.g., `https://byronwade.com`)

Optional:
- `NEXT_PUBLIC_ENABLE_WEB_VITALS` - Set to `"1"` to enable web vitals tracking in development mode

### Performance Monitoring

The portfolio includes a comprehensive performance monitoring system:

- **PerformanceMonitor component** - Tracks Core Web Vitals and sends to Analytics
- **usePerformanceTracking hook** - Manual performance metric tracking
- Works alongside Speed Insights for comprehensive performance data

### Analytics Events

The following events are tracked automatically:

- `project_view` - When a user views a project detail page
- `project_click` - When a user clicks on a project link
- `blog_post_view` - When a user views a blog post
- `blog_post_read` - When a user reads a blog post (scroll tracking)
- `resume_download` - When a user downloads the resume PDF
- `external_link_click` - When a user clicks an external link
- `social_link_click` - When a user clicks a social media link
- `web_vital` - Core Web Vitals metrics

View analytics data in your Vercel project dashboard under "Analytics".
