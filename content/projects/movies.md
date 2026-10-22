---
title: "Movies"
category: "Hobby"
featured: true
status: "Active"
tagline: "movie discovery"
order: 4
excerpt: "A movie discovery project built with React and TanStack Start, with a discovery feed at its home route."
# TODO(Byron): Confirm the preferred public URL, release state, dates, and any measured outcomes. The repository homepage lists a Vercel preview; no launch is asserted here.
---

# Movies

## Movie discovery

Movies is a movie picker that learns from what you tell it. The home route opens a feed that shows one film at a time inside an app shell. Every button you press on a film becomes a signal for the ranking.

You can read all of it in the [Movies repository](https://github.com/byronwade/movies.byronwade.com). The project began in Grok's app builder, and the public repository holds that export, last updated on September 14, 2026. Everything below describes commit [`6dbc3fc`](https://github.com/byronwade/movies.byronwade.com/tree/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3).

## How the feed learns

Each film card has six [actions](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/components/movie/actions.tsx): Seen, Favorite, Save, Interested, Skip, and Not into. Every press is stored as an event, and an undo cancels that event without deleting the history.

- **A taste profile built from your marks.** Each action has its own [weight](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/taste.ts#L7-L26). Favorite counts most, and Not into is the strongest negative. Marks also fade with age: positive ones lose half their weight in 160 days and negative ones in 80. The profile adds up the [features](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/features.ts#L7-L26) of every film you marked: director, genres, themes, tones, moods, writers, the first four cast members, decade, and language. Each candidate is then compared to the profile with cosine similarity.
- **Taste takes over gradually.** Until about ten films carry a clear signal, critic scores, popularity, and release year do most of the work. Your profile [gains weight](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L512-L514) with each one.
- **Neighbors of films you love.** Your twelve strongest marks act as seeds. A film that shares a director, leading cast, themes, or a similar-titles entry with a seed gets a [boost](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L277-L301), and its card names the seed: "Because you keep … close."
- **Not into means it.** The film disappears, the rest of its series stays out, and the films listed as similar to it are [pushed down](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L458-L470).
- **A mixer for the first screens.** Without a genre, mood, or service filter, the first eight picks are spread out: at most two per lead genre and one per director. Interested titles come back after the first few picks, never in the first slot. One wildcard is pulled from deeper in the list ([mixer](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L348-L406)).
- **Tonight's sitting.** The feed filter sets who is watching (solo, partner, family, or friends), mood, genre, era, a streaming service, and new releases. Family viewing [drops R-rated and adult titles](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/pipeline.ts#L178-L219). A bedtime clock assumes 11:10 PM and [favors films that end in time](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/clock.ts).
- **Grok as a second opinion.** After you have marked at least three films, the app can send the next twenty candidates to Grok. Grok returns a new order and a one-line reason that cites something you liked or passed on ([request](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/server/grok-taste.ts), [reorder](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/store.ts#L1041-L1108)). It runs only when the server has an xAI key. If the call fails, the local ranking stays as it was.
- **Fine tune.** A second feed at `/tune` asks about well-known films you may already have seen, so the profile learns faster.

## Households and sharing

The app starts with three household profiles: You, Partner, and Kids. You can bring in history by [Letterboxd username](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/server/import.ts), which reads the public diary, watchlist, and likes feeds, or by pasting a list of titles. During an import, a sheet can ask which profile watched each title that is not for adults only. Signed-in members can claim a public page at `/@handle`. A combined page for two handles, "Tonight for both," [merges](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/tasterank/collide.ts#L35-L62) both people's favorites and both people's vetoes into twelve picks.

## Where the films come from

The catalog has 2,869 films after duplicates are merged. Most of them, 280 per decade from the 1930s through the 2020s, are [generated](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-catalog.mjs#L421-L422) from a public Wikipedia movie dataset. A smaller hand-written set adds well-known films and 2024 to 2026 releases. 722 films carry critic or audience scores from Rotten Tomatoes, Metacritic, or IMDb, taken from [Wikidata](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-ratings.mjs#L55-L56) or typed in for recent releases. A film's page pulls its summary, images, and trailer from Wikipedia, Wikidata, Apple's iTunes search, and Grokipedia when it opens.

The generated entries are rough, and the source says so. Their [quality and popularity numbers](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-catalog.mjs#L243-L259) are estimated from the length of the Wikipedia text and the size of the cast. Their [age rating](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-catalog.mjs#L441) and their themes, tones, and moods are guessed from genre. Streaming labels exist only on the 98 hand-written films that list one, and they were not checked against a live availability service. Every generated film [shows Rent](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/scripts/build-catalog.mjs#L471).

## Implementation

The [package manifest](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/package.json) lists React 19, TypeScript, TanStack Start and Router, Vite, Tailwind CSS 4, and Zustand. A guest's marks stay in the browser's local storage. Signed-in accounts use Better Auth, and their events and settings [sync to Postgres](https://github.com/byronwade/movies.byronwade.com/blob/6dbc3fcba1ddbce51df5baff90f2e3b98e590ee3/src/lib/server/sync.ts#L491-L494) on Neon. Outside Grok's preview, email and password is the only sign-in; the Google and X buttons are hidden. Node test suites cover the ranking, search, title matching, and the sign-in gate.

## Where it stands

I kept building Movies in a private repository after this export, so the live site follows newer work than the code linked here and will not match this page exactly. I'll add a fuller account of the experience as the project develops.
