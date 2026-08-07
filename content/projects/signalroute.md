---
title: "SignalRoute: The Phone System That Runs Itself"
url: "https://getsignalroute.com"
category: "Product"
flagship: true
featured: true
status: "In development"
tagline: "the phone that runs itself"
order: 2
date: 2026-06-01
excerpt: "A flagship I'm building: an AI-operated business phone system with a visual call-flow editor, trusted caller ID, and a developer API. Telephony that handles routing, transfers, and conferencing without a full-time receptionist."
problem: "Missed calls and clumsy phone trees cost service businesses jobs, and hiring a full time receptionist does not scale."
outcome: "AI-operated telephony that answers, routes, transfers, and summarizes, with a visual call-flow editor and a developer API."
metrics:
  - label: Mode
    value: "AI-operated"
  - label: Editor
    value: "Visual flows"
  - label: Audience
    value: "Dev + ops"
---

# SignalRoute: Rebuilding the Business Phone for an AI-First World

**SignalRoute** is a flagship product I am actively building. It is an AI-operated business phone system built around one promise. The phone should run itself. Calls get answered, routed, transferred, and summarized without a human babysitting a console, and everything a developer needs to build on top of it is exposed through a clean API.

---

## The Problem

Business telephony is stuck. The incumbents fall into two camps: legacy PBX systems that are powerful but require an expert to configure and a manual to operate, and consumer-grade VoIP apps that are easy but shallow. Neither one was built for a world where an AI can realistically handle the front line, answering and triaging and routing calls, and neither one treats the developer as a real user.

On top of that, the trust layer is broken. Outbound calls from small businesses increasingly get flagged as spam and silently dropped, and most phone platforms give owners no visibility or control over their own caller reputation.

SignalRoute is my answer: a phone system that's AI-operated by default, trustworthy on the wire, and programmable to the core.

---

## What SignalRoute Does

The product centers on **"Line"**, which is the operator surface where the phone system actually runs. It handles the full vocabulary of real call operations: inbound and outbound calls, warm and cold transfers, consult-then-conference, DTMF (in-call keypad), ring-out dialing, and voicemail. A dialer with full keyboard control makes it fast for power users, while the call-handling panel stays calm and legible under pressure.

**Visual call-flow editor.** Routing logic is built on a drag-and-drop canvas (powered by a node graph with automatic layout) rather than buried in nested menus. You can *see* how a call travels through ring groups, queues, routing rules, and fallbacks, and you can reshape it without a telecom degree.

**AI in the loop.** Calls and transcripts are summarized automatically using Anthropic's Claude, so the record of what happened is a human-readable summary, not a raw audio file nobody listens to. This is the foundation for the whole "runs itself" idea. The system understands calls, it does not just connect them.

**Messaging cockpit.** Alongside voice, SignalRoute includes an SMS surface with templates, scheduled sends, and built-in STOP/START compliance, which is the unglamorous but mandatory part of doing business texting correctly.

**Trust and reputation.** Spam-score tracking gives a business visibility into how carriers see its numbers, treating caller reputation as a managed asset instead of an invisible liability.

**A developer API.** A versioned REST surface (`/api/v1`) exposes placing calls, listing calls, and sending and receiving messages, so SignalRoute is something you can build *on* and not just something you log into.

---

## How It's Built

SignalRoute runs on **Next.js 16** and **React 19** with TypeScript, styled with **Tailwind CSS v4** on a token-driven design system (shadcn/ui + Base UI primitives, with a calm, centered look and a single accent, plus a denser dark "cockpit" mode for the messaging surface). Data and auth live on **Supabase** (Postgres, SSR-aware sessions).

The interesting architecture is in the telephony layer:

**Provider-agnostic adapter pattern.** Telephony is built around **Telnyx**, but behind an adapter interface with both a real implementation and a mock. In development the system runs entirely on the mock adapter, so the whole call experience can be built, tested, and demoed without burning live minutes. The same code path then swaps to real Telnyx with a key change.

**Webhook-driven core.** Inbound events (`call.*`, `message.received`, delivery receipts) flow through a single webhook endpoint that drives the system's state. The roadmap hardens this with Ed25519 signature verification against the provider's public key, moving from shared-secret to cryptographic webhook auth.

**Preference-aware routing.** After sign-in, users land on the surface they actually work in, with their landing preference stored server-side. It is a small thing, but it says what the whole product is going for. It adapts to the operator instead of the other way around.

---

## Status

SignalRoute is in active development and moving fast. Recent work has been on the call dialer and the operator experience with transfer, ring-out, conference, DTMF, and keyboard shortcuts, plus the visual call-flow editor and a redesign of the messaging cockpit. The two pieces of the project, the application and the `getsignalroute.com` site, are moving forward together.

It's not finished, and I'm not pretending it is. But the spine is real: live call operations, a working flow editor, AI summarization, and a provider abstraction ready for production telephony. SignalRoute is where I'm betting on what the business phone becomes when you assume an AI is sitting at the front desk.

Follow along at [getsignalroute.com](https://getsignalroute.com).
