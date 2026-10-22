---
title: "Stream: Live Built for Belonging, Not Virality"
url: "https://stream.byronwade.com"
category: "Concept"
tagline: "live, built for belonging"
date: 2026-06-01
excerpt: "A live-streaming platform I prototyped around a contrarian thesis: find streams by mood and fit instead of raw viewer counts, with features like Catch Me Up and Join Late that the incumbents have no reason to build. Frontend only, on seeded data."
status: "Archived"
featured: false
---

# Stream: What If Live Optimized for Belonging Instead of Virality?

**Stream** is a frontend design concept I built out end to end. It is a live-streaming platform designed around a different goal than Twitch or YouTube Live. Those platforms optimize for engagement and peak viewers, which rewards spectacle and punishes small, healthy communities. Stream asks the opposite question: what would a live platform look like if it optimized for *fit* and *belonging*?

---

## The Thesis

The dominant streaming platforms run a winner-take-all algorithm. Rank by concurrent viewers, surface what's already huge, and the rich get richer while a great 30-person community stays invisible. The incentives push creators toward sensationalism and leave newcomers feeling like they walked into a stadium mid-game with no idea what's happening.

Stream is built on three principles that fall out of rejecting that:

**Discovery fit over popularity.** Streams are organized by *mood* (chill, learn, laugh, competitive, small communities, creative, background, and deep focus) instead of only by category. You find something that fits your current headspace. The goal is discovery that lifts small communities and rewards rooms that welcome new viewers, not just big ones.

**Context for people with lives.** Real viewers don't arrive at minute zero. **Catch Me Up** gives late arrivals a headline, the current topic, a summary, and timeline moments so they can orient in seconds. **Join Late** turns "I missed the start" from a barrier into a one-tap action.

**Community health as a first-class metric.** A stream shouldn't be judged on peak viewers alone. Chat health, how often the creator responds, and how friendly the room is to newcomers should count too. The platform should measure belonging, not just attention.

---

## What's Built

Stream is a full product surface, not a landing page with three screenshots. It has 33 page templates:

- **Discovery and watch.** A mood-driven home, a discover page you can filter by mood and audience size, the watch page with a player and live chat, creator channels, and category browsing.
- **Structured chat.** Four tabs (live, questions, polls, and highlights) instead of one undifferentiated firehose. Pinned messages are marked and deleted ones drop out.
- **Catch Me Up and Join Late.** Once a live stream is more than 45 seconds old, a Join Late prompt opens the Catch Me Up panel with its headline, topic, summary, and the moments you missed.
- **"Bloom" panels.** Overlays on the watch page (catch-up, clip, report, creator profile, discovery preferences, analytics, subscribe, predictions, and channel points) live in the URL as `?panel=`, so each one can be linked and the back button closes it. They animate open with Motion, respect reduced motion, and keep keyboard focus inside the panel.
- **Clips and replays.** Create a clip from a stream, browse clips, and jump around a replay using its chapter list.
- **A creator studio.** Go-live setup, stream manager, analytics with a retention curve, clip management, community and moderation queues, alert-box settings, and a restream page. The money and restreaming screens are labeled as mock data.
- **Engagement systems.** Subscription tiers, channel points, predictions, and rewards, all on seeded data.

The thesis is in the data, but the ranking isn't finished. Each seeded stream carries a chat health score, a creator response rate, a new-viewer score, a small-community boost, and a fit score with a one-line reason. The discover page sorts by that precomputed fit score and shows the reason on each card. The watch page shows chat health, and the "rising creators" rail sorts by how often creators answer new viewers. Nothing yet combines those signals into a ranking. A real formula is the next step, and this prototype is how I'd test whether it feels right.

---

## How It's Built

Stream is built with **Next.js 16** and **React 19** as a **statically exported** site. It's styled with **Tailwind CSS v4** on a semantic-token design system with its own hand-built components, and it uses Motion for the panel transitions. It has real engineering hygiene around it: Vitest unit tests, Playwright end-to-end, accessibility, and visual tests, and Storybook stories for the main components.

The defining constraint: **it's a front-end-only build.** There is no real ingest and no live backend. State lives in `localStorage` via `useSyncExternalStore`, and the world is seeded from static JSON (streams, creators, clips, chat personas, polls, predictions, rewards, analytics). The screens a real platform needs are there and you can click through them. What's deliberately absent is the broadcast infrastructure, real accounts, and real money.

I built it this way because the thesis is a *product* argument, not an infrastructure one. To know whether discovery by mood and fit and "Catch Me Up" actually feel better, you have to build the whole experience and live in it. That is exactly what a complete, seed-driven prototype lets me do before committing to the hard, expensive real-time stack. I built it in June 2026, and it's the most opinionated thing in my portfolio.

Try it at [stream.byronwade.com](https://stream.byronwade.com), or read the [source on GitHub](https://github.com/byronwade/stream.byronwade.com).
