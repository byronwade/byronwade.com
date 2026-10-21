---
title: "Fakebase: A Supabase You Can Throw Away"
url: "https://fakebase.byronwade.com"
category: "Product"
status: "Archived"
tagline: "a Supabase you throw away"
date: 2026-05-30
excerpt: "An MIT-licensed local development backend with a Supabase-shaped query API, SQL and type exports, and compatibility gaps to check before moving a prototype to real Supabase."
featured: false
---

# Fakebase: A Local Backend for Prototypes

I built **Fakebase** to prototype against a familiar query API without starting a database stack. It is an MIT-licensed tool for local development: `createClient`, `from().select()`, auth and storage flows backed by a Node.js kernel. The memory adapter needs no running Postgres server or Docker.

The aim is to carry schema, data and types into a real Supabase project when the prototype is ready. The API shape is familiar, but the implementation is partial. Switching imports alone does not establish production compatibility.

This account describes the June 2026 public source, reviewed in October 2026. Fakebase's auth and policy checks are development approximations, not a production security boundary.

---

## The Problem

When I prototype against a local Supabase stack, I have to start Docker, manage migrations and seeds, and keep the services running before I can work on the feature. For a quick Next.js experiment, I wanted a smaller starting point.

Hand-written mocks solve the immediate problem, but their interfaces can drift from the backend the application will eventually use. Fakebase is my attempt to keep the query shape and schema work useful beyond the prototype.

It trades service setup for local approximations. Those limits need to stay visible.

---

## What Fakebase Does

The in-process client implements part of the Supabase API:

- **Database.** CRUD, filtering, ordering and pagination through a chainable query builder. The kernel has a registry for local JavaScript functions, but `createClient()` does not expose `rpc()`.
- **Auth.** Password and OTP flows, local sessions and basic user administration. OTPs go to a local inbox, not email or SMS; session tokens are local identifiers, not signed production JWTs.
- **Storage.** Buckets, upload, download and listing backed by local files. Signed URLs use locally verified tokens, not a hosted storage service.
- **Realtime.** Mutation events come from the kernel. Client broadcast calls listeners on the same channel object; presence callbacks can be registered, but that client has no `track()`, `untrack()` or `presenceState()` methods. A separate realtime package contains presence logic; it is not exposed through this client.
- **Migrations & types.** Schema diffs can generate SQL. `fakebase migrate export --supabase` copies authored SQL files into `supabase/migrations/`; separate commands export `seed.sql` and generate `database.types.ts`. PGLite has no snapshot export for the seed command, and type generation falls back to example types when no schema is loaded. These are migration inputs to review and test, not a completed production migration.

The capability registry records supported, partial, stub and unsupported features. Error handling depends on the entry point: unsupported auth methods such as OAuth, SSO, MFA and passkeys return a `CapabilityError` in the result's `error` field; registry assertions throw. Vector search and point-in-time recovery are not implemented production services. A capability label is a description of the local implementation, not proof of Supabase parity.

For AI-assisted work, `fakebase ai init` writes starter rules and documentation templates. Its schema summary contains an example `profiles` table; the command does not inspect the project's schema to generate that summary. The AI package also has schema-aware generators, but this command does not call them.

---

## How It's Built

Fakebase is a TypeScript workspace using pnpm, Node 20+ and ES modules. It separates the kernel, client, adapters, auth, storage, realtime, functions, migrations, type generation, CLI and AI tooling. The root also contains the Next.js documentation site and playground. Turborepo configuration and a separate apps workspace described in the README are absent from the reviewed main branch.

The adapters offer different persistence models:

- **In-memory.** Rows held in maps for disposable test data and experiments. The attached file-storage service still writes uploaded objects to disk.
- **JSON file-backed.** Local snapshots for persistence between runs.
- **SQLite.** Database persistence through `better-sqlite3`.
- **PGLite.** A real Postgres-in-WebAssembly engine through `@electric-sql/pglite`, with some filters and defaults still evaluated in JavaScript. Generated tables omit foreign-key constraints, and policies use the shared JavaScript engine rather than Postgres roles.

Underneath sits a schema representation, query handling and the shared policy engine. The in-process kernel uses Node APIs and belongs on the server; browser writes need an application endpoint. The repository also has a separate local HTTP/WebSocket server for real Supabase clients, so not every usage mode is entirely in-process.

---

## Why It's a Flagship, and Why It's Free

Fakebase is work I chose to make available under MIT because I wanted a reusable starting point for experiments. Designing a backend to be replaced gives it a useful constraint: the export path matters as much as the local API.

The repository contains Vitest and Playwright tests. Its initial monorepo also had CI and Changesets release workflows, but those workflows are absent from the reviewed main branch. Test files alone do not establish a passing release or production compatibility. The `verify supabase` harness covers twelve database-query scenarios; without a real Supabase connection it reports partial results, and partial comparisons do not make the command fail. It does not certify auth, storage, realtime or the exported migration.

Before moving a prototype, the remaining work is to apply and test the exports against real Supabase and check the application's actual queries, auth and access policies. I have not measured a speed advantage or verified a production migration for this write-up.

The source is on [GitHub](https://github.com/byronwade/fakebase.byronwade.com). This review follows [main at `2f60fe6`](https://github.com/byronwade/fakebase.byronwade.com/tree/2f60fe695ca0cac03e18f954a231ca446fb3479c); the supporting file references are in the [project source notes](https://github.com/byronwade/byronwade.com/blob/main/docs/PROJECT_SOURCES.md#fakebase-api-and-export-claims-october-21-2026).
