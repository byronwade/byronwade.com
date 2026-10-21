import { spawn } from "node:child_process";
import { once } from "node:events";

const READY_DEADLINE = 30_000;
const LOCAL_URL = /Local:\s+(http:\/\/\S+)/;

/** Resolves with the served origin once the server answers a request, not merely once it logs. */
async function serving(server, log) {
	const deadline = new AbortController();
	const timer = setTimeout(
		() => deadline.abort(new Error(`Production server did not become ready: ${log()}`)),
		READY_DEADLINE
	);
	const stopped = new Promise((_, reject) => {
		server.once("error", reject);
		server.once("exit", (code) => reject(new Error(`Production server exited ${code}: ${log()}`)));
	});
	const abandoned = new Promise((_, reject) => {
		deadline.signal.addEventListener("abort", () => reject(deadline.signal.reason));
	});
	const listening = new Promise((resolve) => {
		const check = () => {
			const url = log().match(LOCAL_URL)?.[1];
			if (url && log().includes("Ready in")) {
				server.stdout.off("data", check);
				resolve(url);
			}
		};
		server.stdout.on("data", check);
	});
	try {
		const url = await Promise.race([listening, stopped, abandoned]);
		// Next logs "Ready in" before it loads the app; the first response proves it serves.
		const response = await Promise.race([
			fetch(`${url}/`, { signal: deadline.signal }),
			stopped,
			abandoned,
		]);
		await response.arrayBuffer();
		if (!response.ok) {
			throw new Error(`Production server answered ${response.status}: ${log()}`);
		}
		return url;
	} finally {
		clearTimeout(timer);
		// Settled races must not leave a rejection unobserved.
		stopped.catch(() => undefined);
		abandoned.catch(() => undefined);
	}
}

// Every verification owns an OS-assigned port and a hidden child with guaranteed cleanup.
export async function withProductionServer(verify, { env = {} } = {}) {
	const server = spawn(
		process.execPath,
		["node_modules/next/dist/bin/next", "start", "-p", "0", "-H", "127.0.0.1"],
		{ windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...env } }
	);
	let output = "";
	const collect = (chunk) => {
		output += chunk;
	};
	server.stdout.on("data", collect);
	server.stderr.on("data", collect);
	try {
		return await verify(await serving(server, () => output));
	} finally {
		if (server.exitCode === null && server.signalCode === null) {
			server.kill();
			await once(server, "exit");
		}
	}
}
