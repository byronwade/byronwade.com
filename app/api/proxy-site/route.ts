import { type NextRequest, NextResponse } from "next/server";

// Allowed domains for proxying (security measure)
const ALLOWED_HOSTNAMES = [
	"byronwade.com",
	"rebuzzle.byronwade.com",
	"cms.byronwade.com",
	"zugz.byronwade.com",
	"wadesplumbingandseptic.byronwade.com",
	"reactpress.byronwade.com",
];

function isAllowedHostname(hostname: string): boolean {
	return ALLOWED_HOSTNAMES.some(
		(allowed) => hostname === allowed || hostname.endsWith(".byronwade.com")
	);
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const url = searchParams.get("url");
		const resourceType = searchParams.get("type") || "html";
		const viewportWidth = Number.parseInt(searchParams.get("viewport") || "1920", 10);

		if (!url) {
			return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
		}

		// Parse and validate URL
		let targetUrl: URL;
		try {
			targetUrl = new URL(url);
		} catch {
			return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
		}

		// Security check
		if (!isAllowedHostname(targetUrl.hostname)) {
			return NextResponse.json(
				{ error: "Only byronwade.com subdomains are allowed" },
				{ status: 403 }
			);
		}

		const baseUrl = `${targetUrl.protocol}//${targetUrl.host}`;

		// Fetch the resource
		const response = await fetch(targetUrl.toString(), {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept:
					resourceType === "html"
						? "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
						: "*/*",
				"Accept-Language": "en-US,en;q=0.9",
				"Accept-Encoding": "gzip, deflate, br",
				Referer: baseUrl,
			},
			redirect: "follow",
		});

		if (!response.ok) {
			return NextResponse.json(
				{ error: `Failed to fetch: ${response.statusText}` },
				{ status: response.status }
			);
		}

		const contentType = response.headers.get("content-type") || "";

		// For non-HTML resources, just pass them through
		if (!contentType.includes("text/html")) {
			const data = await response.arrayBuffer();
			return new NextResponse(data, {
				headers: {
					"Content-Type": contentType,
					"Cache-Control": "public, max-age=3600",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}

		// Process HTML content
		let html = await response.text();
		const _proxyBase = "/api/proxy-site?url=";

		// Inject script that routes ALL navigation through the proxy
		const interceptorScript = `
<script>
(function() {
	'use strict';

	var PROXY_BASE = '/api/proxy-site?url=';
	var TARGET_BASE = '${baseUrl}';
	var VIEWPORT = ${viewportWidth};
	var TARGET_HOST = new URL(TARGET_BASE).host;

	// Helper to create proxy URL
	function toProxyUrl(href) {
		if (!href) return href;
		// Skip special protocols
		if (href.startsWith('javascript:') || href.startsWith('mailto:') ||
			href.startsWith('tel:') || href.startsWith('data:') || href.startsWith('#') ||
			href.startsWith('blob:')) {
			return href;
		}
		// Already a proxy URL
		if (href.startsWith('/api/proxy-site')) {
			return href;
		}
		// Convert relative URLs to absolute
		var absoluteUrl = href;
		if (href.startsWith('/') && !href.startsWith('//')) {
			absoluteUrl = TARGET_BASE + href;
		} else if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
			absoluteUrl = TARGET_BASE + '/' + href;
		} else if (href.startsWith('//')) {
			absoluteUrl = 'https:' + href;
		}
		// Check if URL is for our target domain
		try {
			var urlObj = new URL(absoluteUrl);
			if (urlObj.host === TARGET_HOST) {
				return PROXY_BASE + encodeURIComponent(absoluteUrl) + '&viewport=' + VIEWPORT;
			}
		} catch(e) {}
		// External URL - return as-is (will open normally or be blocked by sandbox)
		return href;
	}

	// ============================================
	// 1. FRAME REFERENCE ISOLATION
	// ============================================
	try {
		Object.defineProperty(window, 'top', {
			get: function() { return window.self; },
			configurable: false
		});
		Object.defineProperty(window, 'parent', {
			get: function() { return window.self; },
			configurable: false
		});
		Object.defineProperty(window, 'frameElement', {
			get: function() { return null; },
			configurable: false
		});
	} catch(e) {}

	// ============================================
	// 2. INTERCEPT ALL LINK CLICKS
	// ============================================
	document.addEventListener('click', function(e) {
		var link = e.target.closest ? e.target.closest('a') : null;
		if (!link) {
			// Fallback for older browsers
			var el = e.target;
			while (el && el.tagName !== 'A') {
				el = el.parentElement;
			}
			link = el;
		}
		if (!link) return;

		var href = link.getAttribute('href');
		if (!href) return;

		// Skip hash-only links (same page anchors)
		if (href.startsWith('#')) return;

		// Skip special protocols that should work normally
		if (href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
			return;
		}

		var proxyUrl = toProxyUrl(href);

		// If URL was converted to proxy URL, handle navigation
		if (proxyUrl !== href && proxyUrl.startsWith('/api/proxy-site')) {
			e.preventDefault();
			e.stopPropagation();
			// Fix target attribute
			var target = link.getAttribute('target');
			if (target === '_top' || target === '_parent' || target === '_blank') {
				window.location.href = proxyUrl;
			} else {
				window.location.href = proxyUrl;
			}
			return false;
		}

		// For frame-escaping targets on any link
		var target = link.getAttribute('target');
		if (target === '_top' || target === '_parent') {
			e.preventDefault();
			link.setAttribute('target', '_self');
			link.click();
			return false;
		}
	}, true);

	// ============================================
	// 3. INTERCEPT FORM SUBMISSIONS
	// ============================================
	document.addEventListener('submit', function(e) {
		var form = e.target;
		if (!form || form.tagName !== 'FORM') return;

		var action = form.getAttribute('action') || '';
		var proxyUrl = toProxyUrl(action || window.location.href);

		if (proxyUrl.startsWith('/api/proxy-site')) {
			form.setAttribute('action', proxyUrl);
		}

		var target = form.getAttribute('target');
		if (target === '_top' || target === '_parent') {
			form.setAttribute('target', '_self');
		}
	}, true);

	// ============================================
	// 4. INTERCEPT WINDOW.LOCATION CHANGES
	// ============================================
	var originalLocation = window.location;

	// Override location.assign
	var origAssign = window.location.assign.bind(window.location);
	window.location.assign = function(url) {
		var proxyUrl = toProxyUrl(url);
		origAssign(proxyUrl);
	};

	// Override location.replace
	var origReplace = window.location.replace.bind(window.location);
	window.location.replace = function(url) {
		var proxyUrl = toProxyUrl(url);
		origReplace(proxyUrl);
	};

	// ============================================
	// 5. INTERCEPT WINDOW.OPEN
	// ============================================
	var originalOpen = window.open;
	window.open = function(url, target, features) {
		var proxyUrl = toProxyUrl(url);
		if (target === '_top' || target === '_parent') {
			target = '_self';
		}
		return originalOpen.call(window, proxyUrl, target, features);
	};

	// ============================================
	// 6. INTERCEPT HISTORY API (for SPAs)
	// ============================================
	var origPushState = history.pushState.bind(history);
	history.pushState = function(state, title, url) {
		if (url) {
			var proxyUrl = toProxyUrl(url);
			return origPushState(state, title, proxyUrl);
		}
		return origPushState(state, title, url);
	};

	var origReplaceState = history.replaceState.bind(history);
	history.replaceState = function(state, title, url) {
		if (url) {
			var proxyUrl = toProxyUrl(url);
			return origReplaceState(state, title, proxyUrl);
		}
		return origReplaceState(state, title, url);
	};

	// ============================================
	// 7. FIX EXISTING AND DYNAMIC ELEMENTS
	// ============================================
	function fixElements() {
		document.querySelectorAll('a[target="_top"], a[target="_parent"]').forEach(function(link) {
			link.setAttribute('target', '_self');
		});
		document.querySelectorAll('form[target="_top"], form[target="_parent"]').forEach(function(form) {
			form.setAttribute('target', '_self');
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', fixElements);
	} else {
		fixElements();
	}

	// ============================================
	// 8. MUTATION OBSERVER
	// ============================================
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			mutation.addedNodes.forEach(function(node) {
				if (node.nodeType === 1) {
					if (node.tagName === 'A' || node.tagName === 'FORM') {
						var target = node.getAttribute('target');
						if (target === '_top' || target === '_parent') {
							node.setAttribute('target', '_self');
						}
					}
					if (node.querySelectorAll) {
						node.querySelectorAll('a[target="_top"], a[target="_parent"], form[target="_top"], form[target="_parent"]').forEach(function(el) {
							el.setAttribute('target', '_self');
						});
					}
				}
			});
		});
	});

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true
	});
})();
</script>`;

		// Remove restrictive headers from meta tags
		html = html.replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");
		html = html.replace(/<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi, "");

		// Add base tag for relative URLs and ensure links stay in iframe
		const baseTag = `<base href="${baseUrl}/" target="_self">`;

		// Inject our scripts and base tag right after <head>
		html = html.replace(/<head([^>]*)>/i, `<head$1>\n${baseTag}\n${interceptorScript}`);

		// Set viewport to requested width
		const viewportMeta = `<meta name="viewport" content="width=${viewportWidth}, initial-scale=1">`;
		html = html.replace(/<meta[^>]*name=["']viewport["'][^>]*>/gi, viewportMeta);

		// If no viewport exists, add one
		if (!/<meta[^>]*name=["']viewport["']/i.test(html)) {
			html = html.replace(/<head([^>]*)>/i, `<head$1>\n${viewportMeta}`);
		}

		// Inject CSS to fix hydration issues and set proper width
		const forceLayoutCSS = `
<style id="proxy-layout-override">
	/* Set width based on requested viewport */
	html {
		width: ${viewportWidth}px !important;
		min-width: ${viewportWidth}px !important;
		max-width: ${viewportWidth}px !important;
		overflow-x: hidden !important;
		overflow-y: auto !important;
	}
	body {
		width: ${viewportWidth}px !important;
		min-width: ${viewportWidth}px !important;
		max-width: ${viewportWidth}px !important;
		overflow-x: hidden !important;
		visibility: visible !important;
	}
	/* Override Next.js hydration hiding - common patterns */
	html:not(.hydrated) {
		overflow: visible !important;
	}
	html:not(.hydrated) body {
		visibility: visible !important;
		overflow: visible !important;
	}
	/* Force visibility on all elements */
	body > * {
		visibility: visible !important;
		opacity: 1 !important;
	}
	/* Make sure hidden divs used for React hydration don't affect layout */
	div[hidden] {
		display: none !important;
	}
</style>
<script>
	// Force add hydrated class immediately
	document.documentElement.classList.add('hydrated');
</script>`;

		html = html.replace(/<\/head>/i, `${forceLayoutCSS}\n</head>`);

		// Also add hydrated class directly to html tag if it exists
		html = html.replace(/<html([^>]*)class=["']([^"']*)["']/i, '<html$1class="$2 hydrated"');
		// If no class attribute, add one
		if (!/<html[^>]*class=/i.test(html)) {
			html = html.replace(/<html([^>]*)>/i, '<html$1 class="hydrated">');
		}

		// Convert relative URLs to absolute in common attributes
		const urlAttributes = [
			"href",
			"src",
			"action",
			"data-src",
			"data-href",
			"poster",
			"srcset",
			"background",
			"data-background",
		];
		for (const attr of urlAttributes) {
			// Handle regular attributes - match both single and double quotes, and handle paths that might have query strings
			const regex = new RegExp(`(${attr})=["'](\\/[^"'\\s<>]*)["']`, "gi");
			html = html.replace(regex, (_, attrName, path) => {
				// Skip if already absolute
				if (
					path.startsWith("http://") ||
					path.startsWith("https://") ||
					path.startsWith("//") ||
					path.startsWith("data:") ||
					path.startsWith("blob:")
				) {
					return `${attrName}="${path}"`;
				}
				return `${attrName}="${baseUrl}${path}"`;
			});
		}

		// Handle srcset specially (multiple URLs)
		html = html.replace(/srcset=["']([^"']+)["']/gi, (_, srcset) => {
			const fixed = srcset.replace(
				/(\s|^)(\/[^\s,]+)/g,
				(_: string, space: string, path: string) => {
					if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("//")) {
						return `${space}${path}`;
					}
					return `${space}${baseUrl}${path}`;
				}
			);
			return `srcset="${fixed}"`;
		});

		// Fix CSS url() references in style attributes and style tags
		html = html.replace(/url\(\s*["']?(\/[^"')]+)["']?\s*\)/gi, (_, path) => {
			if (
				path.startsWith("http://") ||
				path.startsWith("https://") ||
				path.startsWith("//") ||
				path.startsWith("data:")
			) {
				return `url("${path}")`;
			}
			return `url("${baseUrl}${path}")`;
		});

		// Fix inline style attributes with background-image
		html = html.replace(/style=["']([^"']*background[^"']*url\([^)]+\)[^"']*)["']/gi, (match) => {
			return match.replace(/url\(["']?(\/[^"')]+)["']?\)/gi, (_, path) => {
				if (
					path.startsWith("http://") ||
					path.startsWith("https://") ||
					path.startsWith("//") ||
					path.startsWith("data:")
				) {
					return `url("${path}")`;
				}
				return `url("${baseUrl}${path}")`;
			});
		});

		// Return modified HTML with permissive headers
		return new NextResponse(html, {
			headers: {
				"Content-Type": "text/html; charset=utf-8",
				"Cache-Control": "public, max-age=60",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, OPTIONS",
				"Access-Control-Allow-Headers": "*",
				// Explicitly allow framing
				"X-Frame-Options": "ALLOWALL",
			},
		});
	} catch (error) {
		console.error("Proxy error:", error);
		return NextResponse.json(
			{
				error: "Failed to proxy request",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// Handle preflight requests
export async function OPTIONS() {
	return new NextResponse(null, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "*",
		},
	});
}
