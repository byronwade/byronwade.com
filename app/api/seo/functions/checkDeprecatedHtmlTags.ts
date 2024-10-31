// functions/checkDeprecatedHtmlTags.ts
export async function checkDeprecatedHtmlTags(htmlContent: string) {
	const deprecatedTags = ["applet", "basefont", "bgsound", "big", "blink", "center", "dir", "font", "frame", "frameset", "isindex", "marquee", "menu", "nobr", "noembed", "noframes", "plaintext", "rb", "rtc", "spacer", "strike", "tt"];
	const foundTags = deprecatedTags.filter((tag) => new RegExp(`<${tag}>`, "i").test(htmlContent));
	return {
		deprecatedTags: foundTags,
	};
}
