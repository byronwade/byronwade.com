export const checkCustom404 = async (domain: string): Promise<Record<string, any>> => {
	// Ensure the domain includes a protocol
	const baseDomain = domain.startsWith("http") ? domain : `https://${domain}`;

	const nonExistentPageUrl = new URL("/non-existent-page", baseDomain);
	try {
		const response = await fetch(nonExistentPageUrl.toString());
		const text = await response.text();
		if (response.status === 404) {
			const isDefault404 = text.includes("404 Not Found") && text.includes("nginx"); // Adjust this line to match the default 404 page of the server
			return {
				hasCustom404: !isDefault404,
				statusCode: response.status,
			};
		}
		return {
			hasCustom404: false,
			statusCode: response.status,
		};
	} catch (error) {
		return {
			hasCustom404: false,
			statusCode: null,
			error: (error as Error).message,
		};
	}
};
