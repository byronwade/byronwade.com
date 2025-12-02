import { get } from "@vercel/edge-config";

/**
 * Edge Config structure type definition
 */
export interface EdgeConfig {
	// Site-wide settings
	siteSettings?: {
		maintenanceMode?: boolean;
		comingSoon?: boolean;
		announcement?: {
			enabled: boolean;
			message: string;
			type?: "info" | "warning" | "success" | "error";
		};
	};

	// Portfolio configuration
	portfolio?: {
		showProjects?: boolean;
		showBlog?: boolean;
		featuredProjects?: string[];
		featuredPosts?: string[];
	};

	// Dynamic content
	dynamicContent?: {
		[key: string]: unknown;
	};

	// Feature toggles (using Edge Config instead of Flags)
	features?: {
		enableInteractiveDashboard?: boolean;
		enableProjectPreviews?: boolean;
		enableBlogComments?: boolean;
		enableNewsletter?: boolean;
	};

	// Analytics and tracking
	analytics?: {
		enabled?: boolean;
		debugMode?: boolean;
	};

	// External integrations
	integrations?: {
		[key: string]: {
			enabled: boolean;
			config?: Record<string, unknown>;
		};
	};
}

/**
 * Get a value from Edge Config
 * @param key - The key to retrieve (supports nested keys with dot notation)
 * @returns The value or undefined if not found
 */
export async function getEdgeConfigValue<T = unknown>(key: string): Promise<T | undefined> {
	if (!process.env.EDGE_CONFIG) {
		if (process.env.NODE_ENV === "development") {
			console.warn("EDGE_CONFIG environment variable is not set");
		}
		return undefined;
	}

	try {
		return await get<T>(key);
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error(`Error fetching Edge Config key "${key}":`, error);
		}
		return undefined;
	}
}

/**
 * Get the entire Edge Config object
 * @returns The Edge Config object or empty object if unavailable
 */
export async function getEdgeConfig(): Promise<Partial<EdgeConfig>> {
	try {
		const config = await get<EdgeConfig>("");
		return config || {};
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Error fetching Edge Config:", error);
		}
		return {};
	}
}

/**
 * Check if a feature is enabled in Edge Config
 * @param featureKey - The feature key to check (e.g., "features.enableInteractiveDashboard")
 * @returns true if the feature is enabled, false otherwise
 */
export async function isFeatureEnabled(featureKey: string): Promise<boolean> {
	const enabled = await getEdgeConfigValue<boolean>(featureKey);
	return enabled === true;
}

/**
 * Get site settings from Edge Config
 * @returns Site settings or default values
 */
export async function getSiteSettings() {
	const settings = await getEdgeConfigValue<EdgeConfig["siteSettings"]>("siteSettings");
	return {
		maintenanceMode: settings?.maintenanceMode ?? false,
		comingSoon: settings?.comingSoon ?? false,
		announcement: settings?.announcement ?? { enabled: false, message: "", type: "info" },
	};
}

/**
 * Get portfolio configuration from Edge Config
 * @returns Portfolio configuration or default values
 */
export async function getPortfolioConfig() {
	const config = await getEdgeConfigValue<EdgeConfig["portfolio"]>("portfolio");
	return {
		showProjects: config?.showProjects ?? true,
		showBlog: config?.showBlog ?? true,
		featuredProjects: config?.featuredProjects ?? [],
		featuredPosts: config?.featuredPosts ?? [],
	};
}
