// import { takeScreenshot } from "./functions/takeScreenshot";
import * as zlib from "zlib";
import { chromium, Browser, type Page, request } from '@playwright/test';
import { extractHeadingsWithText } from "./functions/extractHeadingsWithText";
import { checkLinks } from "./functions/checkLinks";
import { checkBrokenLinks } from "./functions/checkBrokenLinks";
import { checkForXMLSitemap } from "./functions/checkforXMLSitemap";
import { checkRobotsTxt } from "./functions/checkRobotsTxt";
import { checkSSLCertificate } from "./functions/checkSSLCertificate";
import { checkCustom404 } from "./functions/checkCustom404";
import { checkRedirects } from "./functions/checkRedirects";
import { checkDNSInfo } from "./functions/checkDNS";
import { checkMetadata } from "./functions/checkMetadata";
import { checkCookiePolicy } from "./functions/checkCookiePolicy";
import { checkConsoleOutput } from "./functions/checkConsoleOutput";
import { checkDeprecatedHtmlTags } from "./functions/checkDeprecatedHtmlTags";
import { keywordAnalysis } from "./functions/keywordAnalysis";
import { checkBrowserCompatibility } from "./functions/checkBrowserCompatability";
import { checkLighthouse } from "./functions/checkLighthouse";

let completedTasks = 0;
const totalTasks = 26;
let browser: Browser;
let page: Page;

export async function GET(request: Request) {
	try {
		completedTasks = 0;
		const startTime = performance.now();
		const { searchParams } = new URL(request.url ?? "");
		let targetUrl = searchParams.get("url");

		if (!targetUrl) {
			return new Response("URL parameter is required", { status: 400 });
		}

		targetUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;
		const dataObject = await fetchPageData(targetUrl);

		const endTime = performance.now();
		const executionTime = endTime - startTime;
		console.log(`API Execution Time: ${executionTime}ms`);

		const compressedData = await compressResponse(JSON.stringify(dataObject));

		return new Response(compressedData, {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Content-Encoding": "gzip",
			},
		});
	} catch (error) {
		console.error(error);
		return new Response("Internal server error", { status: 500 });
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
const fetchPageData = async (link: string): Promise<Record<string, unknown>> => {
	const result: Record<string, unknown> = {};
	const unsortedResult: Record<string, unknown> = {};

	try {
		browser = await chromium.launch();
		page = await browser.newPage();
		await page.goto(link);

		const domain = new URL(link).hostname;
		const content = await page.content();

		const promises = [
			timeFunction("brokenLinks", () => checkBrokenLinks(page).catch((e) => ({ error: e.toString() }))),
			//timeFunction("checkAccessibility", () => checkAccessibility(page).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkBrowserCompatibility", () => checkBrowserCompatibility(page).catch((e) => ({ error: e.toString() }))),
			//timeFunction("checkCache", () => checkCache(request.headers).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkConsoleOutput", () => checkConsoleOutput(page).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkCookiePolicy", () => checkCookiePolicy(page).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkCustom404", () => checkCustom404(domain).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkDNS", () => checkDNSInfo(domain).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkDeprecatedHtmlTags", () => checkDeprecatedHtmlTags(content).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkHeadings", () => extractHeadingsWithText(content).catch((e) => ({ error: e.toString() }))),
			//timeFunction("checkImageOptimization", () => checkImageOptimization(page).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkMetadata", () => checkMetadata(page).catch((e) => ({ error: e.toString() }))),
			//timeFunction("checkMobileFriendly", () => checkMobileFriendly(page).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkRedirects", () => checkRedirects(domain).catch((e) => ({ error: e.toString() }))),
			//timeFunction("checkResponsiveness", () => checkResponsiveness(page).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkRobotTxt", () => checkRobotsTxt(domain).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkSSL", () => checkSSLCertificate(domain).catch((e) => ({ error: e.toString() }))),
			timeFunction("checkSitemap", () => checkForXMLSitemap(domain).catch((e) => ({ error: e.toString() }))),
			timeFunction("getAllLinks", () => checkLinks(page).catch((e) => ({ error: e.toString() }))),
			timeFunction("keywordAnalysis", () => keywordAnalysis(content).catch((e) => ({ error: e.toString() }))),
			//timeFunction("pageSpeed", () => pageSpeedScore(page).catch((e) => ({ error: e.toString() }))),
			//timeFunction("softwareDetection", () => softwareDetection(content, request.headers).catch((e) => ({ error: e.toString() }))),
			timeFunction("lighthouseCheck", () => checkLighthouse(link).catch((e) => ({ error: e.toString() }))),
			//timeFunction("takeScreenshot", () => takeScreenshot(domain, browser, chromium).catch((e) => ({ error: e.toString() }))),
			//timeFunction("analyzeSocialSignals", () => analyzeSocialSignals(domain).catch((e) => ({ error: e.toString() }))),
			//timeFunction("contentQualityAnalysis", () => contentQualityAnalysis(content, 2000).catch((e) => ({ error: e.toString() }))),
				//timeFunction("seoScore", () => onPageSEOScore(domain, content, page).catch((e) => ({ error: e.toString() }))),
		];

		const results = await Promise.all(promises);

		results.forEach(({ name, result }) => {
			unsortedResult[name] = result; // This should now work as expected.
		});

		result["websiteData"] = Object.fromEntries(Object.entries(unsortedResult).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)));
	} catch (error) {
		console.error('Error:', error);
		return { error: error instanceof Error ? error.message : String(error) };
	} finally {
		if (browser) {
			await browser.close();
		}
	}

	return result;
};

async function compressResponse(data: string): Promise<Uint8Array> {
	return new Promise((resolve, reject) => {
		zlib.gzip(data, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}

async function timeFunction<T>(name: string, func: () => Promise<T>): Promise<{ name: string; result: T; executionTime: number }> {
	console.log(`Function Name: ${name}`);
	try {
		const startTime = performance.now();
		const result = await func();
		completedTasks++;
		updateProgress();
		const endTime = performance.now();
		const executionTime = endTime - startTime;
		console.log(`${name} Execution Time: ${executionTime}ms`);
		return { name, result, executionTime };
	} catch (error) {
		console.error(`${name} Error: ${error}`);
		completedTasks++;
		updateProgress();
		return { 
			name, 
			result: { error: error instanceof Error ? error.message : String(error) } as T, 
			executionTime: 0 
		};
	}
}

function updateProgress() {
	if (completedTasks <= totalTasks) {
		const progress = (completedTasks / totalTasks) * 100;
		console.log(`Progress: ${progress.toFixed(2)}%`);
	}
}
