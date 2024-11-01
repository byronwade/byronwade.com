export const checkRedirects = async (domain: string): Promise<any> => {
	try {
		const url = domain.startsWith("http") ? domain : `https://${domain}`;
		const parsedUrl = new URL(url); // This will throw if URL is invalid

		const response = await fetch(parsedUrl.href, { redirect: "manual" });
		const isRedirected = response.type === "opaqueredirect";

		return { isRedirected };
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`Error checking redirects for ${domain}:`, error);
			return { error: error.message };
		}
		console.error(`Unknown error checking redirects for ${domain}:`, error);
		return { error: 'An unknown error occurred' };
	}
};
