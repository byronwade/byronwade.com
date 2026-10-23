import assert from "node:assert/strict";

// How crawlers read robots.txt (RFC 9309, which Google and Bing follow): a crawler
// obeys only the group that names it, falling back to `*`; within that group the
// longest matching path wins, and Allow wins a tie.

const SEARCH_ENGINES = ["Googlebot", "Bingbot", "Slurp", "YandexBot", "DuckDuckBot"];
const SHARE_PREVIEWS = ["Twitterbot", "facebookexternalhit", "LinkedInBot", "Slackbot"];
const TURNED_AWAY = [
	"SemrushBot",
	"AhrefsBot",
	"MJ12bot",
	"DotBot",
	"BLEXBot",
	"DataForSeoBot",
	"PetalBot",
];

const PAGES = ["/", "/blog/building-thorbis", "/projects/thorbis", "/resume", "/sitemap.xml"];
const SHARE_CARD = "/api/og?title=Byron%20Wade&type=website";
const LINE_BREAK = /\r?\n/;
const COMMENT = /#.*/;
const REGEX_SPECIAL = /[.+?^${}()|[\]\\]/g;

const SERVER_WORK = [
	"/api/resume-pdf",
	"/api/screenshot?url=https%3A%2F%2Fthorbis.com%2F",
	"/api/screenshot/image?url=https%3A%2F%2Fthorbis.com%2F",
	"/api/portfolio",
	"/api/github/stats",
];

/** Groups from robots.txt text: consecutive User-agent lines share the rules below them. */
export function parseRobots(text) {
	const groups = [];
	const sitemaps = [];
	let current = null;
	let collectingAgents = false;
	for (const raw of text.split(LINE_BREAK)) {
		const line = raw.replace(COMMENT, "").trim();
		const separator = line.indexOf(":");
		if (separator === -1) {
			continue;
		}
		const key = line.slice(0, separator).trim().toLowerCase();
		const value = line.slice(separator + 1).trim();
		if (key === "user-agent") {
			if (!collectingAgents) {
				current = { agents: [], allow: [], disallow: [] };
				groups.push(current);
				collectingAgents = true;
			}
			current.agents.push(value);
		} else if (key === "sitemap") {
			sitemaps.push(value);
		} else {
			collectingAgents = false;
			if ((key === "allow" || key === "disallow") && current && value) {
				current[key].push(value);
			}
		}
	}
	return { groups, sitemaps };
}

/** Groups from the object `app/robots.ts` returns. */
export function groupsFromRules(rules) {
	const list = (value) => (value === undefined ? [] : [value].flat());
	return [rules].flat().map((rule) => ({
		agents: list(rule.userAgent ?? "*"),
		allow: list(rule.allow),
		disallow: list(rule.disallow),
	}));
}

function matchLength(pattern, path) {
	const anchored = pattern.endsWith("$");
	const body = (anchored ? pattern.slice(0, -1) : pattern)
		.split("*")
		.map((part) => part.replace(REGEX_SPECIAL, "\\$&"))
		.join(".*");
	return new RegExp(`^${body}${anchored ? "$" : ""}`).test(path) ? pattern.length : -1;
}

/** Whether `agent` may fetch `path` under `groups`. */
export function isAllowed(groups, agent, path) {
	const named = groups.filter(({ agents }) =>
		agents.some((name) => name.toLowerCase() === agent.toLowerCase())
	);
	const applicable = named.length > 0 ? named : groups.filter(({ agents }) => agents.includes("*"));
	let best = { length: -1, allow: true };
	for (const { allow, disallow } of applicable) {
		for (const [patterns, verdict] of [
			[allow, true],
			[disallow, false],
		]) {
			for (const pattern of patterns) {
				const length = matchLength(pattern, path);
				if (length > best.length || (length === best.length && verdict)) {
					best = { length, allow: verdict };
				}
			}
		}
	}
	return best.allow;
}

/**
 * The site's crawler policy: search engines and share-preview bots read every
 * page and every share card, nobody crawls the server-work API routes, and the
 * SEO scrapers are turned away from everything.
 */
export function assertCrawlerPolicy(groups) {
	const wrong = [];
	const expect = (agent, path, allowed) => {
		if (isAllowed(groups, agent, path) !== allowed) {
			wrong.push(`${agent} ${allowed ? "should" : "should not"} fetch ${path}`);
		}
	};
	for (const agent of [...SEARCH_ENGINES, ...SHARE_PREVIEWS, "SomeNewCrawler"]) {
		for (const path of [...PAGES, SHARE_CARD]) {
			expect(agent, path, true);
		}
		for (const path of SERVER_WORK) {
			expect(agent, path, false);
		}
	}
	for (const agent of TURNED_AWAY) {
		for (const path of [...PAGES, SHARE_CARD, ...SERVER_WORK]) {
			expect(agent, path, false);
		}
	}
	assert.deepEqual(wrong, []);
}
