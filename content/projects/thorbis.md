---
title: "Thorbis: A Modern Service-Business Platform"
url: "https://thorbis.com"
category: "Product"
tagline: "field service, rebuilt"
date: 2026-06-01
excerpt: "An enterprise platform for service businesses, in heavy active development, built as a Next.js 16 monorepo on Supabase with unified communications, dispatch, and AI woven through the operations, not bolted on."
---

# Thorbis: Building the Operating System for Service Businesses

**Thorbis** is an enterprise platform for service businesses: the dispatchers, technicians, and owners who run HVAC, plumbing, electrical, and other field-based trades. It's one of my largest and most active projects, in heavy ongoing development, and it represents a long-term bet on what this software should be: fast, unified, secure, and genuinely built for the people who use it every day.

This is not a weekend project. Thorbis is a real, sprawling codebase with hundreds of commits of momentum behind it, and it grows almost daily.

---

## What Thorbis Is

Thorbis is a comprehensive service-business management platform: customers, jobs, estimates, invoices, scheduling and dispatch, communications, and payments, in one system rather than the half-dozen disconnected tools most operators are forced to stitch together.

The current focus tells you where my head is at. Recent work has centered on a unified **"job cockpit"**: a single, composed view of everything a job touches, replacing a sprawl of legacy job-detail screens with one coherent surface, and on **Phase 3: live dispatch and time-tracking**, the heartbeat of any field operation. Each release ties back to how a real shop runs, not to a feature checklist.

---

## Why I'm Building It

After working with field-service companies and watching the daily friction firsthand, the same gaps showed up everywhere:

**Fragmented communication.** Most platforms treat SMS, email, and voice as separate systems, so context scatters across apps and messages slip through the cracks.

**Aging technology.** A lot of this software is built on architectures that can't take advantage of modern web techniques, so it's slow and clunky exactly where it matters most: on a phone, in a truck, with one bar of signal.

**Security as an afterthought.** Multi-tenant data isolation is too often partial, which isn't just a technical problem. It's a trust and compliance problem.

**One-size-fits-all.** An HVAC business and a plumbing business don't work the same way, but most tools force them into the same mold.

Thorbis is the attempt to do all of that right, from the foundation up.

---

## How It's Built

Thorbis is a **pnpm + Turborepo monorepo** built on **Next.js 16** and **React 19**, server-components-first for performance, with **Supabase** (Postgres) as the single source of truth for data and auth.

**The workspace.** Deployable apps live in `apps/*`: the main customer **web** app, an **admin** dashboard, a **mobile** app, and a **Storybook** for the shared component library. Reusable libraries live in `packages/*`: `auth`, `database`, `ui`, `shared`, and `config`. Strict conventions keep it maintainable: server components by default, a `-client.tsx` suffix for client components, a `@thorbis/*` import scope, and lint rules that forbid barrel imports so dev memory stays sane and tree-shaking actually works.

**Communications, for real.** Voice and SMS run through **Twilio**, including the 10DLC registration that makes business texting compliant rather than just functional, the kind of unglamorous plumbing that separates a demo from a product.

**Payments.** Billing and transactions run on **Stripe**.

**AI woven in.** The platform builds on the Vercel **AI SDK**, with AI treated as part of operations (intelligent handling and assistance throughout the workflow) rather than a chatbot stapled to the corner.

**A disciplined design system.** In-app surfaces are driven entirely by semantic design tokens and shared UI primitives, with a migration toward a tighter, Linear-style system underway. Accessibility is non-negotiable: full keyboard support, visible focus rings, and proper hit-target sizing are baked into the conventions, not retrofitted.

---

## The Bet

Thorbis is a stepping stone toward field-service software that's actually *fast*, keeps every conversation and record in one place, treats security and multi-tenancy as foundational, and adapts to the business instead of the other way around. The trades deserve better tools than they've been handed, and Thorbis is my long-running attempt to build them.

It's under active, heavy development, so the most accurate thing I can say is that the version you'd see today is already behind the version in the repo. Learn more at [thorbis.com](https://thorbis.com).
