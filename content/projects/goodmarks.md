---
title: "Goodmarks: Reputation Protection for Local Business"
url: "https://goodmarks.io"
category: "Product"
flagship: false
featured: false
status: "Archived"
tagline: "reputation, protected"
order: 1
date: 2026-05-17
excerpt: "A review-routing product for local businesses, with a public web signup and a native-app waitlist. It combines public review links with a private feedback option for service recovery."
problem: "Local businesses need a way to ask for feedback and respond when a customer has a problem."
outcome: "A shared review link with public platform choices and a private feedback channel; customer and revenue outcomes are not measured here."
metrics:
  - label: Status
    value: "Web signup"
  - label: Focus
    value: "Reviews"
  - label: Surface
    value: "Web"
---

# Goodmarks: Turning Customer Feedback Into Reputation, Not Risk

**Goodmarks** grew out of my experience running a plumbing company: I wanted a way to hear about a customer's problem while I could still respond to it.

As checked on October 20, 2026, [goodmarks.io](https://goodmarks.io) offers web signup and lists the native iOS and Android app as a notification waitlist. This case study does not establish an app-store release, customer adoption, or revenue.

---

## The Problem

Running a service business made the gap between doing the work and hearing about the experience hard to ignore. A customer might have a complaint I could resolve, but I needed a way to hear it. Asking for feedback also needed to fit into the workday.

That is the problem I set out to address. A feedback channel gives an owner somewhere to start a conversation; it does not guarantee a better rating or prevent a public complaint.

---

## What Goodmarks Does

The [published routing explanation](https://goodmarks.io/no-review-gating) describes a rating-led flow with two options:

- **Public reviews:** every rating retains access to the business's configured review platforms.
- **Private feedback:** lower ratings also get a channel to contact the owner. It is an additional option, not a replacement for posting publicly.

This account comes from the public documentation; the signed-in flow was not exercised for this review.

### Beyond routing

The public product pages distinguish available web features from upcoming work:

**Links and collection.** The [roadmap](https://goodmarks.io/roadmap) describes email requests and marks Smart Links and QR codes as beta. SMS requests remain upcoming, rather than a shipped channel.

**Physical entry points.** The roadmap includes NFC tags among the placements for review links, alongside receipts, vehicles, and counter cards.

**Customer appreciation.** The [Delight feature page](https://goodmarks.io/features/delight) describes beta gifting, budget caps, and an owner approval queue for campaigns.

**A feedback dashboard.** The public site describes rating and link-activity analytics to help an owner follow incoming feedback.

**Customization.** The public site describes business branding and configurable review destinations.

---

## How It's Built

The public [stack credits](https://goodmarks.io/humans.txt), dated May 7, 2026, describe a **Next.js**, **React**, and **TypeScript** web application using **Supabase**, hosted on **Vercel**, with **Stripe** billing. These are published credits, not an inspection of the current application source.

The distinction between the web product and the native plan matters:

**Native availability.** The public site lists iOS and Android on a native-app waitlist. The documented web product is the available surface described here.

**Web subscriptions.** The [May release notes](https://goodmarks.io/changelog) describe a dashboard billing page and Stripe customer portal. They do not establish App Store or Google Play subscription availability.

**Ongoing work.** The release notes describe integration hardening and label several newer features beta. Their release stages matter when deciding which parts of the product to try.

---

## Why It's the Flagship

I originally described Goodmarks as my flagship because it connected my service-business experience with product development. That motivation still explains the project. This site's earlier-work grouping is editorial; the public web product has its own release history.

The goal is to make feedback easier to collect and act on. Establishing whether it improves retention, referrals, or ratings requires measured results.

Visit [goodmarks.io](https://goodmarks.io) to learn more.
