---
title: "Ciel: Hosting You Can Actually Read"
category: "Concept"
tagline: "hosting you can read"
date: 2026-06-01
excerpt: "A deployment platform I designed around three things every host gets wrong: predictable cost, security as a default instead of an upsell, and deployment states you can actually understand when something breaks. Frontend prototype on mock data."
status: "Archived"
featured: false
---

# Ciel: A Deployment Platform Built for Legibility

**Ciel** (French for "sky") is a frontend design concept I built to reimagine the three things that quietly make modern hosting miserable: bills you can't predict, security features locked behind enterprise tiers, and deployment failures that read like a stack trace wrote a ransom note. The name is the whole idea. Hosting should be a clear layer above your app and not a black box you pray to.

---

## The Problem

Anyone who's shipped on Vercel, Netlify, Railway, Render, or Cloudflare knows the three recurring frustrations:

**Cost is a surprise.** You find out what you spent when the invoice arrives. Never in real time, and never attributed to *what* drove it (humans? bots? crawlers? preview bandwidth?).

**Security is an upsell.** Preview protection, secret masking, step-up reauth, passkeys. The things that should be table stakes are all sitting behind "contact sales."

**Failures are illegible.** A deploy breaks and you get a wall of raw build output or a vague "DNS error," with no clear answer to the only two questions that matter: what broke, and how do I fix it?

Ciel is a design answer to all three.

---

## What Ciel Does

Ciel is organized around three promises:

**Cost visibility first.** Budgets at the workspace and project level, each with a mode (hard stop, grace buffer, auto-scale, or prepaid), and traffic *attributed by type*: human, bot, verified crawler, and preview bandwidth. The sample project that reached its hard cap shows as paused, with a banner and a way to resume. All of it is shown *before* the bill, not after. Visual meters and attribution charts make spend something you steer, not something you discover.

**Security as the default.** Passkeys, preview access protection, secret masking with deliberate disclosure, and step-up reauthentication, meant for every tier and never gated. The auth surface has its own screen for each step: signup, email verification, passkey sign-in, MFA setup and challenge, recovery codes, SSO, device approval, password reset, and re-authentication. Sensitive dialogs like revealing a secret or changing a role are marked as needing re-authentication; the prototype doesn't enforce that step yet.

**Deployment states you can read.** A deployment timeline you can follow, *parsed* build-failure cards that say what actually went wrong and link to the fix, DNS records that each show whether they're found, missing, mismatched, or pending, a unified event log, and recovery actions like rollback, redeploy, and resume. When a deploy breaks, Ciel's job is to make the next step obvious.

Around that core sits the rest of a real platform: import pages for moving off Vercel, Netlify, and Render. Team management with roles, invites, OAuth apps, and sessions. A command palette on Cmd/Ctrl+K and keyboard shortcuts. And a first-run flow from signup and email verification to a welcome card for naming the workspace and a step-by-step new-project wizard.

---

## How It's Built

Ciel runs on **Next.js 16** (App Router, Turbopack) and **React 19** with TypeScript, **Tailwind CSS v4**, and **shadcn/ui** components built on Base UI primitives. Charts use Recharts. The command palette uses cmdk. Theming is dark-mode-aware via next-themes.

A few details I'm proud of even at this stage:

**A real domain component library.** Rather than generic dashboard widgets, Ciel has components built for its own concepts. Budget meters, deployment timelines, DNS record cards, traffic-attribution charts, parsed-issue cards, status pills. The product's *ideas* are encoded in its UI vocabulary.

**Route-backed overlays.** The 29 dialogs and 4 side panels in its registry are driven by query parameters (`?dialog=`, `?panel=`), so each one is linkable, shareable, and back-button-friendly. Submitting one shows a success message; nothing is saved.

**Deterministic avatars.** Each person gets a stable OKLCH gradient hashed from a seed, such as their email on the team page, so collaborators are recognizable without uploaded photos. A matching generator for friendly animal names is written too, but no screen uses it yet.

---

## Status, An Honest Note

Ciel is a **frontend-first prototype** that I built in June 2026. The product surface (navigation, layouts, flows, data visualization, and auth screens) runs against a typed mock-data layer, with stubbed authentication: signing in sets a demo session cookie, and there's no real passkey or Git check behind it. There's no production deploy pipeline or live database. That phase was about getting the *experience* right before any infrastructure went in.

I work this way on purpose. Designing the full interface against realistic mock data first lets me pressure-test the hard product questions. How do you make cost legible? What does a *good* failure screen look like? And I get to answer those without committing to backend choices too early. The shell is real and considered. The engine room would come next.

As checked on October 21, 2026, the hosted demo is no longer available. You can browse the prototype's [source on GitHub](https://github.com/byronwade/ciel.byronwade.com).
