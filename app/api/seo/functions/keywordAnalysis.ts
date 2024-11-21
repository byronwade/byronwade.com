import { convert } from "html-to-text";

export const keywordAnalysis = async (content: string) => {
	// Remove HTML tags and undesired strings
	const cleanedContent = convert(content);

	// Tokenize the text content by splitting on whitespace and/or punctuation
	const words = cleanedContent.split(/\W+/).filter((word) => word.length > 0);

	// Create an object to hold the frequency of each word
	let frequency: Record<string, number> = {};

	// Iterate over the words, updating the frequency count
	for (let word of words) {
		word = word.toLowerCase(); // Convert word to lowercase
		if (!frequency[word]) {
			frequency[word] = 0;
		}
		frequency[word]++;
	}

	// Convert the frequency object to an array of [keyword, frequency] tuples,
	// sort them in descending order of frequency.
	const sortedKeywords = Object.entries(frequency).sort(([, a], [, b]) => b - a);

	return sortedKeywords;
};
