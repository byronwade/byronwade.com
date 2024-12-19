export const featureFlags = {
	enableShop: false,
	enableAnalysis: false,
	enablePortfolio: true,
} as const;

export type FeatureFlags = typeof featureFlags;

// Helper function to check if a feature is enabled
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
	return featureFlags[feature];
}
