import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Render the actual page, viewer and primitives without credentials or a Figma request.
registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "@/lib/portfolio-data") {
			return { url: "fixture:figma-detail", shortCircuit: true };
		}
		if (["next/link", "next/image", "next/navigation"].includes(specifier)) {
			return nextResolve(`${specifier}.js`, context);
		}
		if (specifier.startsWith("@/")) {
			const base = new URL(`../../${specifier.slice(2)}`, import.meta.url);
			const url = [".ts", ".tsx"].map((extension) => new URL(`${base.href}${extension}`));
			return nextResolve(
				url.find((candidate) => existsSync(candidate))?.href ?? base.href,
				context
			);
		}
		if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
			const base = new URL(specifier, context.parentURL);
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
		if (url === "fixture:figma-detail") {
			return {
				format: "module",
				shortCircuit: true,
				source: `export const fixture = { file: null };
export const getFigmaFile = () => async () => fixture.file;`,
			};
		}
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

const { default: FigmaDetailPage } = await import("../../app/portfolio/figma/[key]/page.tsx");
const { BreadcrumbTrail } = await import("../../components/layout/breadcrumb-trail-view.tsx");
const { PathnameContext } = await import(
	"next/dist/shared/lib/hooks-client-context.shared-runtime.js"
);
const { fixture } = await import("@/lib/portfolio-data");
function file(overrides = {}) {
	return {
		name: "Example design",
		lastModified: "2026-01-01T00:00:00Z",
		pageCount: 2,
		styleCount: 3,
		components: [{ id: "1:1", name: "Primary button", description: "Submit a form" }],
		thumbnailUrl: null,
		version: "123",
		...overrides,
	};
}

export async function renderFigmaDetail(overrides = {}, { includeSiteBreadcrumb = false } = {}) {
	fixture.file = file(overrides);
	const page = await FigmaDetailPage({ params: Promise.resolve({ key: "ExampleKey" }) });
	return renderToStaticMarkup(
		includeSiteBreadcrumb
			? createElement(
					Fragment,
					null,
					createElement(
						"div",
						{ className: "hidden xl:block" },
						createElement(
							PathnameContext.Provider,
							{ value: "/portfolio/figma/ExampleKey" },
							createElement(BreadcrumbTrail, { labels: { "/": "Home", "/portfolio": "Portfolio" } })
						)
					),
					createElement("main", null, page)
				)
			: page
	);
}

export function renderMissingFigmaDetail() {
	fixture.file = null;
	return FigmaDetailPage({ params: Promise.resolve({ key: "UnavailableKey" }) });
}
