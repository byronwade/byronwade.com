export const checkRobotsTxt = async (domain: string): Promise<Record<string, any>> => {
	const result = {
		hasRobotsTxt: false,
		robotsTxtUrl: "",
		directives: [] as { directive: string; value: string }[],
	};

	// Ensure the domain includes a protocol
	const baseDomain = domain.startsWith("http") ? domain : `https://${domain}`;

	const robotsTxtUrl = new URL("/robots.txt", baseDomain);
	result.robotsTxtUrl = robotsTxtUrl.toString();

	try {
		const response = await fetch(robotsTxtUrl.toString());
		if (response.ok) {
			result.hasRobotsTxt = true;
			const robotsTxt = await response.text();
			const directives = robotsTxt
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line);
			directives.forEach((directiveLine) => {
				const [directive, ...valueParts] = directiveLine.split(":");
				const value = valueParts.join(":").trim();
				result.directives.push({ directive: directive.trim(), value });
			});
		}
	} catch (error) {
		// Handle error (e.g., network issue)
	}

	return result;
};
