/**
 * Canonical origin for this site, and the single source of truth for it.
 *
 * Every canonical URL, feed link, sitemap entry, and OG image URL derives from
 * this value. Import it instead of reading `NEXT_PUBLIC_BASE_URL` directly, so
 * the production fallback is defined in exactly one place.
 *
 * Production serves www: https://byronwade.com answers with a permanent redirect
 * to https://www.byronwade.com, so an apex address would name a redirect.
 * `public/robots.txt` repeats this origin for its sitemap line.
 */
export const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.byronwade.com";

/** Byron's public X account. Cards, share links, and the footer all use this. */
export const xHandle = "byron_c_wade";
const xUrl = "https://x.com/byron_c_wade";

/**
 * Profiles verified to belong to this Byron Wade.
 * LinkedIn is omitted on purpose. The vanity path that matches this domain
 * belongs to a different person, a healthcare recruiter in Pittsburgh.
 * Add a profile only after Byron confirms the URL.
 */
export const publicProfiles = [
	{ name: "GitHub", href: "https://github.com/byronwade" },
	{ name: "X", href: xUrl },
] as const;
