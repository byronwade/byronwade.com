# Shop preview

`/shop` is deliberately unlinked from navigation, search, and the sitemap. All
three shop routes are `noindex`. Products, prices, currency, and the exact visible
placeholder label live in `lib/shop/products.ts`. Nothing is delivered.

The page and server action read `STRIPE_SECRET_KEY` only on the server. Missing,
empty, live, restricted, and malformed keys fail closed with “Shop coming soon”.
Only a nonempty `sk_test_` credential can reach Stripe. The response must also have
`livemode: false`, a `cs_test_` ID, and a URL on `https://checkout.stripe.com`.

## Local test

1. Use Node 24 and run `npm ci`.
2. Without a Stripe key, run `npm run build` and `npm run dev -- --port 3100`.
   `/shop` must show “Shop coming soon”, all three placeholders, and no checkout
   buttons. No Stripe call is made during build or page rendering.
3. Put your **test** key in ignored `.env.local` as `STRIPE_SECRET_KEY`. Restart
   the local server. Do not put a credential in source, command arguments, logs,
   screenshots, or the PR.
4. Open `/shop`, tab to “Try test checkout”, and press Enter. The server action
   creates a hosted Checkout Session with inline `price_data`, quantity 1, and
   the price from the local catalog. It never calls the Products or Prices APIs.
   Stripe may create test catalog records internally from inline product data;
   no live Stripe product or payment is created.
5. Confirm Stripe displays test mode and the placeholder label. Use Stripe’s
   [test payment details](https://docs.stripe.com/testing#cards) (for example,
   `4242 4242 4242 4242`, future expiry, any test CVC). Do not use real card details.
6. Complete the test and check `/shop/success`; use Checkout’s back control to
   check `/shop/cancel`. Both offer a visible link back. The success route never
   verifies or fulfills an order; opening it directly cannot prove payment.
7. Temporarily use the literal invalid fixture value `sk_live_fixture` locally
   and restart. Verify coming-soon UI and no checkout action. Remove the fixture.
   `npm test` also checks that the live-key guard makes zero network calls.

## Boundaries

- Server actions provide Next.js origin checks. Return URLs use that same
  request origin, with the canonical site URL as a non-browser fallback.
- No client supplies price, currency, quantity, or a return URL. Product IDs are
  checked against the catalog even when action arguments are forged.
- Each rendered product form has an idempotency token. Pending submission disables
  the native submit control, keeps its label/width, announces progress, and shows
  the canonical spinner. Failures are announced and focused inline for retry.
- Session creation is a mutation with `no-store`, a 10-second timeout, and no
  automatic retry. It must never use the external-read cache.
- No webhook, fulfillment, order storage, live-mode path, browser Stripe SDK, or
  remote environment configuration is included.
- Integration follows the [Checkout Session API](https://docs.stripe.com/api/checkout/sessions/create)
  and pins the [current API version](https://docs.stripe.com/api/versioning),
  `2026-09-30.endive`, verified October 15, 2026.
