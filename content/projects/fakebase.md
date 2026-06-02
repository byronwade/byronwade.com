---
title: "Fakebase: A Supabase You Can Throw Away"
url: "https://fakebase.byronwade.com"
category: "Product"
status: "Open source"
tagline: "a Supabase you throw away"
date: 2026-05-30
excerpt: "My open-source flagship, maintained for free: a Supabase-shaped backend that runs entirely in-process with zero setup, so you can prototype at production-API speed and export to a real Supabase project when you're ready."
---

# Fakebase: Prototype at Production Speed, Without the Setup Tax

**Fakebase** is the project I maintain for free because I think it should exist. It's an open-source (MIT) development platform that mimics Supabase's developer API — `createClient`, `from().select()`, auth, storage, realtime, `rpc` — but runs entirely in-process with no Docker, no Postgres, and no setup. You write code against the API you'd use in production, and when the prototype graduates, you export to a real Supabase project.

---

## The Problem

Supabase is excellent in production. But the moment you want to *prototype* something against it, you hit the setup tax: spin up Docker, run a local Postgres stack, manage migrations and seeds, keep the whole apparatus alive — all before you've written a line of the feature you actually care about. For a quick Next.js MVP or a throwaway experiment, that overhead is wildly out of proportion to the goal.

So people cut corners. They mock the database with hand-rolled stubs that don't match the real API, then have to rewrite everything when it's time to ship. The prototype teaches you nothing transferable, and the "port to real Supabase" step is a rewrite instead of a migration.

Fakebase removes that tax without lying to you about what it is.

---

## What Fakebase Does

Fakebase gives you a **Supabase-compatible client** that just works, instantly, in memory:

- **Database** — CRUD, filters, and RPC through the same query builder shape you already know.
- **Auth** — password and OTP flows, sessions, and the basics of admin user management.
- **Storage** — buckets, upload and list, signed URLs.
- **Realtime** — broadcast, Postgres-change streams, and presence.
- **Migrations & types** — author SQL migrations and generate TypeScript types, with a first-class **export path** that emits Supabase-compatible `migrations/*.sql`, `seed.sql`, and `database.types.ts`.

Crucially, Fakebase is **honest about its limits.** Features it doesn't faithfully reproduce — OAuth, SSO, MFA, passkeys, vector search, point-in-time recovery — don't fail silently or pretend to work. They throw a structured `CapabilityError`. The whole philosophy is *no silent faking*: you always know exactly how close to production you are.

It's also **AI-first**: a `fakebase ai init` command generates rules and schema scaffolding, so the tool fits naturally into agent-driven and LLM-assisted workflows.

---

## How It's Built

Fakebase is a TypeScript **monorepo** (pnpm + Turborepo, Node 20+, ES modules) with around eighteen packages — a core kernel, storage adapters, and per-domain packages for auth, storage, realtime, functions, migrations, types, a CLI, and the AI tooling — plus the marketing/docs site and an admin UI.

The most interesting design decision is the **tiered storage adapters**, which let you dial fidelity up or down to match the job:

- **In-memory** — zero setup, instant, perfect for tests and quick spikes.
- **JSON file-backed** — durable snapshots you can inspect and commit.
- **SQLite** — a single durable file for longer-lived local work.
- **PGLite (Postgres-in-WASM)** — the highest-fidelity tier, running real Postgres semantics in WebAssembly.

Underneath sits a query compiler, a schema intermediate representation, and a policy engine that approximates Row-Level Security in JavaScript. Because the kernel uses Node's `fs`, `path`, and `crypto`, Fakebase runs on the server — it's a development backend, explicitly *not* a security boundary, and the docs say so plainly.

---

## Why It's a Flagship — and Why It's Free

Fakebase is the kind of project that earns trust precisely because of what it *refuses* to do. It doesn't try to replace Supabase; it's designed to be thrown away, with the export path as a short, documented, first-class step. That constraint-awareness — being honest about scope, labeling unsupported capabilities instead of faking them, and optimizing for "delete me later" — is the engineering value I most want my work to represent.

I maintain it for free under MIT because tooling that lowers the activation energy for building should be a commons, not a product. It's built with the same seriousness I'd give anything commercial — Turborepo, Changesets-driven releases, Vitest and Playwright coverage, CI — just pointed at developers instead of customers.

Explore it at [fakebase.byronwade.com](https://fakebase.byronwade.com) or on [GitHub](https://github.com/byronwade/fakebase).
