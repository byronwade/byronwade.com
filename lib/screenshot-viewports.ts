/**
 * The contract between the project preview and the screenshot routes.
 *
 * Capture sizes offered by the preview. The routes accept only these, so each
 * project has a small, fixed set of cacheable captures rather than one paid
 * render per arbitrary width and height.
 */
export const SCREENSHOT_VIEWPORTS = {
	desktop: { width: 1920, height: 1080 },
	laptop: { width: 1440, height: 900 },
	tablet: { width: 768, height: 1024 },
	mobile: { width: 375, height: 667 },
} as const;

/**
 * The `code` both routes send, with a 503, when this deployment has no capture
 * key. That lasts until a deploy adds one, so the preview says previews are off
 * instead of offering a Retry that cannot succeed.
 */
export const SCREENSHOTS_UNCONFIGURED = "unconfigured";
