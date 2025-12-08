import { type NextRequest, NextResponse } from "next/server";

const LOG_ENDPOINT = "http://127.0.0.1:7242/ingest/73275cdc-6b74-4dd1-b76c-0e95e613b0bc";
const LOG_SESSION = "debug-session";
const LOG_RUN = "proxy-route";

// #region agent log
async function agentLog(message: string, data: Record<string, unknown>, hypothesisId = "H1") {
	try {
		await fetch(LOG_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				location: "api/proxy-site",
				message,
				data,
				timestamp: Date.now(),
				sessionId: LOG_SESSION,
				runId: LOG_RUN,
				hypothesisId,
			}),
		});
	} catch (error) {
		console.error("agentLog failed", error);
	}
}
// #endregion

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

		void agentLog(
			"request:start",
			{
				url,
				resourceType,
				viewportWidth,
				path: request.nextUrl.pathname,
				query: Object.fromEntries(searchParams.entries()),
			},
			"H1"
		);

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

		void agentLog(
			"fetch:response",
			{
				target: targetUrl.toString(),
				status: response.status,
				resourceType,
				contentType: response.headers.get("content-type") || "",
			contentLength: Number(response.headers.get("content-length") || 0),
			contentEncoding: response.headers.get("content-encoding") || null,
			cacheControl: response.headers.get("cache-control") || null,
			etag: response.headers.get("etag") || null,
			lastModified: response.headers.get("last-modified") || null,
			},
			"H2"
		);

		const xFrameOptions = response.headers.get("x-frame-options");
		const contentSecurityPolicy = response.headers.get("content-security-policy");
		const referrerPolicy = response.headers.get("referrer-policy");
		// #region agent log
		void agentLog(
			"fetch:security-headers",
			{
				target: targetUrl.toString(),
				xFrameOptions,
				contentSecurityPolicy: contentSecurityPolicy?.slice(0, 200) || null,
				referrerPolicy,
			},
			"H2"
		);
		// #endregion

		if (!response.ok) {
		void agentLog(
			"fetch:error",
			{
				target: targetUrl.toString(),
				status: response.status,
				statusText: response.statusText,
				resourceType,
				contentType,
			},
			"H2"
		);
			return NextResponse.json(
				{ error: `Failed to fetch: ${response.statusText}` },
				{ status: response.status }
			);
		}

		const contentType = response.headers.get("content-type") || "";

		const isHTML = contentType.includes("text/html");

		// For non-HTML resources, just pass them through
		if (!isHTML) {
		const data = await response.arrayBuffer();
		const upstreamHeaders = response.headers;
		const contentEncoding = upstreamHeaders.get("content-encoding");
		const cacheControl = upstreamHeaders.get("cache-control");
		const etag = upstreamHeaders.get("etag");
		const lastModified = upstreamHeaders.get("last-modified");
		const contentLength = upstreamHeaders.get("content-length");
			void agentLog(
			"fetch:non-html",
				{
					target: targetUrl.toString(),
					contentType,
					resourceType,
					status: response.status,
				upstreamContentLength: Number(contentLength || 0),
				upstreamContentEncoding: contentEncoding || null,
				bodyLength: data.byteLength,
				note: "forwarding decompressed body; stripping content-encoding/length",
				},
				"H3"
			);
		const headers = new Headers();
		headers.set("Content-Type", contentType);
		if (cacheControl) headers.set("Cache-Control", cacheControl);
		if (etag) headers.set("ETag", etag);
		if (lastModified) headers.set("Last-Modified", lastModified);
		headers.set("Access-Control-Allow-Origin", "*");
		return new NextResponse(data, { status: response.status, headers });
		}

		// Process HTML content
		let html = await response.text();
	const scriptCount = (html.match(/<script/gi) || []).length;
	const linkCount = (html.match(/<link/gi) || []).length;
	const imgCount = (html.match(/<img/gi) || []).length;
	const styleCount = (html.match(/<style/gi) || []).length;
	const hasMetaCsp = /http-equiv=["']Content-Security-Policy["']/i.test(html);
	const hasMetaXfo = /http-equiv=["']X-Frame-Options["']/i.test(html);
	const hasBase = /<base[^>]*>/i.test(html);
	void agentLog(
		"html:pre-rewrite",
		{
			target: targetUrl.toString(),
			contentLength: html.length,
			hasMetaCsp,
			hasMetaXfo,
			hasBase,
			viewportWidth,
			scriptCount,
			linkCount,
			imgCount,
			styleCount,
		},
		"H3"
	);
		// Use absolute proxy base so injected resources stay on our origin even after
		// the <base> tag points at the target origin.
		const proxyBase = `${request.nextUrl.origin}/api/proxy-site?url=`;
		const _proxyBase = proxyBase;

		// Inject script that routes ALL navigation through the proxy
		const interceptorScript = `
<script>
(function() {
	'use strict';

	var PROXY_BASE = '${request.nextUrl.origin}/api/proxy-site?url=';
	var TARGET_BASE = '${baseUrl}';
	var VIEWPORT = ${viewportWidth};
	var TARGET_HOST = new URL(TARGET_BASE).host;
	var LOG_ENDPOINT = 'http://127.0.0.1:7242/ingest/73275cdc-6b74-4dd1-b76c-0e95e613b0bc';
	var SESSION_ID = 'debug-session';
	var RUN_ID = 'zugz-runtime';

	// #region agent log
	function agentLog(message, data, hypothesisId) {
		try {
			fetch(LOG_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					location: 'proxy-interceptor',
					message: message,
					data: data || {},
					timestamp: Date.now(),
					sessionId: SESSION_ID,
					runId: RUN_ID,
					hypothesisId: hypothesisId || 'H1'
				})
			}).catch(function(){});
		} catch (e) {}
	}
	// #endregion

	agentLog('init', { targetBase: TARGET_BASE, viewport: VIEWPORT }, 'H1');

	// Wrap fetch to log failures
	const _fetch = window.fetch;
	window.fetch = function() {
		const args = arguments;
		return _fetch.apply(this, args).then(function(res) {
			if (!res.ok) {
				res.clone().text().then(function(body) {
					agentLog('fetch-error', {
						url: res.url,
						status: res.status,
						statusText: res.statusText,
						bodySample: body ? body.slice(0, 256) : null
					}, 'H3');
				}).catch(function(){});
			}
			return res;
		}).catch(function(err) {
			agentLog('fetch-throw', { url: args[0], error: String(err) }, 'H3');
			throw err;
		});
	};

	// Wrap XHR to log non-2xx
	(function(open, send) {
		XMLHttpRequest.prototype.open = function(method, url) {
			this._agentUrl = url;
			return open.apply(this, arguments);
		};
		XMLHttpRequest.prototype.send = function(body) {
			this.addEventListener('loadend', function() {
				if (this.status < 200 || this.status >= 300) {
					agentLog('xhr-error', {
						url: this._agentUrl || null,
						status: this.status,
						statusText: this.statusText
					}, 'H3');
				}
			});
			return send.apply(this, arguments);
		};
	})(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);

	// Patch console.error to capture runtime errors
	const _consoleError = console.error;
	console.error = function() {
		try {
			agentLog('console-error', { args: Array.from(arguments).map(String).slice(0, 5) }, 'H4');
		} catch (_e) {}
		return _consoleError.apply(this, arguments);
	};

	// Global error listener for resource/script failures
	window.addEventListener('error', function (event) {
		try {
			var target = event.target || {};
			var tag = target.tagName;
			var src = target.src || target.href || event.filename || null;
			agentLog('window-error', {
				tag: tag || null,
				src: src,
				message: event.message || null,
				lineno: event.lineno || null,
				colno: event.colno || null,
				isTrusted: event.isTrusted || false
			}, 'H2');
		} catch (e) {}
	}, true);

	// Log DOM metrics after load to track visible content
	function logDomMetrics(label) {
		try {
			var body = document.body;
			var html = document.documentElement;
			agentLog(label, {
				title: document.title,
				bodyChildren: body ? body.childElementCount : null,
				bodyHeight: body ? body.offsetHeight : null,
				bodyScroll: body ? { scrollHeight: body.scrollHeight, clientHeight: body.clientHeight } : null,
				htmlClass: html ? html.className : null,
				textLen: body && body.innerText ? body.innerText.length : null
			}, 'H1');
		} catch (e) {}
	}
	if (document.readyState === 'complete') {
		logDomMetrics('dom-metrics-ready');
	} else {
		window.addEventListener('load', function() { logDomMetrics('dom-metrics-load'); });
	}

	// Normalize URL to absolute against target
	function normalizeUrl(href) {
		try {
			return new URL(href, TARGET_BASE).toString();
		} catch (e) {
			return href;
		}
	}

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
				agentLog('toProxyUrl:proxy', { href: href, absoluteUrl: absoluteUrl }, 'H2');
				return PROXY_BASE + encodeURIComponent(absoluteUrl) + '&viewport=' + VIEWPORT;
			}
		} catch(e) {}
		agentLog('toProxyUrl:direct', { href: href, absoluteUrl: absoluteUrl }, 'H2');
		// External URL - return as-is (will open normally or be blocked by sandbox)
		return href;
	}

	// ============================================
	// 0. FETCH/XMLHTTPREQUEST REWRITE FOR SAME-ORIGIN CALLS
	// ============================================
	try {
		var originalFetch = window.fetch.bind(window);
		window.fetch = function(input, init) {
			try {
				var urlStr = typeof input === 'string' ? input : input && input.url;
				var normalized = normalizeUrl(urlStr || '');
				var urlObj = new URL(normalized);
				var isSameHost = urlObj.host === TARGET_HOST;
				var isRelative = !/^https?:\/\//i.test(urlStr || '');
				if (isSameHost || isRelative) {
					var proxied = PROXY_BASE + encodeURIComponent(normalized) + '&viewport=' + VIEWPORT + '&type=asset';
					agentLog('fetch:proxy', { url: urlStr, proxied: proxied }, 'H3');
					return originalFetch(proxied, init).then(function(resp) {
						agentLog('fetch:proxy:resp', { url: urlStr, status: resp.status, contentType: resp.headers && resp.headers.get ? resp.headers.get('content-type') : null }, 'H2');
						return resp;
					}).catch(function(err) {
						agentLog('fetch:proxy:error', { url: urlStr, error: String(err) }, 'H2');
						throw err;
					});
				}
			} catch (e) {
				agentLog('fetch:fallthrough', { url: input }, 'H3');
				// fall through to original fetch
			}
			return originalFetch(input, init);
		};

		var OriginalXHR = window.XMLHttpRequest;
		function ProxyXHR() {
			var xhr = new OriginalXHR();
			var originalOpen = xhr.open;
			xhr.open = function(method, url) {
				try {
					var normalizedUrl = normalizeUrl(url);
					var urlObj = new URL(normalizedUrl);
					var isSameHost = urlObj.host === TARGET_HOST;
					var isRelative = !/^https?:\/\//i.test(url || '');
					if (isSameHost || isRelative) {
						var proxiedUrl = PROXY_BASE + encodeURIComponent(normalizedUrl) + '&viewport=' + VIEWPORT + '&type=asset';
						agentLog('xhr:proxy', { url: url, proxied: proxiedUrl }, 'H3');
						return originalOpen.call(xhr, method, proxiedUrl);
					}
				} catch (e) {
					// fall through
				}
				return originalOpen.call(xhr, method, url);
			};
			return xhr;
		}
		window.XMLHttpRequest = ProxyXHR;
	} catch(e) {}

	// #region agent log (lifecycle)
	document.addEventListener('DOMContentLoaded', function() {
		try {
			var body = document.body;
			var first = body ? body.firstElementChild : null;
			var firstStyle = first ? window.getComputedStyle(first) : null;
			agentLog('dom-content-loaded', {
				title: document.title,
				bodyChildren: body ? body.childElementCount : -1,
				firstChild: first ? { tag: first.tagName, id: first.id, class: first.className, style: first.getAttribute ? first.getAttribute('style') : null,
					display: firstStyle ? firstStyle.display : null,
					visibility: firstStyle ? firstStyle.visibility : null,
					opacity: firstStyle ? firstStyle.opacity : null
				} : null,
				scriptCount: body ? body.querySelectorAll('script').length : null,
				textSample: body && body.innerText ? body.innerText.slice(0, 160) : ''
			}, 'H6');
		} catch (e) {
			agentLog('dom-content-loaded-error', { error: String(e) }, 'H6');
		}
	});

	window.addEventListener('load', function() {
		agentLog('window-load', { title: document.title, bodyChildren: document.body ? document.body.childElementCount : -1 }, 'H6');
		requestAnimationFrame(function() {
			agentLog('raf-after-load', { htmlClass: document.documentElement.className, bodyChildren: document.body ? document.body.childElementCount : -1 }, 'H6');
			try {
				var body = document.body;
				var first = body ? body.firstElementChild : null;
				var bodyStyle = body ? window.getComputedStyle(body) : null;
				var firstStyle = first ? window.getComputedStyle(first) : null;
				var head = document.head;
				var nextData = document.getElementById('__NEXT_DATA__');
				var scriptCount = body ? body.querySelectorAll('script').length : null;
				agentLog('layout-stats', {
					location: window.location ? window.location.href : null,
					bodyHeight: body ? body.offsetHeight : null,
					bodyRect: body ? body.getBoundingClientRect().toJSON() : null,
					bodyScroll: body ? { scrollHeight: body.scrollHeight, clientHeight: body.clientHeight } : null,
					bodyDisplay: bodyStyle ? { display: bodyStyle.display, visibility: bodyStyle.visibility, opacity: bodyStyle.opacity, background: bodyStyle.backgroundColor } : null,
					firstChild: first ? { tag: first.tagName, id: first.id, class: first.className, style: first.getAttribute ? first.getAttribute('style') : null } : null,
					firstRect: first ? first.getBoundingClientRect().toJSON() : null,
					firstDisplay: firstStyle ? { display: firstStyle.display, visibility: firstStyle.visibility, opacity: firstStyle.opacity, background: firstStyle.backgroundColor } : null,
					headChildren: head ? head.childElementCount : null,
					nextDataSize: nextData && nextData.textContent ? nextData.textContent.length : null,
					scriptCount: scriptCount,
					textSample: body && body.innerText ? body.innerText.slice(0, 160) : ''
				}, 'H1');
				setTimeout(function() {
					try {
						var bodyLate = document.body;
						var firstLate = bodyLate ? bodyLate.firstElementChild : null;
						var bodyLateStyle = bodyLate ? window.getComputedStyle(bodyLate) : null;
						var firstLateStyle = firstLate ? window.getComputedStyle(firstLate) : null;
						agentLog('layout-late', {
							location: window.location ? window.location.href : null,
							bodyChildren: bodyLate ? bodyLate.childElementCount : null,
							bodyTextLen: bodyLate && bodyLate.innerText ? bodyLate.innerText.length : null,
							firstChild: firstLate ? { tag: firstLate.tagName, id: firstLate.id, class: firstLate.className } : null,
							firstDisplay: firstLateStyle ? { display: firstLateStyle.display, visibility: firstLateStyle.visibility, opacity: firstLateStyle.opacity } : null,
							bodyDisplay: bodyLateStyle ? { display: bodyLateStyle.display, visibility: bodyLateStyle.visibility, opacity: bodyLateStyle.opacity } : null
						}, 'H1');
					} catch (e) {
						agentLog('layout-late-error', { error: String(e) }, 'H1');
					}
				}, 2000);
			} catch (e) {
				agentLog('layout-stats-error', { error: String(e) }, 'H1');
			}
		});
	});
	// #endregion

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

	// Override location.assign/replace when writable; otherwise leave intact
	try {
		var origAssign = window.location.assign.bind(window.location);
		window.location.assign = function(url) {
			try {
				var proxyUrl = toProxyUrl(url);
				agentLog('location.assign', { url: url, proxy: proxyUrl }, 'H4');
				return origAssign(proxyUrl);
			} catch (e) {
				agentLog('location.assign.fallback', { url: url, error: String(e) }, 'H4');
				return origAssign(url);
			}
		};
	} catch (e) {
		// location.assign not writable in some contexts; ignore
	}

	try {
		var origReplace = window.location.replace.bind(window.location);
		window.location.replace = function(url) {
			try {
				var proxyUrl = toProxyUrl(url);
				agentLog('location.replace', { url: url, proxy: proxyUrl }, 'H4');
				return origReplace(proxyUrl);
			} catch (e) {
				agentLog('location.replace.fallback', { url: url, error: String(e) }, 'H4');
				return origReplace(url);
			}
		};
	} catch (e) {
		// location.replace not writable; ignore
	}

	// #region agent log
	window.addEventListener('error', function(evt) {
		agentLog('window.error', { message: evt.message, filename: evt.filename, lineno: evt.lineno, colno: evt.colno }, 'H5');
	});
	window.addEventListener('unhandledrejection', function(evt) {
		agentLog('unhandledrejection', { reason: String(evt.reason) }, 'H5');
	});

	function watchScript(el) {
		if (!el || el.__watched) return;
		el.__watched = true;
		var src = el.getAttribute('src');
		var info = { src: src, type: el.getAttribute('type'), async: el.async, defer: el.defer, module: el.getAttribute('type') === 'module' };
		el.addEventListener('load', function() { agentLog('script-load', info, 'H2'); }, { once: true });
		el.addEventListener('error', function(ev) { agentLog('script-error', { ...info, error: ev && ev.message }, 'H2'); }, { once: true });
	}
	Array.prototype.forEach.call(document.scripts || [], watchScript);
	new MutationObserver(function(muts) {
		muts.forEach(function(m) {
			m.addedNodes.forEach(function(node) {
				if (node.tagName === 'SCRIPT') watchScript(node);
			});
		});
	}).observe(document.documentElement, { childList: true, subtree: true });
	// #endregion

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

		// Route asset/script/style URLs for the target host through the proxy to avoid CORS/frame issues
		const proxyAsset = (url: string) =>
			`${_proxyBase}${encodeURIComponent(url)}&viewport=${viewportWidth}&type=asset`;

		// Absolute URLs to target host
		const targetHostPattern = baseUrl.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
		html = html.replace(
			new RegExp(`(href|src)=["'](${targetHostPattern}[^"'>\\s]+)["']`, "gi"),
			(_, attr, url) => `${attr}="${proxyAsset(url)}"`
		);

		// Root-relative URLs
		html = html.replace(
			/(href|src)=["'](\/[^"'<>\\s]+)["']/gi,
			(_, attr, path) => `${attr}="${proxyAsset(baseUrl + path)}"`
		);

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

		// Rewrite inline references to Next.js chunk paths in serialized flight data / scripts
		html = html.replace(/\/_next\/static\/[^"'<>\\s)]+/g, (match) => {
			if (match.startsWith("/api/proxy-site")) return match;
			return proxyAsset(baseUrl + match);
		});

		// Ensure base tag stays pointed at the target origin (not proxied)
		html = html.replace(
			/<base[^>]*href=["'][^"']*["'][^>]*>/i,
			`<base href="${baseUrl}/" target="_self">`
		);

		// Return modified HTML with permissive headers
		void agentLog(
			"html:rewrite:success",
			{
				target: targetUrl.toString(),
				viewportWidth,
				contentLength: html.length,
				contentType,
			scriptCountAfter: (html.match(/<script/gi) || []).length,
			linkCountAfter: (html.match(/<link/gi) || []).length,
			imgCountAfter: (html.match(/<img/gi) || []).length,
			styleCountAfter: (html.match(/<style/gi) || []).length,
			hasBaseAfter: /<base[^>]*>/i.test(html),
			},
			"H4"
		);
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
		void agentLog(
			"proxy:error",
			{
				error: error instanceof Error ? error.message : "Unknown error",
				url: request.url,
			},
			"H5"
		);
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
