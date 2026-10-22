import { once } from "node:events";
import { createServer } from "node:http";

// Production bundles contain the real SDK, so the action tests' module mock
// cannot replace it. Its supported base URL keeps every browser send on loopback.
export async function withResendFixture(verify, { handleEmail } = {}) {
	const server = createServer((request, response) => {
		request.resume();
		const accepted = request.method === "POST" && request.url === "/emails";
		if (accepted && handleEmail) {
			handleEmail(request, response);
			return;
		}
		response.writeHead(accepted ? 200 : 404, { "Content-Type": "application/json" });
		response.end(
			JSON.stringify(accepted ? { id: "local-browser-fixture" } : { error: "Not found" })
		);
	});
	server.listen(0, "127.0.0.1");
	await once(server, "listening");
	try {
		const address = server.address();
		if (!address || typeof address === "string") {
			throw new Error("Could not allocate the Resend fixture port");
		}
		return await verify({
			RESEND_BASE_URL: `http://127.0.0.1:${address.port}`,
			RESEND_API_KEY: "audit-fixture-not-a-credential",
		});
	} finally {
		// Fault scenarios can deliberately leave a response unfinished.
		server.closeAllConnections();
		await new Promise((resolve, reject) =>
			server.close((error) => (error ? reject(error) : resolve()))
		);
	}
}
