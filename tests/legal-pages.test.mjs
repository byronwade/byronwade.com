import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { CONTACT_TOPICS, validateContactSubmission } from "../lib/contact-form.ts";

/**
 * The privacy and terms pages make factual claims about what this site does.
 * These checks tie those claims to the code so a new form field, analytics
 * event or data-sending service cannot ship while the policy says otherwise.
 */

const WHITESPACE = /\s+/g;
const EVENT_UNION = /type AnalyticsEvent =([\s\S]*?);\n/;
const EVENT_NAME = /name: "(\w+)"/g;
const RESUME_LICENSE_STATE = /License \((\w{2})\)/g;
const LICENSING_SENTENCE = /[^.]*licensing[^.]*\./;
const LAST_UPDATED = /const LAST_UPDATED = "([^"]+)";/;
const LEGAL_PAGES = ["app/privacy/page.tsx", "app/terms/page.tsx"];

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
/** JSX wraps prose across lines; compare it as one line of text. */
const prose = (source) => source.replace(WHITESPACE, " ");

/** How the privacy page names each submitted contact field. */
const FIELD_WORDING = {
	name: "your name",
	email: "email address",
	topicLabel: "topic",
	message: "your message",
};

/** Fields the contact form does not collect but the policy once claimed. */
const UNCOLLECTED_WORDING = [/phone/i, /quote form/i];

/**
 * Runtime dependencies that send visitor data off the site, and the name the
 * privacy page must use for each. A dependency that matches the pattern below
 * without an entry here fails, so adding one forces a policy update.
 */
const DATA_PROCESSORS = {
	"@vercel/analytics": "Vercel Web Analytics",
	"@vercel/speed-insights": "Vercel Speed Insights",
	resend: "Resend",
};
const DATA_SENDING_DEPENDENCY =
	/analytics|insights|resend|sendgrid|mailgun|postmark|nodemailer|sentry|posthog|plausible|mixpanel|segment|hotjar|gtag|datadog|logrocket/i;

/** How the privacy page describes each custom analytics event. */
const EVENT_WORDING = {
	project_view: "viewing a project",
	blog_post_view: "or post",
	resume_download: "downloading the résumé",
};

const STATE_NAMES = { CA: "California", GA: "Georgia" };

test("the privacy page lists exactly the fields the contact form collects", async () => {
	const privacy = prose(await readSource("app/privacy/page.tsx"));
	const submission = validateContactSubmission({
		name: "Ada Lovelace",
		email: "ada@example.com",
		topic: CONTACT_TOPICS[0].value,
		message: "Hello",
	});
	assert.equal(submission.success, true);

	for (const field of Object.keys(submission.data)) {
		const wording = FIELD_WORDING[field];
		assert.ok(wording, `contact field "${field}" has no privacy wording; describe it on /privacy`);
		assert.ok(privacy.includes(wording), `/privacy must mention "${wording}"`);
	}
	for (const pattern of UNCOLLECTED_WORDING) {
		assert.doesNotMatch(
			privacy,
			pattern,
			"/privacy claims a field the contact form never collects"
		);
	}
});

test("the privacy page names every service that receives visitor data", async () => {
	const privacy = prose(await readSource("app/privacy/page.tsx"));
	const { dependencies } = JSON.parse(await readSource("package.json"));

	const dataSending = Object.keys(dependencies).filter((name) =>
		DATA_SENDING_DEPENDENCY.test(name)
	);
	assert.ok(dataSending.includes("resend"), "detector must see the known email dependency");

	for (const dependency of dataSending) {
		const service = DATA_PROCESSORS[dependency];
		assert.ok(service, `${dependency} may send visitor data; name it on /privacy`);
		assert.ok(privacy.includes(service), `/privacy must name ${service}`);
	}
});

test("the privacy page describes every custom analytics event", async () => {
	const privacy = prose(await readSource("app/privacy/page.tsx"));
	const analytics = await readSource("lib/analytics.ts");
	const union = analytics.match(EVENT_UNION);
	assert.ok(union, "lib/analytics.ts must declare the AnalyticsEvent union");

	const events = [...union[1].matchAll(EVENT_NAME)].map((match) => match[1]);
	assert.ok(events.length > 0, "detector must find the declared events");
	for (const event of events) {
		const wording = EVENT_WORDING[event];
		assert.ok(wording, `analytics event "${event}" is not described on /privacy`);
		assert.ok(privacy.includes(wording), `/privacy must mention "${wording}"`);
	}
});

test("the terms licensing line names all license states or none", async () => {
	const terms = prose(await readSource("app/terms/page.tsx"));
	const resume = await readSource("app/resume/page.tsx");
	const licensed = new Set(
		[...resume.matchAll(RESUME_LICENSE_STATE)].map((match) => STATE_NAMES[match[1]])
	);
	assert.ok(licensed.size > 0, "detector must find the résumé's licenses");

	const sentence = terms.match(LICENSING_SENTENCE);
	assert.ok(sentence, "/terms must keep a plumbing licensing statement");
	const named = Object.values(STATE_NAMES).filter((state) => sentence[0].includes(state));
	if (named.length > 0) {
		assert.deepEqual(new Set(named), licensed, "/terms names only some license states");
	}
});

test("both legal pages show a real last-updated date", async () => {
	const sources = await Promise.all(LEGAL_PAGES.map(readSource));
	for (const [index, path] of LEGAL_PAGES.entries()) {
		const match = sources[index].match(LAST_UPDATED);
		assert.ok(match, `${path} must declare LAST_UPDATED`);
		assert.equal(Number.isNaN(Date.parse(match[1])), false, `${path} date must parse`);
	}
});
