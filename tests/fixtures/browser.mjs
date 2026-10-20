import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";

function isRunning(child) {
	return child.exitCode === null && child.signalCode === null;
}

function combinedFailure(closeError, cleanupError) {
	// Retain both failures; cleanup is the immediate cause of incomplete shutdown.
	return new AggregateError([closeError, cleanupError], "Browser close and cleanup failed", {
		cause: cleanupError,
	});
}

async function settlesWithin(promise, milliseconds) {
	let timer;
	try {
		return await Promise.race([
			promise.then(() => true),
			new Promise((resolve) => {
				timer = setTimeout(() => resolve(false), milliseconds);
			}),
		]);
	} finally {
		clearTimeout(timer);
	}
}

function killTree(child, context, signal) {
	if (process.platform !== "win32") {
		assert.ok(child.kill("SIGKILL"), `Could not signal owned browser process ${child.pid}`);
		return Promise.resolve();
	}
	return new Promise((resolve, reject) => {
		execFile(
			"taskkill.exe",
			["/pid", String(child.pid), "/t", "/f"],
			{
				windowsHide: true,
				timeout: 15_000,
				maxBuffer: 16 * 1024,
				signal,
			},
			(error, stdout, stderr) => {
				const evidence = JSON.stringify({
					pid: child.pid,
					executable: child.spawnfile,
					exitCode: child.exitCode,
					signalCode: child.signalCode,
					commandCode: error?.code ?? 0,
					commandSignal: error?.signal ?? null,
					stdout,
					stderr,
				});
				context.diagnostic(`Owned browser cleanup: ${evidence}`);
				if (error) {
					reject(
						new Error(`Could not stop owned browser process tree: ${evidence}`, { cause: error })
					);
				} else {
					resolve();
				}
			}
		);
	});
}

export async function closeBrowser(browser, context) {
	const child = browser.process();
	const controller = new AbortController();
	// Observe the launched ChildProcess itself, before close can trigger its exit.
	const exited =
		child && isRunning(child)
			? once(child, "exit", { signal: controller.signal })
			: Promise.resolve();
	let closeFailure;
	const closing = Promise.resolve()
		.then(() => browser.close())
		.catch((error) => {
			closeFailure = { error };
		});
	try {
		const closed = await settlesWithin(Promise.all([closing, exited]), 10_000);
		try {
			if (child && isRunning(child)) {
				const stopped = await settlesWithin(
					Promise.all([killTree(child, context, controller.signal), exited]),
					15_000
				);
				assert.ok(stopped, `Owned browser process ${child.pid} did not exit after forced cleanup`);
			} else if (!(child || closed)) {
				throw new Error("Browser close timed out and no owned process is available for cleanup");
			}
		} catch (cleanupError) {
			if (closeFailure) {
				throw combinedFailure(closeFailure.error, cleanupError);
			}
			throw cleanupError;
		}
		if (closeFailure) {
			throw closeFailure.error;
		}
	} finally {
		controller.abort();
	}
}
