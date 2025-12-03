---
title: "Building Thorbis: A Modern Field Service Management Platform for the Next Generation"
date: 2025-11-18
excerpt: "How years of working with field service companies led me to build a comprehensive platform that solves the fragmented, outdated tools service companies have been forced to use."
---

After years of working with field service companies and witnessing the daily struggles of dispatchers, technicians, and business owners, I decided to build **Thorbis**, a comprehensive field service management platform designed from the ground up with modern technology, real-world workflows, and operational excellence at its core.

This isn't just another software project. It's a response to the fragmented, outdated, and often frustrating tools that service companies have been forced to use. Thorbis represents what field service management should be: fast, reliable, secure, and built for the people who actually use it every day.

## What is Thorbis?

Thorbis is an enterprise-grade field service management platform built specifically for home service and commercial trade companies. Whether you're running an HVAC business, plumbing operation, electrical service, or any other field-based service company, Thorbis provides the complete toolkit you need to manage your operations from the first customer call to final payment.

The platform includes customer management, work management, unified communications, payments, field service capabilities, reporting and analytics, and a multi-tenant architecture that scales from solo operators to enterprise teams.

## Why I Started Building Thorbis

After working with national HVAC brands and seeing how field service companies operate, I identified critical gaps in the market:

**Fragmented Communication**: Most field service platforms treat SMS, email, and voice calls as separate systems. ServiceTitan can't receive photos on toll-free numbers. Housecall Pro limits texting to mobile devices only, forcing office staff to juggle phones while at their desks. This fragmentation creates communication gaps, missed messages, and frustrated customers.

**Outdated Technology**: Many field service platforms are built on legacy architectures that can't leverage modern web technologies. They're slow, clunky, and don't take advantage of server-side rendering, streaming, or modern React patterns. This results in poor performance, especially on mobile devices where technicians spend most of their time.

**Security Gaps**: Row-Level Security (RLS) is often an afterthought or partially implemented. Critical tables containing customer data, payment information, and communications lack proper access controls. This isn't just a technical issue, it's a compliance and trust issue.

**One-Size-Fits-All Approach**: Most platforms force every business into the same workflow, regardless of industry or size. An HVAC company has different needs than a plumbing business, but existing solutions don't adapt. Customization is expensive, time-consuming, or simply not possible.

**Performance Problems**: Bundle sizes are bloated, initial page loads are slow, and mobile experiences are subpar. In an industry where technicians are constantly on the move, every second of load time matters.

**Missing Real-World Features**: Industry leaders like ServiceTitan track 47+ critical job fields that many platforms ignore. Job costing, profitability tracking, warranty management, and equipment history are often incomplete or missing entirely.

I set out to build a platform that puts operators first, automates with empathy, measures outcomes not features, and prioritizes security and dependability.

## Modern Architecture from Day One

Thorbis is built on **Next.js 16** with **React 19**, leveraging the App Router, Partial Prerendering (PPR), and server-side rendering by default. This isn't just about using the latest technology, it's about building a platform that can scale, perform, and evolve.

By default, everything is a server component. This means less JavaScript sent to the browser, faster initial page loads, and better SEO. Client components are only used when interactivity is actually needed.

We've reduced bundle sizes by 795KB through aggressive optimization. Core Web Vitals are prioritized: LCP under 2.5s, FID under 100ms, CLS under 0.1. Every optimization decision is measured and validated.

Row-Level Security (RLS) is enabled on all tables. Server-side validation with Zod ensures data integrity. Every mutation goes through proper authentication and authorization checks.

## Unified Communication Hub

Unlike competitors that fragment communication across platforms, Thorbis provides a **unified conversation hub** that brings SMS, email, voice, and in-app messaging together in one place. This solves the critical problem of communication context loss that plagues existing solutions.

Customers can reach you via their preferred channel, and all conversations are unified in a single thread. No more switching between apps to see the full conversation history. Assignment systems, internal notes, real-time presence indicators, and typing indicators make team collaboration seamless.

The messaging interface is optimized for mobile, with offline support and fast performance even on slower connections, critical for technicians who spend their days in the field.

## Industry Best Practices Built In

Thorbis doesn't just implement features, it implements them the way industry leaders do it. After analyzing ServiceTitan, Jobber, and Housecall Pro, we've incorporated their best practices while avoiding their mistakes.

The price book structure uses three distinct item types (Services, Materials, Equipment) with hierarchical categories, following ServiceTitan's proven approach. Job workflow includes comprehensive lifecycle tracking with 47+ critical fields for costing, scheduling, warranty, and compliance, matching enterprise-level platforms.

The settings system includes 23 database tables covering communications, customers, scheduling, billing, and more. Every aspect of the platform is configurable without code changes.

## Real-World Workflow Focus

Thorbis isn't built in a vacuum. It's built by understanding how service companies actually operate.

Technicians can access job details, update status, and work with checklists even when connectivity is poor. Changes sync automatically when connection is restored. Every feature is tested and optimized for mobile devices, the scheduling interface, job details, customer information, all designed for small screens and touch interactions.

Property enrichment features pull in demographics, air quality, elevation, flood zones, and market data to help technicians and dispatchers make better decisions. Customizable job detail pages adapt to different industries, HVAC companies see different information than plumbing businesses, and both can customize their view.

## Technical Innovations

Thorbis leverages Next.js 16's Partial Prerendering to get the best of both worlds: static performance for the shell and dynamic data for personalized content. This means pages load instantly while still showing real-time data.

Instead of building separate API routes for every mutation, Thorbis uses Server Actions. This reduces boilerplate, improves type safety, and makes the codebase more maintainable. Server Actions are authenticated, validated, and secure by default.

Heavy data loads are streamed to the client with React Suspense boundaries. Users see the page shell immediately, then data streams in as it becomes available. This dramatically improves perceived performance.

Service workers and IndexedDB enable offline functionality. Technicians can work with job details, update status, and fill out forms even without connectivity. Changes queue up and sync when connection is restored.

## The Road Ahead

Thorbis is more than a product, it's a platform for the future of field service management. As we continue to build, we're focused on:

- **AI Integration**: Intelligent call handling, automated follow-ups, and smart scheduling recommendations that learn from your business patterns
- **Advanced Analytics**: Predictive insights that help you understand not just what happened, but what's likely to happen next
- **Ecosystem Integration**: APIs and webhooks that let Thorbis integrate with the tools you already use, from accounting software to marketing platforms
- **Industry Specialization**: Deep customization for specific trades, with industry-specific workflows, terminology, and best practices built in

## Conclusion

Building Thorbis has been a journey of understanding what field service companies actually need versus what existing platforms provide. It's a stepping stone toward a future where field service management software is fast, unified, secure, flexible, and reliable.

The field service industry deserves better tools. Thorbis is my contribution to making that happen, one feature, one optimization, one customer success story at a time.

If you're running a field service business and tired of fragmented tools, slow performance, and security concerns, Thorbis might be the platform you've been waiting for. It's built for operators, by operators, with the technology stack and architecture that can actually deliver on the promise of modern field service management.

Thorbis is open for early access, join the waitlist to be part of shaping the future of field service management.

