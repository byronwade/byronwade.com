import assert from "node:assert/strict";

// Shared by the manual port audit and rendered regression: measure the actual
// claim/specimen/caption and the offered navigation, never a retired card title
// or a desktop link hidden behind the mobile menu (DESIGN.md §§5, 7.4).
export function readThorbisHome(page) {
	return page.evaluate(() => {
		const required = (selector) => {
			const element = document.querySelector(selector);
			if (!element) {
				throw new Error(`Missing Thorbis home role: ${selector}`);
			}
			return element;
		};
		const heading = required("main h1");
		const primary = required('nav[aria-label="Primary"] a[href="/projects"]');
		const menu = required("[data-site-menu]");
		const visible = (element) =>
			element.getClientRects().length > 0 && getComputedStyle(element).visibility === "visible";
		const primaryVisible = visible(primary);
		const navigation = primaryVisible ? primary : menu;
		const navStyle = getComputedStyle(navigation);
		const milliseconds = (value) => Number.parseFloat(value) * (value.endsWith("ms") ? 1 : 1000);
		const probe = document.createElement("span");
		probe.style.transitionTimingFunction = "var(--motion-ease-out)";
		document.body.append(probe);
		const sourceEase = getComputedStyle(probe).transitionTimingFunction;
		probe.remove();
		return {
			overflow: document.documentElement.scrollWidth > innerWidth,
			headingTop: heading.getBoundingClientRect().top,
			headingSize: getComputedStyle(heading).fontSize,
			font: getComputedStyle(heading).fontFamily,
			h1Count: document.querySelectorAll("h1").length,
			headerCount: document.querySelectorAll("[data-site-header]").length,
			ledeSize: getComputedStyle(required("#home-title + p")).fontSize,
			specimenTitleSize: getComputedStyle(required('main [data-slot="sheet"] h2')).fontSize,
			captionSize: getComputedStyle(required("main figure figcaption")).fontSize,
			navigation: {
				primaryVisible,
				menuVisible: visible(menu),
				controlVisible: visible(navigation),
				linkSize: primaryVisible ? navStyle.fontSize : null,
			},
			navMotion: {
				duration: milliseconds(navStyle.transitionDuration),
				sourceDuration: milliseconds(
					getComputedStyle(document.documentElement).getPropertyValue("--motion-fast").trim()
				),
				ease: navStyle.transitionTimingFunction,
				sourceEase,
			},
		};
	});
}

export function assertThorbisHome(geometry) {
	assert.equal(geometry.overflow, false, "home has no horizontal overflow");
	assert.equal(geometry.h1Count, 1, "one home heading");
	assert.equal(geometry.headerCount, 1, "one site header");
	assert.equal(geometry.headingSize, "32px", "Thorbis heading role");
	assert.equal(geometry.ledeSize, "16px", "Thorbis opening prose role");
	assert.equal(geometry.specimenTitleSize, "14px", "Thorbis specimen title role");
	assert.equal(geometry.captionSize, "12px", "Thorbis specimen caption role");
	assert.ok(geometry.headingTop < 350, "claim begins near the top");
	const { navigation } = geometry;
	assert.ok(navigation.controlVisible, "the offered navigation is visible");
	assert.notEqual(
		navigation.primaryVisible,
		navigation.menuVisible,
		"offer either inline navigation or the menu"
	);
	if (navigation.primaryVisible) {
		assert.equal(navigation.linkSize, "13px", "Thorbis visible navigation role");
	}
	assert.equal(geometry.navMotion.duration, geometry.navMotion.sourceDuration);
	assert.equal(geometry.navMotion.ease, geometry.navMotion.sourceEase);
}
