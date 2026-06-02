---
title: "Goodmarks: Reputation Protection for Local Business"
url: "https://goodmarks.io"
category: "Product"
flagship: true
status: "Live"
tagline: "reputation, protected"
order: 1
date: 2026-05-17
excerpt: "My flagship product — a mobile-first review platform that routes happy customers to public reviews and unhappy ones to a private inbox, so a business gets every chance to fix a problem before it becomes a one-star rating."
---

# Goodmarks: Turning Customer Feedback Into Reputation, Not Risk

**Goodmarks** is the product I'm proudest of shipping. It's a live, mobile-first reputation platform that helps local and small businesses collect more reviews, catch problems before they go public, and turn their best customers into a growth engine. It's complete, it's in people's hands, and it's the flagship of everything I build.

---

## The Problem

For a local business, online reviews are oxygen. A handful of one-star ratings can quietly choke off new customers for months, and most owners never see the complaint until it's already public and permanent. At the same time, the customers who *loved* the service — the ones who would happily leave a glowing review — almost never do, because nobody asked them at the right moment in the right way.

The result is a brutal asymmetry: angry customers are motivated to post publicly, delighted customers aren't, and the average business ends up with a review profile that's far worse than the experience it actually delivers.

Goodmarks exists to close that gap.

---

## What Goodmarks Does

At its core, Goodmarks is a **smart review-routing engine**. When a business asks a customer for feedback, the customer first rates their experience privately. From there, the flow splits:

- **Happy customers** are guided straight to the public platforms that matter — Google, and wherever else the business competes for visibility.
- **Unhappy customers** are routed into a **private inbox** instead, giving the owner a chance to make it right before frustration becomes a permanent one-star review.

This isn't about hiding bad feedback — it's about giving every business the same shot at service recovery that big brands have, and making sure public reviews reflect resolved relationships rather than heat-of-the-moment anger.

### Beyond routing

Goodmarks grew into a full reputation toolkit:

**Multi-channel collection** — Requests go out over SMS and email, and customers can also leave feedback through QR codes placed on receipts, tables, counters, and vehicles. Every channel funnels into the same routing logic.

**Tap-to-review with NFC** — Goodmarks writes review links directly to NFC tags, so a customer can tap their phone on a card or sticker and land straight in the review flow. It's the lowest-friction collection method there is, and it works in the physical world where service actually happens.

**Referral gifting** — Five-star reviewers can be automatically thanked with a gift, with budget controls so the program never runs away from the owner. It closes the loop: your happiest customers become your cheapest, most credible marketing channel.

**A reputation dashboard** — Route views, ratings over time, public click-through, and an at-a-glance "review protection score" let an owner see, in seconds, whether their reputation is trending up or down.

**Customization and rules** — Branding, email templates, and routing rules are all configurable so the experience feels like the business's own, not a generic third-party form.

---

## How It's Built

Goodmarks is a cross-platform mobile app built with **Expo** and **React Native** (React 19), shipping to both iOS and Android from a single TypeScript codebase. The backend runs on **Supabase** (Postgres + auth), with **TanStack React Query** managing data fetching, caching, and the offline-tolerant behavior a field-used app demands.

A few decisions that mattered:

**Native hardware, not just screens.** Goodmarks leans into what a phone can actually do — NFC tag writing, device contact import for building campaigns, push notifications for new feedback, and biometric (Face ID / fingerprint) unlock to protect a business's reputation data. These aren't web features bolted onto a mobile shell; they're the reason the product feels native.

**Subscriptions through the stores.** Billing runs through native App Store and Google Play subscriptions rather than a separate payment processor, with an annual plan that rewards commitment. It keeps signup friction near zero and purchases inside the platform customers already trust.

**Resilience as a feature.** Background tasks handle review notifications, API keys live in secure local storage, and the app is built to behave gracefully when connectivity drops — because the counter of a busy shop is exactly where signal goes to die. Recent work has gone into hardening exactly these edges (offline-state handling, keyboard-avoidance, accessibility passes).

---

## Why It's the Flagship

Goodmarks is the product where everything I care about as a developer shows up at once: a real problem with real stakes for real businesses, a thesis that's a little contrarian (protect the relationship, don't just farm stars), and an execution bar high enough to ship to two app stores and keep iterating. It's not a prototype or a tech demo — it's a finished, actively maintained product that earns its keep.

If you run a business that lives and dies by its reputation, Goodmarks makes sure the version of you that the internet sees is the version your best customers already know.

Visit [goodmarks.io](https://goodmarks.io) to learn more.
