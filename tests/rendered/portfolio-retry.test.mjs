import assert from "node:assert/strict";
import { test } from "node:test";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { withPortfolioFixture } from "../fixtures/portfolio-browser.mjs";

const FAILURE = /Couldn(?:'|&#x27;|’)t load repositories/;
const RECOVERED = /href="https:\/\/github.com\/fixture\/audit-recovery"/;

test("portfolio retry renders provider recovery without caching failure HTML", {
	timeout: 150_000,
}, async () => {
	const repositories = [
		{
			id: 1,
			name: "audit-recovery",
			full_name: "fixture/audit-recovery",
			html_url: "https://github.com/fixture/audit-recovery",
			description: null,
			forks_count: 0,
			stargazers_count: 1,
			pushed_at: "2026-10-19T00:00:00Z",
			updated_at: "2026-10-19T00:00:00Z",
			fork: false,
			archived: false,
		},
	];
	await withPortfolioFixture((fixture) =>
		withProductionServer(
			async (url) => {
				const load = async () => {
					const response = await fetch(`${url}/portfolio`, { signal: AbortSignal.timeout(15_000) });
					assert.equal(response.status, 200);
					return response.text();
				};
				const unavailable = await load();
				assert.equal(fixture.requests, 1, "initial failure must reach the provider");
				assert.match(unavailable, FAILURE);
				fixture.setResponse({ status: 200, body: repositories });
				const recovered = await load();
				assert.equal(fixture.requests, 2, "retry must call the recovered provider");
				assert.doesNotMatch(recovered, FAILURE);
				assert.match(recovered, RECOVERED);
				assert.match(await load(), RECOVERED);
				assert.equal(fixture.requests, 2, "successful data must remain cached");
				fixture.setResponse({ status: 503, body: { message: "Fixture unavailable" } });
				await fixture.invalidate(url);
				assert.match(await load(), FAILURE);
				assert.equal(fixture.requests, 3, "invalidation must reach the failed provider");
			},
			{ env: fixture.env }
		)
	);
});
