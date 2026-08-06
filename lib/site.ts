/**
 * Canonical origin for this site, and the single source of truth for it.
 *
 * Every canonical URL, feed link, sitemap entry, and OG image URL derives from
 * this value. Import it instead of reading `NEXT_PUBLIC_BASE_URL` directly, so
 * the production fallback is defined in exactly one place.
 */
export const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
