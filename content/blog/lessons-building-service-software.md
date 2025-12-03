---
title: "Lessons from Building Service Management Software"
date: 2024-03-10
excerpt: "What I've learned building Thorbis, a field service management platform, and why understanding the user's world is everything."
---

After years of working with field service companies and building [Thorbis](https://thorbis.com), I've learned that building software for service professionals is fundamentally different from building for other industries. These are people who spend their days in the field, solving real problems for real customers. They don't have time for complicated interfaces, slow loading times, or features they'll never use.

Here are the most important lessons I've learned along the way.

## Understanding the User's World

The most critical lesson: **you have to understand the user's world**. Not theoretically, but actually.

After working with national HVAC brands and seeing how field service companies operate day-to-day, I identified patterns that most software completely misses:

Service professionals work on mobile devices, often with dirty hands, in basements, attics, and remote locations. They need information quickly, not buried in menus. They operate in real-time, jobs change, schedules shift, and everyone needs to know immediately. They value simplicity over features, speed over bells and whistles.

But more than that, they face specific problems that existing software doesn't solve:

**Fragmented Communication**: Most platforms treat SMS, email, and voice calls as separate systems. ServiceTitan can't receive photos on toll-free numbers. Housecall Pro limits texting to mobile devices only, forcing office staff to juggle phones while at their desks. This fragmentation creates communication gaps, missed messages, and frustrated customers.

**Performance Problems**: Bundle sizes are bloated, initial page loads are slow, and mobile experiences are subpar. In an industry where technicians are constantly on the move, every second of load time matters.

**Missing Real-World Features**: Industry leaders like ServiceTitan track 47+ critical job fields that many platforms ignore. Job costing, profitability tracking, warranty management, and equipment history are often incomplete or missing entirely.

## Design Principles That Actually Matter

### 1. Mobile-First Isn't Optional

If it doesn't work well on a phone, it doesn't work. Period. Service professionals live on their phones. Every feature must be tested and optimized for mobile devices, the scheduling interface, job details, customer information, all designed for small screens and touch interactions.

But mobile-first means more than responsive design. It means:
- Large touch targets for dirty or gloved hands
- High contrast for outdoor visibility
- Minimal typing required
- Fast performance even on slower connections

### 2. Speed Is a Feature, Not a Nice-to-Have

Every second counts when you're trying to get information between calls or while on a job site. We've reduced bundle sizes by 795KB through aggressive optimization. Core Web Vitals are prioritized: LCP under 2.5s, FID under 100ms, CLS under 0.1. Every optimization decision is measured and validated.

Fast loading, instant updates, minimal clicks, these aren't performance metrics, they're user experience requirements.

### 3. Offline Capability Is Essential

Service professionals work in basements, attics, and remote locations. The app needs to work even when connectivity is spotty. Technicians can access job details, update status, and work with checklists even when connectivity is poor. Changes sync automatically when connection is restored.

Service workers and IndexedDB enable offline functionality. Technicians can work with job details, update status, and fill out forms even without connectivity. Changes queue up and sync when connection is restored.

### 4. Unified Communication, Not Fragmented Channels

When a job changes, everyone needs to know immediately. But more importantly, all communication needs to be in one place. Unlike competitors that fragment communication across platforms, Thorbis provides a **unified conversation hub** that brings SMS, email, voice, and in-app messaging together in one place.

This solves the critical problem of communication context loss that plagues existing solutions. Customers can reach you via their preferred channel, and all conversations are unified in a single thread. No more switching between apps to see the full conversation history.

## Technical Choices That Make a Difference

Building with **Next.js 16** and **React 19** isn't just about using modern technology, it's about building a platform that can scale, perform, and evolve.

**Server Components First**: By default, everything is a server component. This means less JavaScript sent to the browser, faster initial page loads, and better SEO. Client components are only used when interactivity is actually needed.

**Partial Prerendering (PPR)**: Thorbis leverages Next.js 16's Partial Prerendering to get the best of both worlds: static performance for the shell and dynamic data for personalized content. This means pages load instantly while still showing real-time data.

**Server Actions Over API Routes**: Instead of building separate API routes for every mutation, Thorbis uses Server Actions. This reduces boilerplate, improves type safety, and makes the codebase more maintainable. Server Actions are authenticated, validated, and secure by default.

**Streaming with Suspense**: Heavy data loads are streamed to the client with React Suspense boundaries. Users see the page shell immediately, then data streams in as it becomes available. This dramatically improves perceived performance.

## Security and Compliance from Day One

Row-Level Security (RLS) is often an afterthought or partially implemented in existing platforms. Critical tables containing customer data, payment information, and communications lack proper access controls. This isn't just a technical issue, it's a compliance and trust issue.

In Thorbis, Row-Level Security is enabled on all tables. Server-side validation with Zod ensures data integrity. Every mutation goes through proper authentication and authorization checks. Security isn't added later, it's built in from the beginning.

## Industry Best Practices, Not Generic Solutions

Thorbis doesn't just implement features, it implements them the way industry leaders do it. After analyzing ServiceTitan, Jobber, and Housecall Pro, we've incorporated their best practices while avoiding their mistakes.

The price book structure uses three distinct item types (Services, Materials, Equipment) with hierarchical categories, following ServiceTitan's proven approach. Job workflow includes comprehensive lifecycle tracking with 47+ critical fields for costing, scheduling, warranty, and compliance, matching enterprise-level platforms.

The settings system includes 23 database tables covering communications, customers, scheduling, billing, and more. Every aspect of the platform is configurable without code changes.

## Real-World Workflow Focus

Thorbis isn't built in a vacuum. It's built by understanding how service companies actually operate.

Property enrichment features pull in demographics, air quality, elevation, flood zones, and market data to help technicians and dispatchers make better decisions. Customizable job detail pages adapt to different industries, HVAC companies see different information than plumbing businesses, and both can customize their view.

## The Feedback Loop

The best features come from real users solving real problems. I'm constantly talking to service professionals, understanding their workflows, and building features that actually help. Every release is tied to customer metrics, faster booking, higher close rates, lower DSO.

The goal isn't to add every possible feature, but to solve the core problems that matter most. This means saying no to features that don't serve the user's actual needs, even if they seem impressive.

## What I've Learned

Building Thorbis has been a journey of understanding what field service companies actually need versus what existing platforms provide. The most important lessons:

1. **Architecture matters more than features**: A well-architected system can grow; a poorly architected one will collapse under its own weight.

2. **Performance is a feature**: Users notice fast applications more than they notice slow ones with more features.

3. **Security can't be an afterthought**: Row-Level Security, server-side validation, and proper access controls must be built in from day one.

4. **Unified experiences beat fragmented tools**: One conversation hub is better than separate systems for SMS, email, and voice.

5. **Mobile-first isn't a design choice**: It's a requirement for field service professionals who spend their days on phones in challenging environments.

6. **Industry knowledge matters**: Understanding how ServiceTitan, Jobber, and Housecall Pro work, and where they fail, is essential for building something better.

The service industry is still underserved by technology. There's so much opportunity to build tools that genuinely make people's lives easier. That's what keeps me building.

If you're working in this space or thinking about it, I'd love to connect. The problems are real, and the solutions are worth building together.

