import { setTimeout as delay } from "node:timers/promises";
import puppeteer from "puppeteer-core";

// Add background-network suppression to Puppeteer's default Chrome arguments.
const QUIET_CHROME_FLAGS = [
	"--disable-background-networking",
	"--disable-component-extensions-with-background-pages",
	"--disable-component-update",
	"--disable-client-side-phishing-detection",
	"--disable-default-apps",
	"--disable-domain-reliability",
	"--disable-extensions",
	"--disable-hang-monitor",
	"--disable-prompt-on-repost",
	"--disable-sync",
	"--metrics-recording-only",
	"--mute-audio",
	"--no-default-browser-check",
	"--no-first-run",
	"--password-store=basic",
];

// Both performance gates use the same host-settle protocol. Callers close their
// previous browser before entering the interval and own this browser's cleanup.
export async function launchAuditBrowser({ lighthouse = false } = {}) {
	if (lighthouse) {
		await delay(45_000);
	}
	const browser = await puppeteer.launch({
		executablePath:
			process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
		headless: true,
		args: QUIET_CHROME_FLAGS,
	});
	// Chrome launch is its own burst; settle on about:blank before tracing.
	if (lighthouse) {
		await delay(5000);
	}
	return browser;
}
