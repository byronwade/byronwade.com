---
title: "Ciel: Hosting You Can Actually Read"
url: "https://ciel.byronwade.com"
category: "Concept"
tagline: "hosting you can read"
date: 2026-06-01
excerpt: "A deployment platform I'm designing around three things every host gets wrong: predictable cost, security as a default instead of an upsell, and deployment states you can actually understand when something breaks."
---

# Ciel: A Deployment Platform Built for Legibility

**Ciel** (French for "sky") is a frontend design concept I've been exploring to reimagine the three things that quietly make modern hosting miserable: bills you can't predict, security features locked behind enterprise tiers, and deployment failures that read like a stack trace wrote a ransom note. The name is the thesis — hosting should be a clear layer above your app, not a black box you pray to.

---

## The Problem

Anyone who's shipped on Vercel, Netlify, Railway, Render, or Cloudflare knows the three recurring frustrations:

**Cost is a surprise.** You find out what you spent when the invoice arrives — never in real time, never attributed to *what* drove it (humans? bots? crawlers? preview bandwidth?).

**Security is an upsell.** Preview protection, secret masking, step-up reauth, passkeys — the things that should be table stakes are gated behind "contact sales."

**Failures are illegible.** A deploy breaks and you get a wall of raw build output or a vague "DNS error," with no clear answer to the only two questions that matter: what broke, and how do I fix it?

Ciel is a design answer to all three.

---

## What Ciel Does

Ciel is organized around three promises:

**Cost visibility first.** Hierarchical budgets at the workspace, project, and environment level, with traffic *attributed by type* — human vs. bot vs. crawler vs. preview bandwidth — and budget-pause logic, all shown *before* the bill, not after. Visual meters and attribution charts make spend something you steer, not something you discover.

**Security as the default.** Passkeys, preview access protection, secret masking with deliberate disclosure, and step-up reauthentication — offered to every tier, never gated. The auth surface is built out properly: signup, email verification, passkeys, MFA, SSO, device approval, and recovery flows.

**Deployment states you can read.** A deployment timeline you can follow, *parsed* build-failure cards that tell you what actually went wrong, DNS records tracked like a package in transit, a unified event log, and one-click recovery on every failure. When a deploy breaks, Ciel's job is to make the next step obvious.

Around that core sits the rest of a real platform: a guided import hub for migrating off Vercel, Netlify, and Render; team management with roles, invites, OAuth apps, and sessions; a command palette and keyboard-first navigation; and a polished first-run setup flow.

---

## How It's Built

Ciel runs on **Next.js 16** (App Router, Turbopack) and **React 19** with TypeScript, **Tailwind CSS v4**, and **shadcn/ui** components built on Base UI primitives. Charts use Recharts; the command palette uses cmdk; theming is dark-mode-aware via next-themes.

A few details I'm proud of even at this stage:

**A real domain component library.** Rather than generic dashboard widgets, Ciel has purpose-built components for its concepts — budget meters, deployment timelines, DNS record cards, traffic-attribution charts, parsed-issue cards, status pills. The product's *ideas* are encoded in its UI vocabulary.

**Route-backed overlays.** Dialogs and side panels are driven by query parameters (`?dialog=`, `?panel=`), so every modal state is linkable, shareable, and back-button-friendly.

**Deterministic identity.** Anonymous actors get stable, friendly identities — a hashed animal name and a matching OKLCH gradient — generated from a seed, so collaborators are recognizable without exposing anything.

---

## Status — An Honest Note

Ciel is in active development, and right now it's a **frontend-first prototype**: the entire product surface — navigation, layouts, flows, data visualization, auth screens — is built and working against a typed mock-data layer, with stubbed authentication. There's no production deploy pipeline or live database behind it yet; this phase is about getting the *experience* right before the infrastructure goes in.

I work this way on purpose. Designing the full interface against realistic mock data first lets me pressure-test the hard product questions — how do you make cost legible? what does a *good* failure screen look like? — without prematurely committing to backend choices. The shell is real and considered; the engine room is what's next.

See the current build at [ciel.byronwade.com](https://ciel.byronwade.com).
