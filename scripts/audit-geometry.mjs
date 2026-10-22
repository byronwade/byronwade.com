const PROSE_CHARACTERS = /[\p{L}\p{N}]/u;

// Serialize the pattern explicitly: page evaluation cannot access module scope.
export function readGeometry(page, minimumTargetSize) {
	return page.evaluate(geometryInPage, {
		prosePattern: PROSE_CHARACTERS.source,
		minimumTargetSize,
	});
}

function geometryInPage({ prosePattern, minimumTargetSize }) {
	const targetSelector = "a[href], button, input, select, textarea, [tabindex='0']";
	const minimum = minimumTargetSize ?? (innerWidth < 640 ? 44 : 24);
	const proseCharacters = new RegExp(prosePattern, "u");
	const inline = (element) => ["inline", "contents"].includes(getComputedStyle(element).display);
	// Count only visible prose in the same inline formatting context. A sibling
	// link, hidden description or separate block cannot exempt a standalone link.
	const hasProse = (element) =>
		[...element.childNodes].some((node) => {
			if (node.nodeType === Node.TEXT_NODE) {
				return proseCharacters.test(node.textContent);
			}
			return (
				node.nodeType === Node.ELEMENT_NODE &&
				!node.matches(targetSelector) &&
				!node.closest('[hidden], [inert], [aria-hidden="true"]') &&
				getComputedStyle(node).visibility === "visible" &&
				inline(node) &&
				hasProse(node)
			);
		});
	const sentenceLink = (element) => {
		if (
			!element.matches('a[href]:not([role]), a[href][role="link"]') ||
			getComputedStyle(element).display !== "inline" ||
			!proseCharacters.test(element.textContent)
		) {
			return false;
		}
		let container = element.parentElement;
		while (container && inline(container)) {
			container = container.parentElement;
		}
		return (
			container &&
			["block", "list-item", "table-cell"].includes(getComputedStyle(container).display) &&
			hasProse(container)
		);
	};
	const visible = (element) =>
		element.getClientRects().length &&
		!element.closest('[inert], [aria-hidden="true"], .sr-only') &&
		!element.matches(":disabled, .skip-link") &&
		getComputedStyle(element).visibility === "visible";
	const label = (element) =>
		element.getAttribute("aria-label") ||
		element.getAttribute("name") ||
		(element.querySelector("[data-resume-email]")
			? "Copy email"
			: element.textContent.trim().slice(0, 70));
	const targets = [...document.querySelectorAll(targetSelector)].filter(visible).map((element) => {
		const rect = element.getBoundingClientRect();
		return {
			label: label(element),
			tag: element.tagName,
			width: rect.width,
			height: rect.height,
			inlineText: Boolean(sentenceLink(element)),
		};
	});
	const header = document.querySelector("[data-site-header]");
	const nav = header.querySelector('nav[aria-label="Primary"]');
	const intersects = (element, bounds) => {
		const rect = element.getBoundingClientRect();
		return (
			rect.left < bounds.right &&
			rect.right > bounds.left &&
			rect.top < bounds.bottom &&
			rect.bottom > bounds.top
		);
	};
	// Header controls must clear the primary links; the separately fixed
	// breadcrumb must clear the whole header surface.
	const overlaps = [
		...[...header.querySelectorAll("button, a[href]")]
			.filter(visible)
			.filter((element) => !nav.contains(element))
			.filter((element) => intersects(element, nav.getBoundingClientRect())),
		...[...document.querySelectorAll('nav[aria-label="Breadcrumb"]')]
			.filter(visible)
			.filter((element) => intersects(element, header.getBoundingClientRect())),
	];
	return {
		actualTheme: document.documentElement.classList.contains("dark") ? "dark" : "light",
		overflow: document.documentElement.scrollWidth > innerWidth,
		h1Count: document.querySelectorAll("h1").length,
		navOverlap: overlaps.map(label),
		// Retain the measured exception evidence rather than silently dropping it.
		// WCAG 2.5.8 and DESIGN.md §7.4 exempt links within prose, not controls.
		inlineTargetExceptions: targets.filter(({ inlineText }) => inlineText),
		targetFailures: targets.filter(
			({ width, height, inlineText }) =>
				!inlineText && (width < minimum - 0.1 || height < minimum - 0.1)
		),
	};
}
