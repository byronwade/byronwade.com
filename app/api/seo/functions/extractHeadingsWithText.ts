export const extractHeadingsWithText = async (content: string): Promise<Record<string, { text: string[]; count: number; charCount: number }>> => {
	return new Promise((resolve) => {
		const headingLevels = ["h1", "h2", "h3", "h4", "h5", "h6"];
		const headingsWithText: Record<string, { text: string[]; count: number; charCount: number }> = {};

		for (const level of headingLevels) {
			const regex = new RegExp(`<${level}[^>]*>(.*?)<\/${level}>`, "gis");
			const headings = [...content.matchAll(regex)].map((match) => match[1]);

			const charCount = headings.reduce((acc, heading) => acc + heading.length, 0);
			headingsWithText[level] = {
				text: headings,
				count: headings.length,
				charCount,
			};
		}

		resolve(headingsWithText);
	});
};
