import { checkMobileFriendly } from "./checkMobileFriendly";
import { checkSSLCertificate } from "./checkSSLCertificate";
import { checkCustom404 } from "./checkCustom404";
import { checkMetadata } from "./checkMetadata";
import { keywordAnalysis } from "./keywordAnalysis";

export const onPageSEOScore = async (domain: string, content: string, page: import('playwright').Page) => {
	await page.waitForTimeout(500);
	await page.waitForSelector("body");
	await page.waitForLoadState("load");

	// Initialize score object
	const score = {
		keywordDensity: 0,
		mobileFriendly: 0,
		pageSpeed: 0,
		secureConnection: 0,
		metaTitleDescription: 0,
		custom404: 0,
		totalScore: 0,
	};

	// Get keyword analysis result
	const keywordAnalysisResult = await keywordAnalysis(content);

	// Check if result exists and is an array before proceeding
	if (Array.isArray(keywordAnalysisResult)) {
		const totalWordCount = keywordAnalysisResult.reduce((sum, item) => sum + item[1], 0);
		score.keywordDensity = (totalWordCount > 0 ? keywordAnalysisResult[0][1] / totalWordCount : 0) * 100;
	}

	// Mobile Friendly Score (10 if mobile friendly, 0 otherwise)
	const mobileFriendlyResult = await checkMobileFriendly(page);
	score.mobileFriendly = mobileFriendlyResult.mobileFriendly ? 10 : 0;

	// Secure Connection Score (10 if HTTPS, 0 otherwise)
	const sslCertificateResult = await checkSSLCertificate(domain);
	score.secureConnection = sslCertificateResult.https ? 10 : 0;

	// Meta Title and Description Score (5 points for title, 5 points for description, assuming they should exist)
	const metadataResult = await checkMetadata(page);
	score.metaTitleDescription = (metadataResult.title.exists ? 5 : 0) + (metadataResult.description.exists ? 5 : 0);

	// Custom 404 Score (10 if custom 404 exists, 0 otherwise)
	const custom404Result = await checkCustom404(domain);
	score.custom404 = custom404Result.hasCustom404 ? 10 : 0;

	// Calculate total score as the sum of individual scores, scaled to a 0 to 100 range
	score.totalScore = ((score.keywordDensity + score.mobileFriendly + score.pageSpeed + score.secureConnection + score.metaTitleDescription + score.custom404) / 60) * 100;

	return { score };
};
