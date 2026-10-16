import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveTrail } from "../components/layout/breadcrumb-trail.ts";

test("breadcrumbs omit path prefixes that are not known pages", () => {
	assert.deepEqual(resolveTrail("/portfolio/figma/example", { "/portfolio": "Portfolio" }), [
		{ href: "/", label: "Home" },
		{ href: "/portfolio", label: "Portfolio" },
		{ href: "/portfolio/figma/example", label: "Example" },
	]);
});

test("breadcrumbs retain known ancestors and resolved leaf titles", () => {
	assert.deepEqual(
		resolveTrail("/projects/example/", {
			"/": "Start",
			"/projects": "Projects",
			"/projects/example": "Example project",
		}),
		[
			{ href: "/", label: "Start" },
			{ href: "/projects", label: "Projects" },
			{ href: "/projects/example", label: "Example project" },
		]
	);
});

test("breadcrumbs keep an unknown error-page leaf without inventing parent pages", () => {
	assert.deepEqual(resolveTrail("/missing/error-page", {}), [
		{ href: "/", label: "Home" },
		{ href: "/missing/error-page", label: "Error Page" },
	]);
	assert.deepEqual(resolveTrail("/", {}), [{ href: "/", label: "Home" }]);
});
