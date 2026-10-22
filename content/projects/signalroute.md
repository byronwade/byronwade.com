---
title: "SignalRoute: The Phone System That Runs Itself"
url: "https://getsignalroute.com"
category: "Product"
flagship: false
featured: false
status: "Archived"
tagline: "screens for calls and texts"
order: 2
date: 2026-06-01
excerpt: "A private Next.js app for business calls and texts. The flow editor and dialer are real screens. On the commit reviewed here, calls and texts are stored rows, and the Telnyx adapter is not implemented."
problem: "The app is set up so a business can try calls and texts without a carrier account while the product is still being built."
outcome: "The screens are in the repository. Placing a call or sending a text writes a database row. It does not dial or deliver through Telnyx."
metrics:
  - label: Carrier
    value: "Mock"
  - label: Flows
    value: "This browser"
  - label: API
    value: "Writes rows"
---

# SignalRoute: The Phone System That Runs Itself

SignalRoute is a business phone and texting application. The marketing pages and the signed-in app are route groups in one private repository. This page was checked on October 21, 2026 against private main at `31d30be` (August 3, 2026). That commit message is "chore: trigger production redeploy". GitHub does not mark the repository archived, and main is the only branch. Archived on this page is this site's grouping.

The repository was created on June 3, 2026. This page's date stays June 1, 2026.

[getsignalroute.com](https://getsignalroute.com) returned HTTP 200 on October 21, 2026, with the title "SignalRoute - A business phone that runs itself". This review did not prove that host is serving commit `31d30be`.

## What the repository actually runs

The app is Next.js 16.2.6 and React 19.2.4, with TypeScript, Tailwind CSS 4, Base UI, and shadcn. Accounts and rows go through Supabase. After sign-in, the next page can be the one stored on the member as `preferences.landing_panel`. A demo session reports the save as successful and does not write the row.

A call-flow editor draws the route on a canvas. Node types include an incoming call, business hours, a menu, a ring group, a queue, a transfer, voicemail, and a spam check. Layout uses dagre. The graph is stored in the browser under `sr.callflow.<numberId>`. Nothing in this commit walks that graph when a call arrives.

The dialer accepts clicks and the physical keyboard. Blind transfer, warm transfer, conference, and ring-out are timers and labels in the page. A blind transfer waits 1.6 seconds, then drops the line and shows a toast. The DTMF handler is empty: the keypad gives press feedback and does not send a tone. Sending a line to voicemail removes it and shows a toast.

Texting can save a template, refuse a number that replied STOP, and park a message until a time you pick. When that time arrives, a database function marks the message delivered and updates the conversation preview. It does not hand the text to a carrier. The migration tries to run that function every minute with pg_cron, and it skips that schedule if the extension is missing.

SMS threads can be summarized. With `ANTHROPIC_API_KEY` set, that summary is a Claude request. Without the key, it is a sentence built from the last inbound text. A recording can store a transcript string. This commit does not summarize calls.

The spam-score page reads one reputation row per workspace. A new workspace is inserted with defaults, including a trust score of 80 and a delivery rate of 99.00. This commit never recomputes those figures from messages. The page is about the numbers on that row, not a carrier's caller-ID label.

## The API and the carrier

`/api/v1/calls` and `/api/v1/messages` accept a bearer key. Listing reads the org's rows. Creating a call inserts a completed call whose answer time and end time are the same moment. Creating a message inserts it as delivered, unless that recipient is on the suppression list. Neither function calls a telephone provider. The `say` argument on create-call is unused.

Inbound events can arrive at `/api/telnyx/webhook`. The handler accepts a Telnyx-shaped envelope for `message.*` and `call.*` when a shared secret matches. The check is HMAC-SHA256 over the raw body. A header named `telnyx-signature-ed25519` is read and checked as that same HMAC. The route does not verify an Ed25519 signature. STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, and QUIT add the sender to the suppression list. START, UNSTOP, and YES remove them.

Telephony is one interface: search, buy, and release numbers, send a message, place a call, and look up a number. The default is an in-memory adapter that invents US numbers and returns a fake reference. `TELECOM_PROVIDER=telnyx` builds a second class whose methods throw "not implemented". Changing the key does not turn Telnyx on.

The in-app place-call action refuses to run unless the workspace billing status is `active`. When it runs, it calls the adapter above and then stores a completed call with a duration of zero.

## What this review did not do

I read the source. I did not build SignalRoute, run its tests, sign in, or place a call. I did not open a carrier account. That does not establish that a paid workspace can dial a real number, or that a live Telnyx webhook is accepted in production.

The file-by-file notes are in `docs/PROJECT_SOURCES.md` in this site's repository.
