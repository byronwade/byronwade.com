import { once } from "node:events";
import { createServer } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const file = {
	name: "Accessibility audit design fixture",
	lastModified: "2026-10-16T00:00:00Z",
	version: "audit-fixture",
	document: {
		id: "0:0",
		name: "Document",
		type: "DOCUMENT",
		children: [
			{ id: "1:1", name: "Overview", type: "CANVAS", children: [] },
			{ id: "1:2", name: "Components", type: "CANVAS", children: [] },
		],
	},
	components: {
		"2:1": { key: "fixture-button", name: "Primary button", description: "Fixture component" },
	},
	styles: { "3:1": { key: "fixture-type", name: "Body", styleType: "TEXT" } },
};

export async function withFigmaFixture(verify) {
	const server = createServer((request, response) => {
		const url = new URL(request.url, "http://fixture.invalid");
		response.writeHead(url.pathname === "/v1/files/audit-fixture" ? 200 : 404, {
			"Content-Type": "application/json",
		});
		response.end(
			JSON.stringify(
				url.pathname === "/v1/files/audit-fixture" ? file : { message: "Fixture file not found" }
			)
		);
	});
	server.listen(0, "127.0.0.1");
	await once(server, "listening");
	try {
		const address = server.address();
		if (!address || typeof address === "string") {
			throw new Error("Could not allocate the Figma fixture port");
		}
		return await verify({
			FIGMA_AUDIT_PORT: String(address.port),
			FIGMA_ACCESS_TOKEN: "audit-fixture-not-a-credential",
			FIGMA_TEAM_ID: "",
			NO_PROXY: "api.figma.com,127.0.0.1,localhost",
			no_proxy: "api.figma.com,127.0.0.1,localhost",
			NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} --import=${pathToFileURL(resolve("tests/fixtures/figma-browser-preload.mjs")).href}`,
		});
	} finally {
		await new Promise((resolveClose, reject) =>
			server.close((error) => (error ? reject(error) : resolveClose()))
		);
	}
}
