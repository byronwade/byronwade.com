---
title: "Thorbis: A Modern Service-Business Platform"
url: "https://thorbis.com"
category: "Product"
flagship: true
featured: true
status: "In development"
tagline: "field service, rebuilt"
order: 0
date: 2026-06-01
excerpt: "An enterprise platform for service businesses, in heavy active development. Built as a Next.js 16 monorepo on Supabase with unified communications, dispatch, and AI woven through the operations, not bolted on."
problem: "Service shops stitch together half a dozen tools for jobs, messages, payments, and dispatch, and they still lose context out in the truck."
outcome: "A unified operating system for field service: one job cockpit, live dispatch, and communications that stay with the work."
metrics:
  - label: Focus
    value: "Job cockpit"
  - label: Stack
    value: "Next.js 16"
  - label: Status
    value: "Active build"
---

# Thorbis: Building the Operating System for Service Businesses

**Thorbis** is an enterprise platform for service businesses. The dispatchers, the technicians, and the owners running HVAC, plumbing, electrical, and the other field trades. It is one of my largest and most active projects and it is in heavy ongoing development. It is a long-term bet on what this software should be. Fast, unified, secure, and actually built for the people using it every day.

This is not a weekend project. Thorbis is a real, sprawling codebase with hundreds of commits of momentum behind it, and it grows almost daily.

---

## What Thorbis Is

Thorbis is a comprehensive service-business management platform: customers, jobs, estimates, invoices, scheduling and dispatch, communications, and payments, in one system rather than the half-dozen disconnected tools most operators are forced to stitch together.

The current focus tells you where my head is at. Recent work has been on a unified **"job cockpit"**, which is one composed view of everything a job touches, replacing a sprawl of legacy job-detail screens with a single surface. The other focus is **Phase 3, live dispatch and time-tracking**, which is the heartbeat of any field operation. Each release ties back to how a real shop runs, not to a feature checklist.

---

## Why I'm Building It

After working with field-service companies and watching the daily friction firsthand, the same gaps showed up everywhere:

**Fragmented communication.** Most platforms treat SMS, email, and voice as separate systems, so context scatters across apps and messages slip through the cracks.

**Aging technology.** A lot of this software is built on architectures that cannot take advantage of modern web techniques, so it is slow and clunky exactly where it matters most. On a phone, in a truck, with one bar of signal.

**Security as an afterthought.** Multi-tenant data isolation is too often partial. That is not only a technical problem. It is a trust and compliance problem.

**One-size-fits-all.** An HVAC business and a plumbing business don't work the same way, but most tools force them into the same mold.

Thorbis is the attempt to do all of that right, from the foundation up.

---

## How It's Built

Thorbis is a **pnpm + Turborepo monorepo** built on **Next.js 16** and **React 19**, server-components-first for performance, with **Supabase** (Postgres) as the single source of truth for data and auth.

**The workspace.** Deployable apps live in `apps/*`. The main customer **web** app, an **admin** dashboard, a **mobile** app, and a **Storybook** for the shared component library. Reusable libraries live in `packages/*`: `auth`, `database`, `ui`, `shared`, and `config`. Strict conventions keep it maintainable. Server components by default, a `-client.tsx` suffix for client components, a `@thorbis/*` import scope, and lint rules that forbid barrel imports so dev memory stays sane and tree-shaking actually works.

**Communications, for real.** Voice and SMS run through **Twilio**, including the 10DLC registration that makes business texting compliant and not just functional. That is the unglamorous plumbing that separates a demo from a product.

**Payments.** Billing and transactions run on **Stripe**.

**AI woven in.** The platform builds on the Vercel **AI SDK**, with AI treated as part of operations, handling and assisting throughout the workflow, instead of a chatbot stapled to the corner.

**A disciplined design system.** In-app surfaces are driven entirely by semantic design tokens and shared UI primitives, with a migration toward a tighter, Linear-style system underway. Accessibility is non-negotiable: full keyboard support, visible focus rings, and proper hit-target sizing are baked into the conventions, not retrofitted.

---

## The Bet

Thorbis is a stepping stone toward field-service software that's actually *fast*, keeps every conversation and record in one place, treats security and multi-tenancy as foundational, and adapts to the business instead of the other way around. The trades deserve better tools than they've been handed, and Thorbis is my long-running attempt to build them.

It is under heavy active development, so the most accurate thing I can tell you is that the version you would see today is already behind the version in the repo. Learn more at [thorbis.com](https://thorbis.com).
