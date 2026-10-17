import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";

// Ephemeral ports can be claimed between the probe close and `next start`.
const PORT_ATTEMPTS = 3;

async function allocatePort() {
	const socket = createServer();
	socket.listen(0, "127.0.0.1");
	await once(socket, "listening");
	const address = socket.address();
	if (!address || typeof address === "string") {
		socket.close();
		throw new Error("Could not allocate a verification port");
	}
	const { port } = address;
	await new Promise((resolve, reject) => {
		socket.close((error) => (error ? reject(error) : resolve()));
	});
	return port;
}

function startProductionServer(port, env) {
	const server = spawn(
		process.execPath,
		["node_modules/next/dist/bin/next", "start", "-p", String(port), "-H", "127.0.0.1"],
		{ windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...env } }
	);
	const output = { text: "" };
	const ready = new Promise((resolve, reject) => {
		const timer = setTimeout(
			() => reject(new Error(`Production server did not become ready: ${output.text}`)),
			30_000
		);
		const fail = (error) => {
			clearTimeout(timer);
			reject(error);
		};
		server.once("error", fail);
		server.once("exit", (code) => {
			fail(new Error(`Production server exited ${code}: ${output.text}`));
		});
		server.stderr.on("data", (chunk) => {
			output.text += chunk;
		});
		server.stdout.on("data", (chunk) => {
			output.text += chunk;
			if (output.text.includes("Ready in")) {
				clearTimeout(timer);
				resolve();
			}
		});
	});
	return { server, output, ready };
}

function addressInUse(error) {
	return `${error?.message ?? ""} ${error?.cause?.message ?? ""}`.includes("EADDRINUSE");
}

async function stopServer(server) {
	if (server.exitCode === null && server.signalCode === null) {
		server.kill();
		await once(server, "exit");
	}
}

async function runProductionAttempt(verify, env, remaining) {
	const port = await allocatePort();
	const { server, output, ready } = startProductionServer(port, env);
	try {
		await ready;
		return await verify(`http://127.0.0.1:${port}`);
	} catch (error) {
		const wrapped = new Error(
			`Verification failed (server exit ${server.exitCode}, signal ${server.signalCode}): ${output.text.slice(-8192)}`,
			{ cause: error }
		);
		if (!(addressInUse(wrapped) && remaining > 1)) {
			throw wrapped;
		}
	} finally {
		await stopServer(server);
	}
	return runProductionAttempt(verify, env, remaining - 1);
}

// Every verification owns an isolated port and a hidden child with guaranteed cleanup.
export function withProductionServer(verify, { env = {} } = {}) {
	return runProductionAttempt(verify, env, PORT_ATTEMPTS);
}
