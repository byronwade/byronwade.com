import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

registerHooks({
	resolve(specifier, context, nextResolve) {
		const base = specifier.startsWith("@/")
			? new URL(`../${specifier.slice(2)}`, import.meta.url)
			: specifier.startsWith(".") && context.parentURL?.startsWith("file:")
				? new URL(specifier, context.parentURL)
				: null;
		if (base) {
			const source = [".ts", ".tsx"]
				.map((extension) => new URL(`${base.href}${extension}`))
				.find((candidate) => existsSync(candidate));
			if (source) {
				return nextResolve(source.href, context);
			}
		}
		return nextResolve(specifier, context);
	},
	load(url, context, nextLoad) {
		if (url.endsWith(".tsx")) {
			return {
				format: "module",
				shortCircuit: true,
				source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
					compilerOptions: {
						jsx: ts.JsxEmit.ReactJSX,
						module: ts.ModuleKind.ESNext,
						target: ts.ScriptTarget.ES2022,
					},
				}).outputText,
			};
		}
		return nextLoad(url, context);
	},
});

const { default: ErrorBoundary } = await import("../components/common/error-boundary.tsx");
const { default: RouteError } = await import("../app/error.tsx");
const AUTOMATIC_RELOAD = "Cannot read properties of undefined (reading 'call')";
const LOST_DRAFT_PROMISE = /Nothing you typed|nothing.*lost|clearing the browser cache/i;

function failedBoundary(error) {
	const boundary = new ErrorBoundary({ children: "Original content" });
	boundary.state = ErrorBoundary.getDerivedStateFromError(error);
	return boundary;
}

for (const message of ["An ordinary render failure", AUTOMATIC_RELOAD]) {
	test(`${message}: catching an error schedules no reload`, (context) => {
		const timer = context.mock.method(globalThis, "setTimeout", () => 0);
		const log = context.mock.method(console, "error", () => undefined);
		context.mock.method(console, "warn", () => undefined);
		const error = new Error(message);
		failedBoundary(error).componentDidCatch(error, { componentStack: "\n    at BrokenChild" });
		assert.equal(timer.mock.callCount(), 0, "An error must remain until visitor intent");
		assert.equal(log.mock.callCount(), 1, "Log the caught failure once");
	});
}

test("shell recovery explicitly reloads once, without a delayed retry", (context) => {
	const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
	const reload = context.mock.fn();
	Object.defineProperty(globalThis, "window", {
		configurable: true,
		value: { location: { reload } },
	});
	context.after(() => {
		if (originalWindow) {
			Object.defineProperty(globalThis, "window", originalWindow);
		} else {
			Reflect.deleteProperty(globalThis, "window");
		}
	});
	const timer = context.mock.method(globalThis, "setTimeout", () => 0);
	const boundary = failedBoundary(new Error("A failed shell"));
	const notice = boundary.render();
	// The notice is inside the root's replacement main landmark.
	const recovery = notice.props.children;
	assert.equal(reload.mock.callCount(), 0, "Rendering an error must never navigate");
	assert.equal(recovery.props.retryLabel, "Reload page");
	recovery.props.onRetry();
	assert.equal(reload.mock.callCount(), 1);
	assert.equal(timer.mock.callCount(), 0, "Recovery must leave no callback that can reload later");
});

test("the shell fallback restores the main landmark and gives honest recovery guidance", () => {
	const html = renderToStaticMarkup(failedBoundary(new Error("A failed shell")).render());
	assert.ok(html.includes('<main id="main-content">'), "The skip link still needs its target");
	assert.ok(html.includes('role="alert"'));
	assert.ok(html.includes('type="button">Reload page</button>'));
	assert.ok(html.includes('href="/"'), "Full navigation must remain available");
	assert.ok(html.includes("unsent text"));
	assert.doesNotMatch(html, LOST_DRAFT_PROMISE);
});

test("route recovery retains Try again and does not promise that text survived", () => {
	const html = renderToStaticMarkup(
		createElement(RouteError, { error: new Error("A failed route"), retry: () => undefined })
	);
	assert.ok(html.includes('type="button">Try again</button>'));
	assert.ok(html.includes("unsent text"));
	assert.doesNotMatch(html, LOST_DRAFT_PROMISE);
	assert.equal(html.includes("<main"), false, "The route already lives inside the shell's main");
});

test("a healthy shell keeps its children", () => {
	const children = createElement("p", null, "Healthy content");
	assert.equal(new ErrorBoundary({ children }).render(), children);
});

for (const thrown of [null, undefined, "A thrown string", 0, { reason: "A thrown object" }]) {
	test(`non-Error throws still reach recovery (${JSON.stringify(thrown)})`, () => {
		const html = renderToStaticMarkup(failedBoundary(thrown).render());
		assert.ok(html.includes('role="alert"'));
		assert.ok(html.includes('type="button">Reload page</button>'));
	});
	test(`non-Error route throws still reach recovery (${JSON.stringify(thrown)})`, () => {
		const html = renderToStaticMarkup(
			createElement(RouteError, { error: thrown, retry: () => undefined })
		);
		assert.ok(html.includes('role="alert"'));
		assert.ok(html.includes('type="button">Try again</button>'));
	});
}
