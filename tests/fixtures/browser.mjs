import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import puppeteer from "puppeteer-core";

const ALREADY_GONE = /not found|no running instance of the task/i;

// Windows has reported both 128 and 255 when a tree member exited before taskkill reached it.
// Accept only per-process "already gone" failures; the caller still requires the owned root's
// actual exit. Neither the command's status nor a successful root kill proves the whole tree stopped.
function onlyAlreadyGone(error, stderr) {
	const failures = String(stderr).split("ERROR:").slice(1);
	return (
		(error.code === 128 || error.code === 255) &&
		failures.length > 0 &&
		failures.every((failure) => ALREADY_GONE.test(failure))
	);
}

function isRunning(child) {
	return child.exitCode === null && child.signalCode === null;
}

function combinedFailure(firstError, cleanupError, message) {
	// Retain both failures; cleanup is the immediate cause of incomplete shutdown.
	return new AggregateError([firstError, cleanupError], message, { cause: cleanupError });
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
					// A timed-out or signalled command has no exit code; never report it as 0.
					commandCode: error ? error.code : 0,
					commandSignal: error?.signal ?? null,
					stdout,
					stderr,
				});
				context.diagnostic(`Owned browser cleanup: ${evidence}`);
				if (error && !onlyAlreadyGone(error, stderr)) {
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
				let commandError;
				const forced = killTree(child, context, controller.signal).catch((error) => {
					commandError = error;
				});
				// Under load the browser can finish shutting itself down while taskkill walks
				// its tree: the command outlasts the deadline, or fails on the root it was
				// about to kill. Exit code 0 means the browser shut itself down (a forced kill
				// exits 1), so it proves shutdown whatever the command reports; any other exit
				// needs the tree kill to have succeeded.
				const stopped = await settlesWithin(
					exited.then(async () => {
						if (child.exitCode !== 0) {
							await forced;
							if (commandError) {
								throw commandError;
							}
						}
					}),
					15_000
				);
				if (!stopped && commandError) {
					throw commandError;
				}
				assert.ok(stopped, `Owned browser process ${child.pid} did not exit after forced cleanup`);
			} else if (!(child || closed)) {
				throw new Error("Browser close timed out and no owned process is available for cleanup");
			}
		} catch (cleanupError) {
			if (closeFailure) {
				throw combinedFailure(closeFailure.error, cleanupError, "Browser close and cleanup failed");
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

/** Owns the browser lifetime; unexpected exit and cleanup cannot silently pass a test. */
export async function withBrowser(context, options, use) {
	const browser = await puppeteer.launch({
		executablePath:
			process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
		headless: true,
		...options,
	});
	const child = browser.process();
	let lostBrowser;
	const recordLoss = (code, signal) => {
		lostBrowser = new Error(
			`Owned browser exited before cleanup: ${JSON.stringify({ pid: child.pid, code, signal })}`
		);
	};
	child?.once("exit", recordLoss);
	if (child && !isRunning(child)) {
		recordLoss(child.exitCode, child.signalCode);
	}
	let outcome;
	try {
		if (lostBrowser) {
			throw lostBrowser;
		}
		outcome = { value: await use(browser) };
	} catch (error) {
		outcome = { error };
	}
	child?.off("exit", recordLoss);
	if (lostBrowser) {
		// "Target closed" alone cannot tell a crash or an outside kill from a test fault.
		context.diagnostic(lostBrowser.message);
		if (!("error" in outcome)) {
			outcome = { error: lostBrowser };
		}
	}
	try {
		await closeBrowser(browser, context);
	} catch (cleanupError) {
		if ("error" in outcome) {
			throw combinedFailure(outcome.error, cleanupError, "Browser test and cleanup failed");
		}
		throw cleanupError;
	}
	if ("error" in outcome) {
		throw outcome.error;
	}
	return outcome.value;
}
