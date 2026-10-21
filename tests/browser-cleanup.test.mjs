import assert from "node:assert/strict";
import childProcess from "node:child_process";
import { EventEmitter, once } from "node:events";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { setImmediate as nextTurn } from "node:timers/promises";
import { closeBrowser } from "./fixtures/browser.mjs";

const NO_OWNED_PROCESS = /no owned process/i;
const PROCESS_DID_NOT_EXIT = /owned.*process.*exit/i;
const SIGNAL_FAILED = /could not signal owned browser process 123/i;

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

test("an observed owned exit ends cleanup while taskkill is still running", async (t) => {
	const { child, context, exit } = stubChild(t);
	let aborted = false;
	// A loaded machine can hold taskkill past the child's exit; only the abort ends it.
	t.mock.method(childProcess, "execFile", (_file, _args, options, callback) => {
		exit();
		options.signal.addEventListener("abort", () => {
			aborted = true;
			callback(Object.assign(new Error("aborted"), { name: "AbortError" }), "", "");
		});
	});
	syncBuiltinESMExports();
	const result = closeBrowser({ process: () => child, close: stalledClose }, context);
	const check = assert.doesNotReject(result);
	await nextTurn();
	t.mock.timers.tick(10_000);
	await nextTurn();
	t.mock.timers.tick(15_000);
	await check;
	assert.equal(child.exitCode, 0);
	assert.equal(aborted, true, "the outstanding cleanup command is cancelled");
	assert.equal(child.listenerCount("exit"), 0);
});

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
	await check;
	assert.ok(diagnostics.join("\n").includes('"commandCode":null'));
	assert.ok(diagnostics.join("\n").includes('"commandSignal":"SIGTERM"'));
});

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
	await check;
	assert.ok(diagnostics.join("\n").includes("123"));
	assert.ok(diagnostics.join("\n").includes("synthetic access denied"));
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
