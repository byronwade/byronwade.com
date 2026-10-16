/**
 * Capture sizes offered by the project preview. The screenshot routes accept
 * only these, so each project has a small, fixed set of cacheable captures
 * rather than one paid render per arbitrary width and height.
 */
export const SCREENSHOT_VIEWPORTS = {
	desktop: { width: 1920, height: 1080 },
	laptop: { width: 1440, height: 900 },
	tablet: { width: 768, height: 1024 },
	mobile: { width: 375, height: 667 },
} as const;
