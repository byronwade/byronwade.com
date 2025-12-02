# Comprehensive pSEO System Documentation

## Overview

This document describes the extremely elaborate Programmatic SEO (pSEO) system implemented for byronwade.com. The system includes comprehensive metadata, structured data, OG image generation, and SEO optimizations across all pages.

## Components

### 1. OG Image Generation API (`/app/api/og/route.tsx`)

**Features:**
- Dynamic Open Graph image generation using Vercel OG
- Support for multiple content types: website, article, project, blog
- Customizable templates with type-specific color schemes
- Dynamic font loading (custom Modelista signature font)
- Supports title, description, author, date, tags
- Beautiful gradient backgrounds and decorative elements
- Type badge indicators
- Responsive 1200x630px images (standard OG size)

**Usage:**
```
/api/og?title=My Title&description=My Description&type=article&author=Byron Wade&date=2024-01-01
```

### 2. SEO Utility Library (`/lib/seo.ts`)

**Functions:**

#### `generateMetadata(config: SEOConfig): Metadata`
Comprehensive metadata generator for any page including:
- Title templates
- Meta descriptions
- Keywords (default + page-specific)
- Open Graph tags (all variants)
- Twitter Card tags
- Canonical URLs
- Language alternates
- Robots directives
- Article metadata (published/modified times, authors, tags)
- Image optimization

#### `generateOGImageUrl(params)`
Generates optimized OG image URLs with query parameters

#### `generateBreadcrumbStructuredData(items)`
Creates BreadcrumbList structured data for navigation

#### `generateArticleStructuredData(params)`
Creates Article structured data with:
- Headline, description
- Author (Person schema)
- Publisher (Organization schema)
- Publication dates
- Main entity references
- Images

#### `generateWebSiteStructuredData()`
Creates WebSite structured data with:
- SearchAction for search functionality
- Publisher information
- Description

#### `generateOrganizationStructuredData()`
Creates Organization structured data with:
- Logo
- SameAs social links
- Contact points

#### `generatePersonStructuredData()`
Enhanced Person structured data with:
- Job title, occupation
- Skills, knowsAbout
- Address, contact info
- WorksFor organization
- Offers/services

#### `generateProjectStructuredData(params)`
Creates CreativeWork structured data for projects

### 3. Enhanced Sitemap (`/app/sitemap.ts`)

**Features:**
- Includes all static pages (home, resume, blog, projects)
- Dynamically includes all blog posts
- Dynamically includes all projects
- Proper priorities (1.0 for home, 0.9 for resume, 0.8 for listings, 0.7 for content)
- Change frequency indicators
- Last modified dates from content files

### 4. Page-Specific Metadata

#### Home Page (`/app/page.tsx`)
- Uses default metadata from metadata.config.ts
- Includes WebSite, Organization, and Person structured data

#### Blog Listing (`/app/blog/page.tsx`)
- Custom metadata with blog-specific keywords
- WebSite structured data
- Breadcrumb structured data

#### Blog Post Pages (`/app/blog/[slug]/page.tsx`)
- Dynamic metadata per post
- Article structured data
- Breadcrumb structured data
- OG images with article template
- Publication dates
- Author information

#### Projects Listing (`/app/projects/page.tsx`)
- Project-specific metadata
- Enhanced keywords

#### Project Pages (`/app/projects/[slug]/page.tsx`)
- Dynamic metadata per project
- Project/CreativeWork structured data
- Breadcrumb structured data
- OG images with project template
- Category/tag support

#### Resume Page (`/app/resume/page.tsx`)
- Professional metadata
- Person structured data enhancement

### 5. Structured Data Implementation

**Types Included:**
1. **Person** - Complete profile information
2. **Organization** - Business entity details
3. **WebSite** - Site-wide information with SearchAction
4. **Article** - Blog post structured data
5. **CreativeWork/Project** - Project structured data
6. **BreadcrumbList** - Navigation breadcrumbs on all pages
7. **Service** - Offered services (embedded in Person)

**Implementation:**
- All structured data is rendered as JSON-LD scripts
- Proper escaping and security considerations
- Multiple structured data types per page where appropriate

### 6. Enhanced Metadata Configuration

**Base Configuration (`/app/metadata.config.ts`):**
- Comprehensive meta tags
- Open Graph configuration
- Twitter Card configuration
- Icon configurations (all sizes)
- Apple Web App meta
- Theme colors
- Viewport settings
- Search engine verification placeholders

### 7. Robots.txt Optimization (`/public/robots.txt`)

**Features:**
- Allows legitimate search engines
- Blocks aggressive scrapers and bad bots
- Crawl-delay settings
- Sitemap reference
- API and admin route blocking

## SEO Features Implemented

### Technical SEO
- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ Alt text for images
- ✅ Canonical URLs
- ✅ Language tags
- ✅ Mobile-friendly viewport
- ✅ Fast page loads
- ✅ Structured data (JSON-LD)
- ✅ XML Sitemap
- ✅ Robots.txt

### Content SEO
- ✅ Unique titles per page
- ✅ Meta descriptions
- ✅ Keywords (page-specific + default)
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Article metadata
- ✅ Author attribution
- ✅ Publication dates

### Social Media SEO
- ✅ Open Graph images (dynamic)
- ✅ Twitter Card images
- ✅ Social sharing optimization
- ✅ Proper image dimensions
- ✅ Rich previews

### Structured Data SEO
- ✅ Person schema
- ✅ Organization schema
- ✅ WebSite schema
- ✅ Article schema
- ✅ BreadcrumbList schema
- ✅ CreativeWork/Project schema
- ✅ Service schema

### International SEO
- ✅ Language tags (en-US, en-GB, en-CA)
- ✅ Alternate language support
- ✅ Locale settings
- ✅ hreflang-ready structure

### Performance SEO
- ✅ Image optimization
- ✅ OG image caching
- ✅ Static generation
- ✅ Fast API responses

## Usage Examples

### Adding Metadata to a New Page

```typescript
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return generateSEOMetadata({
    title: "Page Title",
    description: "Page description",
    keywords: ["custom", "keywords"],
    type: "website",
    canonical: "https://byronwade.com/page",
  });
}
```

### Adding Structured Data

```typescript
import { generateArticleStructuredData } from "@/lib/seo";

const structuredData = generateArticleStructuredData({
  title: "Article Title",
  description: "Description",
  author: "Byron Wade",
  publishedTime: "2024-01-01",
  url: "https://byronwade.com/article",
});

// Then in JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>
```

### Generating OG Images

```typescript
import { generateOGImageUrl } from "@/lib/seo";

const ogImage = generateOGImageUrl({
  title: "My Page",
  description: "Description",
  type: "article",
  author: "Byron Wade",
  date: "2024-01-01",
});
```

## Configuration

### Environment Variables
- `NEXT_PUBLIC_BASE_URL` - Base URL for all metadata and OG images

### Customization Points
- Color schemes in `/app/api/og/route.tsx`
- Default keywords in `/lib/seo.ts`
- Site name and author in `/lib/seo.ts`
- Structured data fields in respective generator functions

## Testing

### OG Images
Visit: `https://byronwade.com/api/og?title=Test&description=Testing&type=website`

### Structured Data
Use Google's Rich Results Test: https://search.google.com/test/rich-results

### Sitemap
Visit: `https://byronwade.com/sitemap.xml`

### Metadata
Use browser dev tools or:
- Open Graph Debugger: https://www.opengraph.xyz/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

## Future Enhancements

Potential additions:
- RSS feed generation
- NewsArticle schema for news content
- FAQPage schema for FAQs
- Review/Rating schemas
- VideoObject schemas
- Event schemas
- LocalBusiness enhancements
- Multiple language support
- AMP pages
- hreflang implementation

## Notes

- All OG images are generated on-demand and can be cached
- Structured data uses JSON-LD format (preferred by Google)
- Metadata is server-rendered for optimal SEO
- All images meet platform requirements (1200x630 for OG, etc.)
- The system is fully type-safe with TypeScript

