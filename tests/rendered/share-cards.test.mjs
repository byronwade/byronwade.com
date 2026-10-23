import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { sfntCodePoints } from "../fixtures/sfnt.mjs";

// Every prerendered page names a share card. The card route fails the request
// when its fonts are missing (a deploy that does not trace assets/og), so a
// served 1200x630 PNG for every page proves the cards render as designed.
const APP = new URL("../../.next/server/app/", import.meta.url);
const FONTS = new URL("../../assets/og/", import.meta.url);
const GLOBAL_ERROR = "/_global-error";
const OG_IMAGE = /<meta property="og:image" content="([^"]+)"/;
const TWITTER_IMAGE = /<meta name="twitter:image" content="([^"]+)"/;
const CARD_PARAMETERS = new Set(["title", "description", "type", "date"]);
const PNG_SIGNATURE = "89504e470d0a1a0a";
const WHITESPACE = /\s/;

function decode(value) {
	// &amp; last, so an escaped entity such as &amp;quot; is not decoded twice.
	return value.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
}

function prerenderedCards() {
	const manifest = JSON.parse(
		readFileSync(new URL("../../.next/prerender-manifest.json", import.meta.url), "utf8")
	);
	const cards = [];
	for (const route of Object.keys(manifest.routes)) {
		const file = new URL(route === "/" ? "index.html" : `.${route}.html`, APP);
		if (route === GLOBAL_ERROR || !existsSync(file)) {
			continue;
		}
		const html = readFileSync(file, "utf8");
		const og = html.match(OG_IMAGE)?.[1];
		const twitter = html.match(TWITTER_IMAGE)?.[1];
		cards.push({ route, og: og && decode(og), twitter: twitter && decode(twitter) });
	}
	return cards;
}

/** Why the share card URL a page names would not draw as designed. */
function cardProblems(og, fonts) {
	if (!og) {
		return ["no og:image"];
	}
	const url = new URL(og);
	const found = [];
	if (url.pathname !== "/api/og") {
		found.push(`og:image is ${url.pathname}`);
	}
	const extra = [...url.searchParams.keys()].filter((key) => !CARD_PARAMETERS.has(key));
	if (extra.length > 0) {
		found.push(`ignored parameters ${extra.join(", ")}`);
	}
	const text = [...url.searchParams.values()].join("");
	const missing = [...new Set(text)].filter(
		(character) =>
			!WHITESPACE.test(character) && fonts.some((font) => !font.has(character.codePointAt(0)))
	);
	if (missing.length > 0) {
		found.push(`no glyph for ${missing.join("")}`);
	}
	return found;
}

test("every prerendered page names one share card the route draws", () => {
	const cards = prerenderedCards();
	assert.ok(cards.length > 30, "Run npm run build before checking share cards");
	const fonts = readdirSync(FONTS).map((file) =>
		sfntCodePoints(readFileSync(new URL(file, FONTS)))
	);
	const problems = {};
	for (const { route, og, twitter } of cards) {
		const found = cardProblems(og, fonts);
		if (twitter !== og) {
			found.push(`twitter:image ${twitter} differs`);
		}
		if (found.length > 0) {
			problems[route] = found;
		}
	}
	assert.deepEqual(problems, {});
});

async function servedCard(origin, card) {
	const { pathname, search } = new URL(card);
	const response = await fetch(`${origin}${pathname}${search}`, {
		signal: AbortSignal.timeout(30_000),
	});
	const body = Buffer.from(await response.arrayBuffer());
	const type = response.headers.get("content-type");
	const isPng = body.subarray(0, 8).toString("hex") === PNG_SIGNATURE;
	const size = isPng ? `${body.readUInt32BE(16)}x${body.readUInt32BE(20)}` : "not a PNG";
	return response.status === 200 && type === "image/png" && size === "1200x630"
		? null
		: `${response.status} ${type} ${size}`;
}

test("every share card is served as a 1200x630 PNG", { timeout: 180_000 }, async () => {
	const urls = [
		...new Set(
			prerenderedCards()
				.map(({ og }) => og)
				.filter(Boolean)
		),
	];
	assert.ok(urls.length > 30, "Run npm run build before checking share cards");
	const failures = await withProductionServer(async (origin) => {
		const results = await Promise.all(
			urls.map(async (card) => [card, await servedCard(origin, card)])
		);
		return Object.fromEntries(results.filter(([, problem]) => problem));
	});
	assert.deepEqual(failures, {});
});
