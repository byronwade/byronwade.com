import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Script } from "node:vm";
import { cloneElement, createElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const FAILED = /Couldn(?:'|&#x27;)t load repositories/;
const RETRY = /<a[^>]*href="\/portfolio"[^>]*role="link"[^>]*>Try again<\/a>/;
const PROFILE =
	/<a[^>]*href="https:\/\/github.com\/byronwade"[^>]*role="link"[^>]*>Open GitHub<\/a>/;
const EMPTY_OR_LOADING = /No repositories yet|Loading repositories|Refreshing/;
const EMPTY = /No repositories yet/;
const ERROR_OR_LOADING = /Couldn(?:'|&#x27;)t load repositories|Loading repositories/;
const ROW = /<li>/g;
const EXCLUDED = /project-90|project-91|Loading repositories|Couldn(?:'|&#x27;)t load repositories/;

// Keep the actual page orchestration and row rendering. Primitive stand-ins
// isolate its data outcomes without exposing private functions or loading Next.
const source = readFileSync(new URL("../app/portfolio/page.tsx", import.meta.url), "utf8");
const page = ts.createSourceFile(
	"page.tsx",
	source,
	ts.ScriptTarget.Latest,
	true,
	ts.ScriptKind.TSX
);
const functions = new Set([
	"languageTone",
	"selectRepos",
	"RefreshLink",
	"PortfolioUnavailable",
	"RepoRow",
	"PortfolioPage",
]);
const constants = new Set(["LANGUAGE_TONES", "WORD_SEPARATORS", "pushedAtFormat", "titleize"]);
const statements = page.statements.filter(
	(node) =>
		(ts.isFunctionDeclaration(node) && functions.has(node.name?.text)) ||
		(ts.isVariableStatement(node) &&
			node.declarationList.declarations.some((declaration) =>
				constants.has(declaration.name.getText(page))
			))
);
assert.equal(
	statements.length,
	functions.size + constants.size,
	"all page behavior must remain in the test"
);
const script = new Script(
	ts.transpileModule(statements.map((node) => node.getText(page)).join("\n"), {
		compilerOptions: {
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.CommonJS,
			jsx: ts.JsxEmit.ReactJSX,
		},
	}).outputText
);

function renderPage(load) {
	const errors = [];
	const context = {
		exports: {},
		require(name) {
			assert.equal(name, "react/jsx-runtime");
			return jsxRuntime;
		},
		console: { error: (...args) => errors.push(args) },
		getGitHubRepositories: load,
		SiteShell: ({ children }) => createElement("main", null, children),
		PageHeader: ({ title, lede, aside }) =>
			createElement("header", null, createElement("h1", null, title), lede, aside),
		IndexList: ({ children }) => createElement("ol", null, children),
		IndexRow: ({ children }) => createElement("li", null, children),
		EmptyState: ({ title, description, action }) =>
			createElement("section", null, createElement("h2", null, title), description, action),
		Button: ({ render, role }) => cloneElement(render, { role }),
		indexRowAccentClass: "",
		indexRowLinkClass: "",
	};
	for (const icon of ["RefreshCw", "ExternalLink", "Github", "Star", "GitFork"]) {
		context[icon] = () => null;
	}
	script.runInNewContext(context);
	return { errors, html: Promise.resolve(context.exports.default()).then(renderToStaticMarkup) };
}

const repository = (id, stars = 1) => ({
	id,
	name: `project-${id}`,
	html_url: `https://github.com/example/project-${id}`,
	fork: false,
	stargazers_count: stars,
	pushed_at: "2026-10-01T00:00:00Z",
	language: "TypeScript",
});

test("repository failure renders recovery links instead of an empty profile or perpetual loading", async () => {
	const failure = new Error("fixture timeout while reading JSON");
	const { html, errors } = renderPage(() => Promise.reject(failure));
	const output = await html;
	assert.match(output, FAILED);
	assert.match(output, RETRY);
	assert.match(output, PROFILE);
	assert.doesNotMatch(output, EMPTY_OR_LOADING);
	assert.equal(errors.length, 1);
	assert.equal(errors[0][1], failure);
});

test("an empty repository profile has a distinct non-error result", async () => {
	const { html, errors } = renderPage(async () => []);
	const output = await html;
	assert.match(output, EMPTY);
	assert.doesNotMatch(output, ERROR_OR_LOADING);
	assert.deepEqual(errors, []);
});

test("retry can succeed after failure and renders every eligible repository in rank order", async () => {
	const failed = renderPage(() => Promise.reject(new Error("fixture timeout")));
	assert.match(await failed.html, FAILED);
	const repos = Array.from({ length: 12 }, (_, index) => repository(index + 1, index + 1));
	const { html, errors } = renderPage(async () => [
		...repos,
		{ ...repository(90), fork: true },
		{ ...repository(91), name: "byronwade.com" },
	]);
	const output = await html;
	assert.equal((output.match(ROW) || []).length, 12, "no client-only load-more gate");
	assert.ok(output.indexOf("project-12") < output.indexOf('project-1"'));
	assert.doesNotMatch(output, EXCLUDED);
	assert.deepEqual(errors, []);
});
