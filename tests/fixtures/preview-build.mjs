/**
 * Project pages leave the preview out of a build made without a capture key, so the
 * preview checks need a build made with one. Only its presence is read, at build time.
 */
export const KEYED_BUILD_HINT =
	"Build with a placeholder key for the build command only: SCREENSHOTONE_ACCESS_KEY=rendered-checks npm run build";
