import assert from "node:assert/strict";
import childProcess from "node:child_process";
import { EventEmitter, once } from "node:events";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { setImmediate as nextTurn } from "node:timers/promises";
import puppeteer from "puppeteer-core";
import { closeBrowser, withBrowser } from "./fixtures/browser.mjs";

const NO_OWNED_PROCESS = /no owned process/i;
const PROCESS_DID_NOT_EXIT = /owned.*process.*exit/i;
const SIGNAL_FAILED = /could not signal owned browser process 123/i;
const LOST_BROWSER = /exited before cleanup.*"pid":456.*"code":4294967295/;

function stalledClose() {
	return new Promise(() => {
		// Deliberately never settle: the fixture must enforce its own deadline.
	});
}

function stubChild(t) {
	const platform = Object.getOwnPropertyDescriptor(process, "platform");
	Object.defineProperty(process, "platform", { value: "win32" });
	t.after(() => Object.defineProperty(process, "platform", platform));
	const child = Object.assign(new EventEmitter(), {
		pid: 123,
		spawnfile: "synthetic-chrome",
		exitCode: null,
		signalCode: null,
	});
	const diagnostics = [];
	const context = { diagnostic: (message) => diagnostics.push(message) };
	const exit = () => {
		child.exitCode = 0;
		child.emit("exit", 0, null);
	};
	// Both APIs are stubbed so a regression can never target a real PID.
	t.mock.method(childProcess, "spawnSync", () => ({ status: 0 }));
	const kill = t.mock.method(childProcess, "execFile", (_file, _args, _options, callback) => {
		exit();
		callback(null, "synthetic tree stopped", "");
	});
	syncBuiltinESMExports();
	t.after(() => {
		t.mock.restoreAll();
		syncBuiltinESMExports();
	});
	t.mock.timers.enable({ apis: ["setTimeout"] });
	return { child, context, diagnostics, exit, kill };
}

test("graceful cleanup supports a browser without an owned child", async (t) => {
	const close = t.mock.fn(() => Promise.resolve());
	await closeBrowser({ process: () => null, close }, t);
	assert.equal(close.mock.callCount(), 1);
});

test("a rejected close preserves the original error after the owned process exits", async (t) => {
	const { child, context, exit, kill } = stubChild(t);
	const error = new Error("protocol close failed");
	const result = closeBrowser(
		{
			process: () => child,
			close: () => {
				setImmediate(exit);
				return Promise.reject(error);
			},
		},
		context
	);
	const check = assert.rejects(result, (actual) => actual === error);
	await nextTurn();
	await check;
	assert.equal(kill.mock.callCount(), 0, "allow the already-closing child to exit");
	assert.equal(child.listenerCount("exit"), 0);
});

test("a resolved close still waits for the owned process to exit", async (t) => {
	const { child, context, exit, kill } = stubChild(t);
	let complete = false;
	const result = closeBrowser(
		{ process: () => child, close: () => Promise.resolve() },
		context
	).then(() => {
		complete = true;
	});
	await nextTurn();
	assert.equal(complete, false, "a close response is not process-exit evidence");
	exit();
	await result;
	assert.equal(kill.mock.callCount(), 0);
	assert.equal(child.listenerCount("exit"), 0);
});

test("an unowned browser cannot silently pass a timed-out close", async (t) => {
	t.mock.timers.enable({ apis: ["setTimeout"] });
	const result = closeBrowser({ process: () => null, close: stalledClose }, t);
	const check = assert.rejects(result, NO_OWNED_PROCESS);
	await nextTurn();
	t.mock.timers.tick(10_000);
	await check;
});

test("a stalled close forces only the owned tree and waits for its exit", async (t) => {
	const { child, context, diagnostics, kill } = stubChild(t);
	const result = closeBrowser({ process: () => child, close: stalledClose }, context);
	await nextTurn();
	t.mock.timers.tick(9999);
	assert.equal(kill.mock.callCount(), 0);
	t.mock.timers.tick(1);
	await result;
	assert.equal(kill.mock.callCount(), 1);
	const [file, args, options] = kill.mock.calls[0].arguments;
	assert.equal(file, "taskkill.exe");
	assert.deepEqual(args, ["/pid", "123", "/t", "/f"]);
	assert.equal(options.windowsHide, true);
	assert.equal(options.timeout, 15_000);
	assert.ok(diagnostics.join("\n").includes("123"));
	assert.ok(diagnostics.join("\n").includes("synthetic-chrome"));
	assert.ok(diagnostics.join("\n").includes("synthetic tree stopped"));
	assert.equal(child.listenerCount("exit"), 0);
});

test("a successful kill command cannot hide an owned process that never exits", async (t) => {
	const { child, context } = stubChild(t);
	t.mock.method(childProcess, "execFile", (_file, _args, _options, callback) => {
		callback(null, "command claimed success", "");
	});
	syncBuiltinESMExports();
	const result = closeBrowser({ process: () => child, close: stalledClose }, context);
	const check = assert.rejects(result, PROCESS_DID_NOT_EXIT);
	await nextTurn();
	t.mock.timers.tick(10_000);
	await nextTurn();
	t.mock.timers.tick(15_000);
	await check;
	assert.equal(child.listenerCount("exit"), 0);
});

test("a close rejection stays visible after forced cleanup succeeds", async (t) => {
	const { child, context, kill } = stubChild(t);
	const error = new Error("close rejected while the child stayed alive");
	const result = closeBrowser(
		{
			process: () => child,
			close: () => Promise.reject(error),
		},
		context
	);
	const check = assert.rejects(result, (actual) => actual === error);
	await nextTurn();
	t.mock.timers.tick(10_000);
	await check;
	assert.equal(kill.mock.callCount(), 1);
	assert.equal(child.exitCode, 0);
});

test("a child that has already exited never receives a forced kill", async (t) => {
	const { child, context, exit, kill } = stubChild(t);
	exit();
	const result = closeBrowser({ process: () => child, close: stalledClose }, context);
	await nextTurn();
	t.mock.timers.tick(10_000);
	await result;
	assert.equal(kill.mock.callCount(), 0);
	assert.equal(child.listenerCount("exit"), 0);
});

for (const rejectsClose of [false, true]) {
	test(`a successful owned exit racing taskkill preserves close rejection: ${rejectsClose}`, async (t) => {
		const { child, context, diagnostics, exit } = stubChild(t);
		const killError = Object.assign(new Error("process not found"), { code: 128 });
		t.mock.method(childProcess, "execFile", (_file, _args, _options, callback) => {
			exit();
			callback(killError, "", "synthetic process not found");
		});
		syncBuiltinESMExports();
		const closeError = rejectsClose ? new Error("original close failure") : null;
		const result = closeBrowser(
			{
				process: () => child,
				close: closeError ? () => Promise.reject(closeError) : stalledClose,
			},
			context
		);
		const check = closeError
			? assert.rejects(result, (error) => error === closeError)
			: assert.doesNotReject(result);
		await nextTurn();
		t.mock.timers.tick(10_000);
		await check;
		assert.equal(child.exitCode, 0);
		assert.equal(child.listenerCount("exit"), 0);
		assert.ok(diagnostics.join("\n").includes("128"));
	});
}

test("a timed-out cleanup command records that it never reported an exit code", async (t) => {
	const { child, context, diagnostics } = stubChild(t);
	const timeout = Object.assign(new Error("taskkill timed out"), {
		code: null,
		killed: true,
		signal: "SIGTERM",
	});
	t.mock.method(childProcess, "execFile", (_file, _args, _options, callback) => {
		callback(timeout, "", "");
	});
	syncBuiltinESMExports();
	const result = closeBrowser({ process: () => child, close: stalledClose }, context);
	const check = assert.rejects(result, (error) => error.cause === timeout);
	await nextTurn();
	t.mock.timers.tick(10_000);
	// A failed command still waits for the exit that would prove a clean shutdown.
	await nextTurn();
	t.mock.timers.tick(15_000);
	await check;
	assert.ok(diagnostics.join("\n").includes('"commandCode":null'));
	assert.ok(diagnostics.join("\n").includes('"commandSignal":"SIGTERM"'));
});

for (const exitCode of [0, 1]) {
	test(`a taskkill that outlasts the owned exit (code ${exitCode}) passes only a clean exit`, async (t) => {
		const { child, context } = stubChild(t);
		let command;
		t.mock.method(childProcess, "execFile", (_file, _args, options, callback) => {
			command = options;
			// The command keeps walking the tree until the fixture aborts it.
			options.signal.addEventListener("abort", () =>
				callback(Object.assign(new Error("aborted"), { code: "ABORT_ERR" }), "", "")
			);
			setImmediate(() => {
				child.exitCode = exitCode;
				child.emit("exit", exitCode, null);
			});
		});
		syncBuiltinESMExports();
		const result = closeBrowser({ process: () => child, close: stalledClose }, context);
		const check =
			exitCode === 0 ? assert.doesNotReject(result) : assert.rejects(result, PROCESS_DID_NOT_EXIT);
		await nextTurn();
		t.mock.timers.tick(10_000);
		await nextTurn();
		await nextTurn();
		t.mock.timers.tick(15_000);
		await check;
		assert.equal(command.signal.aborted, true, "the outstanding command is stopped");
		assert.equal(child.listenerCount("exit"), 0);
	});
}

test("a failed cleanup command also rejects after a stalled close", async (t) => {
	const { child, context } = stubChild(t);
	const error = Object.assign(new Error("could not launch taskkill"), { code: "ENOENT" });
	t.mock.method(childProcess, "execFile", (_file, _args, _options, callback) => {
		callback(error, "", "synthetic launch failure");
	});
	syncBuiltinESMExports();
	const result = closeBrowser({ process: () => child, close: stalledClose }, context);
	const check = assert.rejects(result, (actual) => {
		assert.equal(actual.cause, error);
		assert.ok(actual.message.includes("ENOENT"));
		assert.ok(actual.message.includes("synthetic launch failure"));
		return true;
	});
	await nextTurn();
	t.mock.timers.tick(10_000);
	// A failed command still waits for the exit that would prove a clean shutdown.
	await nextTurn();
	t.mock.timers.tick(15_000);
	await check;
	assert.equal(child.listenerCount("exit"), 0);
});

const ALREADY_EXITED_TREE = [
	"ERROR: The process with PID 456 (child process of PID 123) could not be terminated.",
	"Reason: There is no running instance of the task.",
	'ERROR: The process "789" not found.',
	"",
].join("\r\n");

test("a tree that exited before taskkill reached it is not a failed cleanup", async (t) => {
	const { child, context, diagnostics, exit } = stubChild(t);
	const killError = Object.assign(new Error("taskkill partial"), { code: 128, signal: null });
	t.mock.method(childProcess, "execFile", (_file, _args, _options, callback) => {
		exit();
		callback(
			killError,
			"SUCCESS: The process with PID 123 has been terminated.",
			ALREADY_EXITED_TREE
		);
	});
	syncBuiltinESMExports();
	const result = closeBrowser({ process: () => child, close: stalledClose }, context);
	await nextTurn();
	t.mock.timers.tick(10_000);
	await result;
	assert.ok(diagnostics.join("\n").includes("no running instance"));
	assert.equal(child.listenerCount("exit"), 0);
});

// Observed on Windows: taskkill stopped a renderer, then found the root already gone because the
// browser was finishing its own shutdown, and reported before that root's exit event arrived.
const ROOT_EXITING = [
	"ERROR: The process with PID 123 (child process of PID 99) could not be terminated.",
	"Reason: There is no running instance of the task.",
	"",
].join("\r\n");

for (const exitCode of [0, 1]) {
	test(`a failed taskkill followed by the owned exit (code ${exitCode}) passes only a clean exit`, async (t) => {
		const { child, context } = stubChild(t);
		const killError = Object.assign(new Error("taskkill failed"), { code: 255, signal: null });
		t.mock.method(childProcess, "execFile", (_file, _args, _options, callback) => {
			callback(killError, "SUCCESS: The process with PID 456 has been terminated.", ROOT_EXITING);
			setImmediate(() => {
				child.exitCode = exitCode;
				child.emit("exit", exitCode, null);
			});
		});
		syncBuiltinESMExports();
		const result = closeBrowser({ process: () => child, close: stalledClose }, context);
		const check =
			exitCode === 0
				? assert.doesNotReject(result)
				: assert.rejects(result, (error) => error.cause === killError);
		await nextTurn();
		t.mock.timers.tick(10_000);
		await check;
		assert.equal(child.listenerCount("exit"), 0);
	});
}

test("an already-gone report cannot hide an owned process that never exits", async (t) => {
	const { child, context } = stubChild(t);
	const killError = Object.assign(new Error("taskkill partial"), { code: 128, signal: null });
	t.mock.method(childProcess, "execFile", (_file, _args, _options, callback) => {
		callback(killError, "", ALREADY_EXITED_TREE);
	});
	syncBuiltinESMExports();
	const result = closeBrowser({ process: () => child, close: stalledClose }, context);
	const check = assert.rejects(result, PROCESS_DID_NOT_EXIT);
	await nextTurn();
	t.mock.timers.tick(10_000);
	await nextTurn();
	t.mock.timers.tick(15_000);
	await check;
	assert.equal(child.listenerCount("exit"), 0);
});

test("non-Windows forced cleanup uses the owned child handle and observes exit", async (t) => {
	const { child, context, exit, kill } = stubChild(t);
	Object.defineProperty(process, "platform", { value: "linux" });
	const signal = t.mock.fn(() => {
		setImmediate(exit);
		return true;
	});
	child.kill = signal;
	const result = closeBrowser({ process: () => child, close: stalledClose }, context);
	await nextTurn();
	t.mock.timers.tick(10_000);
	await result;
	assert.equal(signal.mock.callCount(), 1);
	assert.deepEqual(signal.mock.calls[0].arguments, ["SIGKILL"]);
	assert.equal(kill.mock.callCount(), 0);
	assert.equal(child.listenerCount("exit"), 0);
});

test("non-Windows cleanup does not accept a failed kill signal", async (t) => {
	const { child, context } = stubChild(t);
	Object.defineProperty(process, "platform", { value: "linux" });
	child.kill = () => false;
	const result = closeBrowser({ process: () => child, close: stalledClose }, context);
	const check = assert.rejects(result, SIGNAL_FAILED);
	await nextTurn();
	t.mock.timers.tick(10_000);
	await check;
	assert.equal(child.listenerCount("exit"), 0);
});

test("failed forced cleanup retains command output and the original close error", async (t) => {
	const { child, context, diagnostics } = stubChild(t);
	const closeError = new Error("original protocol failure");
	const killError = Object.assign(new Error("taskkill rejected"), { code: 128, signal: null });
	t.mock.method(childProcess, "execFile", (_file, _args, _options, callback) => {
		callback(killError, "partial cleanup output", "synthetic access denied");
	});
	syncBuiltinESMExports();
	const result = closeBrowser(
		{
			process: () => child,
			close: () => Promise.reject(closeError),
		},
		context
	);
	const check = assert.rejects(result, (error) => {
		assert.ok(error instanceof AggregateError);
		assert.equal(error.errors[0], closeError);
		assert.ok(error.errors[1].message.includes("128"));
		assert.ok(error.errors[1].message.includes("synthetic access denied"));
		assert.ok(error.errors[1].message.includes("partial cleanup output"));
		assert.equal(error.errors[1].cause, killError);
		return true;
	});
	await nextTurn();
	t.mock.timers.tick(10_000);
	// A failed command still waits for the exit that would prove a clean shutdown.
	await nextTurn();
	t.mock.timers.tick(15_000);
	await check;
	assert.ok(diagnostics.join("\n").includes("123"));
	assert.ok(diagnostics.join("\n").includes("synthetic access denied"));
	assert.equal(child.listenerCount("exit"), 0);
});

function stubLaunch(t, close) {
	// No owned child: closeBrowser settles on the close promise alone.
	const browser = { process: () => null, close: t.mock.fn(close) };
	const launch = t.mock.method(puppeteer, "launch", () => Promise.resolve(browser));
	return { browser, launch };
}

test("withBrowser returns the test's value after closing its browser", async (t) => {
	const { browser, launch } = stubLaunch(t, () => Promise.resolve());
	assert.equal(await withBrowser(t, { protocolTimeout: 15_000 }, () => "checked"), "checked");
	assert.equal(browser.close.mock.callCount(), 1);
	const [options] = launch.mock.calls[0].arguments;
	assert.equal(options.headless, true);
	assert.equal(options.protocolTimeout, 15_000);
	assert.ok(options.executablePath);
});

test("withBrowser keeps the test failure when cleanup also fails", async (t) => {
	const failure = new Error("assertion failed in the page");
	const cleanup = new Error("browser close failed");
	const { browser } = stubLaunch(t, () => Promise.reject(cleanup));
	await assert.rejects(
		withBrowser(t, {}, () => Promise.reject(failure)),
		(error) => {
			assert.ok(error instanceof AggregateError);
			assert.deepEqual(error.errors, [failure, cleanup]);
			assert.equal(error.cause, cleanup);
			return true;
		}
	);
	assert.equal(browser.close.mock.callCount(), 1);
});

test("withBrowser reports a cleanup failure after a passing test", async (t) => {
	const cleanup = new Error("browser close failed");
	stubLaunch(t, () => Promise.reject(cleanup));
	await assert.rejects(
		withBrowser(t, {}, () => "passed"),
		(error) => error === cleanup
	);
});

test("withBrowser closes the browser and rethrows a lone test failure", async (t) => {
	const failure = new Error("assertion failed in the page");
	const { browser } = stubLaunch(t, () => Promise.resolve());
	await assert.rejects(
		withBrowser(t, {}, () => Promise.reject(failure)),
		(error) => error === failure
	);
	assert.equal(browser.close.mock.callCount(), 1);
});

test("withBrowser reports an owned browser that exits before cleanup", async (t) => {
	const child = Object.assign(new EventEmitter(), { pid: 456, exitCode: null, signalCode: null });
	const browser = { process: () => child, close: () => Promise.resolve() };
	t.mock.method(puppeteer, "launch", () => Promise.resolve(browser));
	const diagnostics = [];
	const context = { diagnostic: (message) => diagnostics.push(message) };
	const lost = new Error("Target closed");
	await assert.rejects(
		withBrowser(context, {}, () => {
			child.exitCode = 4_294_967_295;
			child.emit("exit", 4_294_967_295, null);
			return Promise.reject(lost);
		}),
		(error) => error === lost
	);
	assert.match(diagnostics.join("\n"), LOST_BROWSER);
	assert.equal(child.listenerCount("exit"), 0);
});

test("a real owned child can exit during a rejected browser close", {
	timeout: 30_000,
}, async (t) => {
	const child = childProcess.spawn(
		process.execPath,
		["-e", "process.send('ready'); setInterval(() => {}, 1000)"],
		{
			windowsHide: true,
			stdio: ["ignore", "ignore", "ignore", "ipc"],
			timeout: 20_000,
			killSignal: "SIGKILL",
		}
	);
	const exited = once(child, "exit");
	try {
		await once(child, "message", { signal: t.signal });
		const error = new Error("owned-child close rejection");
		await assert.rejects(
			closeBrowser(
				{
					process: () => child,
					close: () => {
						child.kill();
						return Promise.reject(error);
					},
				},
				t
			),
			(actual) => actual === error
		);
		assert.ok(child.exitCode !== null || child.signalCode !== null);
	} finally {
		if (child.exitCode === null && child.signalCode === null) {
			child.kill();
		}
		await exited;
	}
});
