import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Script } from "node:vm";
import ts from "typescript";

// Exercise the page's actual effect without adding a React test renderer or
// exposing private lifecycle code as production API. A browser pass separately
// verifies React rendering and native fetch cancellation.
const source = readFileSync(new URL("../app/portfolio/page.tsx", import.meta.url), "utf8");
const page = ts.createSourceFile(
	"page.tsx",
	source,
	ts.ScriptTarget.Latest,
	true,
	ts.ScriptKind.TSX
);
const loader = page.statements.find(
	(node) => ts.isFunctionDeclaration(node) && node.name?.text === "fetchPortfolioRepos"
);
const hook = page.statements.find(
	(node) => ts.isFunctionDeclaration(node) && node.name?.text === "usePortfolioRepos"
);
const deadline = page.statements.find(
	(node) =>
		ts.isVariableStatement(node) &&
		node.declarationList.declarations.some(
			(declaration) => declaration.name.getText(page) === "REQUEST_TIMEOUT_MS"
		)
);
let effect;
function findEffect(node) {
	if (ts.isCallExpression(node) && node.expression.getText(page) === "useEffect") {
		effect = node.arguments[0];
	}

	ts.forEachChild(node, findEffect);
}
assert.ok(loader && hook && deadline, "the portfolio lifecycle must have one owner");
findEffect(hook);
assert.ok(effect, "the portfolio hook must register its request lifecycle");
const script = new Script(
	ts.transpileModule(
		`${loader.getText(page)}\n${deadline.getText(page)}\n(${effect.getText(page)})();`,
		{ compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }
	).outputText
);

const REPO = {
	id: 1,
	name: "example-project",
	fork: false,
	stargazers_count: 3,
	pushed_at: "2026-10-01T00:00:00Z",
};
const flush = () => new Promise((resolve) => setImmediate(resolve));

function mount({ refresh = false, phase = "headers", ignoreAbort = false } = {}) {
	const pending = Promise.withResolvers();
	const state = {
		repos: refresh ? [REPO] : [],
		loading: !refresh,
		refreshing: false,
		error: false,
		degraded: false,
	};
	const writes = [];
	const errors = [];
	const timers = new Map();
	let signal;
	const context = {
		AbortController,
		reloadKey: refresh ? 1 : 0,
		console: { error: (...args) => errors.push(args) },
		setTimeout(callback, delay) {
			assert.equal(delay, 8000, "keep the existing eight-second request budget");
			const id = Symbol("deadline");
			timers.set(id, callback);
			return id;
		},
		clearTimeout(id) {
			timers.delete(id);
		},
		fetch(url, options) {
			assert.equal(url, "/api/portfolio");
			signal = options.signal;
			if (!ignoreAbort) {
				signal.addEventListener("abort", () => pending.reject(signal.reason), { once: true });
			}
			if (phase === "body") {
				return Promise.resolve({ ok: true, json: () => pending.promise });
			}
			return pending.promise.then((data) => ({ ok: true, json: async () => data }));
		},
	};
	for (const key of Object.keys(state)) {
		context[`set${key[0].toUpperCase()}${key.slice(1)}`] = (value) => {
			state[key] = value;
			writes.push(key);
		};
	}
	const cleanup = script.runInNewContext(context);
	return {
		state,
		writes,
		errors,
		timers,
		pending,
		cleanup,
		get signal() {
			return signal;
		},
		timeout() {
			assert.equal(timers.size, 1);
			const [id, callback] = timers.entries().next().value;
			timers.delete(id);
			callback();
		},
	};
}

for (const refresh of [false, true]) {
	for (const phase of ["headers", "body"]) {
		test(`${refresh ? "refresh" : "initial load"} recovers when ${phase} stall`, async () => {
			const request = mount({ refresh, phase });
			try {
				await flush();
				request.timeout();
				await flush();
				assert.equal(request.signal.aborted, true);
				assert.equal(request.state.loading, false, "replace the skeleton with recovery");
				assert.equal(request.state.refreshing, false, "enable retry again");
				assert.equal(request.state.error, true, "show the existing error/profile recovery");
				assert.equal(request.state.repos.length, refresh ? 1 : 0, "do not discard prior data");
				assert.equal(request.timers.size, 0);
				assert.equal(request.errors.length, 1);
			} finally {
				request.cleanup();
			}
		});
	}
}

for (const outcome of ["success", "failure"]) {
	test(`a settled ${outcome} clears its deadline`, async () => {
		const request = mount();
		try {
			if (outcome === "success") {
				request.pending.resolve({ repos: [REPO] });
			} else {
				request.pending.reject(new Error("fixture network failure"));
			}
			await flush();
			assert.equal(request.state.loading, false);
			assert.equal(request.state.refreshing, false);
			assert.equal(request.state.error, outcome === "failure");
			assert.equal(request.state.repos.length, outcome === "success" ? 1 : 0);
			assert.equal(request.timers.size, 0, "do not leave a settled request timer running");
			assert.equal(request.errors.length, outcome === "failure" ? 1 : 0);
		} finally {
			request.cleanup();
		}
	});
}

for (const phase of ["headers", "body"]) {
	test(`leaving during ${phase} cancels quietly without stale state writes`, async () => {
		const request = mount({ phase });
		await flush();
		request.cleanup();
		const writeCount = request.writes.length;
		await flush();
		assert.equal(request.signal.aborted, true);
		assert.equal(request.timers.size, 0);
		assert.equal(request.writes.length, writeCount);
		assert.equal(request.state.error, false);
		assert.equal(request.errors.length, 0, "navigation cancellation stays quiet");
	});
}

test("a replaced request cannot overwrite a successful retry, even if abort is ignored", async () => {
	const previous = mount({ ignoreAbort: true });
	previous.cleanup();
	const writeCount = previous.writes.length;
	const retry = mount({ refresh: true });
	try {
		retry.pending.resolve({ repos: [REPO] });
		await flush();
		previous.pending.resolve({ repos: [{ ...REPO, id: 2, name: "stale" }] });
		await flush();
		assert.equal(previous.writes.length, writeCount);
		assert.equal(retry.state.repos[0].name, REPO.name);
		assert.equal(retry.state.error, false);
		assert.equal(retry.state.refreshing, false);
	} finally {
		retry.cleanup();
	}
});

test("retry can succeed after a timed out request", async () => {
	const previous = mount();
	previous.timeout();
	await flush();
	previous.cleanup();
	const retry = mount({ refresh: true });
	try {
		retry.pending.resolve({ repos: [REPO] });
		await flush();
		assert.equal(previous.state.error, true);
		assert.equal(retry.state.error, false);
		assert.equal(retry.state.loading, false);
		assert.equal(retry.state.refreshing, false);
		assert.equal(retry.state.repos[0].name, REPO.name);
	} finally {
		retry.cleanup();
	}
});
