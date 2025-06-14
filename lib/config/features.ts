export const features = {
	enableBlog: true,
	enableContactForm: true,
	// Add more feature flags here
};

export type FeatureFlags = typeof features;

// Helper function to check if a feature is enabled
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
	return features[feature];
}
