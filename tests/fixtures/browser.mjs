import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

export async function closeBrowser(browser, context) {
	const child = browser.process();
	let timer;
	let closed = false;
	try {
		closed = await Promise.race([
			browser.close().then(() => true),
			new Promise((resolve) => {
				timer = setTimeout(() => resolve(false), 10_000);
			}),
		]);
	} finally {
		clearTimeout(timer);
		// A stalled or rejected shutdown must release this test's owned process tree.
		if (!closed && child && child.exitCode === null && child.signalCode === null) {
			if (process.platform === "win32") {
				const result = spawnSync("taskkill.exe", ["/pid", String(child.pid), "/t", "/f"], {
					windowsHide: true,
					timeout: 15_000,
				});
				assert.equal(result.status, 0, "the owned Chrome process tree must stop");
				context.diagnostic(`Stopped owned Chrome tree ${child.pid} after bounded shutdown`);
			} else {
				child.kill("SIGKILL");
			}
		}
	}
}
