# Integration Examples

This document shows how to integrate the new components into your existing pages.

## 1. Reading Progress Bar (Blog Posts)

Add to `app/blog/[slug]/page.tsx`:

```tsx
import { ReadingProgress } from "@/components/reading-progress";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // ... existing code ...
  
  return (
    <div className="relative min-h-screen w-full bg-[var(--background)]">
      {/* Add reading progress bar */}
      <ReadingProgress />
      
      {/* Rest of your existing code */}
    </div>
  );
}
```

## 2. Social Share Buttons (Blog Posts)

Add to `app/blog/[slug]/page.tsx` in the `BlogPostContent` component:

```tsx
import { SocialShare } from "@/components/social-share";

async function BlogPostContent({ slug }: { slug: string }) {
  // ... existing code ...
  
  return (
    <>
      {/* ... existing structured data ... */}
      
      {/* Add social share buttons after the title */}
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] tracking-tight">
          {post.title}
        </h1>
        {post.date && (
          <p className="text-xs text-[var(--muted-foreground)]">
            {format(new Date(post.date), "MMMM d, yyyy")}
          </p>
        )}
        {/* Add social share */}
        <SocialShare
          url={url}
          title={post.title}
          description={post.excerpt}
          className="mt-4"
        />
      </div>
      
      {/* ... rest of content ... */}
    </>
  );
}
```

## 3. Scroll Reveal Animations

Wrap sections in `components/home-projects.tsx`:

```tsx
import { ScrollReveal } from "@/components/scroll-reveal";

export function HomeProjects() {
  return (
    <ScrollReveal direction="up" delay={100}>
      <div className="animate-in animate-delay-5 w-full">
        <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 w-full">
          <div className="flex flex-col gap-2 sm:gap-3">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] tracking-tight">
              Projects
            </h2>
          </div>
          <ProjectsList />
        </div>
      </div>
    </ScrollReveal>
  );
}
```

## 4. 3D Card Tilt (Project Cards)

Update `components/home-projects.tsx`:

```tsx
import { Card3DTilt } from "@/components/card-3d-tilt";

// In ProjectsList component:
<Card3DTilt intensity={3}>
  <Link
    key={project.slug}
    href={`/projects/${project.slug}`}
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-1.5 sm:py-2 gap-2 sm:gap-4"
  >
    {/* ... existing content ... */}
  </Link>
</Card3DTilt>
```

## 5. Magnetic Buttons (Social Links)

Update `components/home-interactive.tsx`:

```tsx
import { MagneticButton } from "@/components/magnetic-button";

// Replace social buttons:
<MagneticButton
  as="a"
  href="https://github.com/byronwade"
  target="_blank"
  rel="noopener noreferrer"
  className="group inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md bg-gradient-to-br from-accent/25 to-accent/15 dark:from-accent/20 dark:to-accent/10 border border-accent/40 dark:border-accent/30 hover:from-accent/35 hover:to-accent/25 dark:hover:from-accent/25 dark:hover:to-accent/15 hover:border-accent/50 dark:hover:border-accent/40 transition-all duration-300 social-button focus-ring"
  aria-label="GitHub"
>
  <Github className="size-3.5 sm:size-4 text-accent transition-colors" />
  <span className="text-xs sm:text-sm font-medium text-accent transition-colors">
    GitHub
  </span>
</MagneticButton>
```

## 6. Breadcrumb Navigation

Add to `app/blog/[slug]/page.tsx`:

```tsx
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

async function BlogPostContent({ slug }: { slug: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
  const url = `${baseUrl}/blog/${slug}`;
  
  // ... existing code ...
  
  return (
    <>
      {/* Add breadcrumb navigation */}
      <BreadcrumbNav
        items={[
          { name: "Home", url: baseUrl },
          { name: "Blog", url: `${baseUrl}/blog` },
          { name: post.title, url },
        ]}
        className="mb-4"
      />
      
      {/* ... rest of content ... */}
    </>
  );
}
```

## 7. Combined Example: Enhanced Blog Post Page

Here's a complete example of an enhanced blog post page:

```tsx
import { ReadingProgress } from "@/components/reading-progress";
import { SocialShare } from "@/components/social-share";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ScrollReveal } from "@/components/scroll-reveal";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)]">
      <ReadingProgress />
      
      <div className="relative flex justify-center py-8 px-4 sm:py-10 md:py-12 safe-top safe-bottom">
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 items-center w-full max-w-2xl">
          <Suspense fallback={/* ... */}>
            <BlogPostContent slug={slug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getBlogPost(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
  const url = `${baseUrl}/blog/${slug}`;
  
  if (!post) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <ScrollReveal direction="up">
        <BreadcrumbNav
          items={[
            { name: "Home", url: baseUrl },
            { name: "Blog", url: `${baseUrl}/blog` },
            { name: post.title, url },
          ]}
          className="w-full mb-4"
        />
      </ScrollReveal>

      {/* Header */}
      <ScrollReveal direction="up" delay={100}>
        <div className="flex flex-col gap-2 w-full">
          <h1>{post.title}</h1>
          {post.date && <p>{format(new Date(post.date), "MMMM d, yyyy")}</p>}
          <SocialShare url={url} title={post.title} description={post.excerpt} />
        </div>
      </ScrollReveal>

      {/* Content */}
      <ScrollReveal direction="up" delay={200}>
        <article>
          {/* ... markdown content ... */}
        </article>
      </ScrollReveal>
    </>
  );
}
```

## Testing Checklist

After integrating:

- [ ] Test with keyboard navigation
- [ ] Test with screen reader
- [ ] Test on mobile devices
- [ ] Test with `prefers-reduced-motion: reduce`
- [ ] Check Core Web Vitals (LCP, CLS, INP)
- [ ] Verify all animations are smooth
- [ ] Test social sharing on actual devices
- [ ] Verify breadcrumbs work correctly
- [ ] Check that reading progress bar doesn't interfere with layout
