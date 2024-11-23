export async function keywordAnalysis(content: string) {
	try {
		// Remove HTML tags and convert to lowercase
		const text = content.replace(/<[^>]*>/g, "").toLowerCase();

		// Split into words and count frequencies
		const words = text.match(/\b\w+\b/g) || [];
		const frequencies: Record<string, number> = {};

		words.forEach((word) => {
			frequencies[word] = (frequencies[word] || 0) + 1;
		});

		// Sort by frequency
		const sortedKeywords = Object.entries(frequencies)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 20);

		return {
			keywords: sortedKeywords,
			totalWords: words.length,
			uniqueWords: Object.keys(frequencies).length,
		};
	} catch (error) {
		console.error("Error in keyword analysis:", error);
		return {
			keywords: [],
			totalWords: 0,
			uniqueWords: 0,
			error: "Failed to analyze keywords",
		};
	}
}
