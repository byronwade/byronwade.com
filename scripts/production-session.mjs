import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";

// Every verification owns an isolated port and a hidden child with guaranteed cleanup.
export async function withProductionServer(verify, { env = {} } = {}) {
	const socket = createServer();
	socket.listen(0, "127.0.0.1");
	await once(socket, "listening");
	const address = socket.address();
	if (!address || typeof address === "string") {
		throw new Error("Could not allocate a verification port");
	}
	const port = address.port;
	await new Promise((resolve, reject) =>
		socket.close((error) => (error ? reject(error) : resolve()))
	);
	const server = spawn(
		process.execPath,
		["node_modules/next/dist/bin/next", "start", "-p", String(port), "-H", "127.0.0.1"],
		{ windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...env } }
	);
	let output = "";
	const url = `http://127.0.0.1:${port}`;
	try {
		await new Promise((resolve, reject) => {
			const timer = setTimeout(
				() => reject(new Error(`Production server did not become ready: ${output}`)),
				30_000
			);
			server.once("error", (error) => {
				clearTimeout(timer);
				reject(error);
			});
			server.once("exit", (code) => {
				clearTimeout(timer);
				reject(new Error(`Production server exited ${code}: ${output}`));
			});
			server.stderr.on("data", (chunk) => {
				output += chunk;
			});
			server.stdout.on("data", (chunk) => {
				output += chunk;
				if (output.includes("Ready in")) {
					clearTimeout(timer);
					resolve();
				}
			});
		});
		return await verify(url);
	} catch (error) {
		throw new Error(
			`Verification failed (server exit ${server.exitCode}, signal ${server.signalCode}): ${output.slice(-8192)}`,
			{ cause: error }
		);
	} finally {
		if (server.exitCode === null && server.signalCode === null) {
			server.kill();
			await once(server, "exit");
		}
	}
}
