"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PerformanceOptimizerProps {
	prefetchRoutes?: string[];
	enableResourceHints?: boolean;
	enableLazyLoading?: boolean;
}

export function PerformanceOptimizer({
	prefetchRoutes = ["/portfolio", "/contact", "/resume"],
	enableResourceHints = true,
	enableLazyLoading = true,
}: PerformanceOptimizerProps) {
	const router = useRouter();

	useEffect(() => {
		// Prefetch critical routes on idle
		if ("requestIdleCallback" in window) {
			window.requestIdleCallback(() => {
				for (const route of prefetchRoutes) {
					router.prefetch(route);
				}
			});
		} else {
			// Fallback for browsers without requestIdleCallback
			setTimeout(() => {
				for (const route of prefetchRoutes) {
					router.prefetch(route);
				}
			}, 2000);
		}

		// Add resource hints
		if (enableResourceHints) {
			const head = document.head;

			// DNS prefetch for external domains
			const dnsPrefetchDomains = [
				"api.github.com",
				"api.dribbble.com",
				"api.figma.com",
				"fonts.googleapis.com",
				"fonts.gstatic.com",
			];

			for (const domain of dnsPrefetchDomains) {
				const link = document.createElement("link");
				link.rel = "dns-prefetch";
				link.href = `//${domain}`;
				head.appendChild(link);
			}

			// Preconnect to critical origins
			const preconnectDomains = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];

			for (const domain of preconnectDomains) {
				const link = document.createElement("link");
				link.rel = "preconnect";
				link.href = domain;
				link.crossOrigin = "anonymous";
				head.appendChild(link);
			}
		}

		// Enable lazy loading for images
		if (enableLazyLoading && "IntersectionObserver" in window) {
			const images = document.querySelectorAll("img[data-src]");
			const imageObserver = new IntersectionObserver((entries, _observer) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const img = entry.target as HTMLImageElement;
						const dataSrc = img.dataset.src;
						if (dataSrc) {
							img.src = dataSrc;
							img.classList.remove("lazy");
							imageObserver.unobserve(img);
						}
					}
				}
			});

			for (const img of images) {
				imageObserver.observe(img);
			}
		}

		// Optimize third-party scripts
		const optimizeThirdPartyScripts = () => {
			// Delay non-critical scripts
			const scripts = document.querySelectorAll("script[data-delay]");
			for (const script of scripts) {
				const delaySrc = script.getAttribute("data-delay");
				if (delaySrc) {
					const delayedScript = document.createElement("script");
					delayedScript.src = delaySrc;
					delayedScript.async = true;
					document.head.appendChild(delayedScript);
				}
			}
		};

		// Run optimization after page load
		if (document.readyState === "complete") {
			optimizeThirdPartyScripts();
		} else {
			window.addEventListener("load", optimizeThirdPartyScripts);
		}

		// Preload critical resources on hover
		const handleLinkHover = (e: Event) => {
			const target = e.target as HTMLAnchorElement;
			if (target.tagName === "A" && target.href) {
				const url = new URL(target.href);
				if (url.origin === window.location.origin) {
					router.prefetch(url.pathname);
				}
			}
		};

		document.addEventListener("mouseover", handleLinkHover);

		return () => {
			document.removeEventListener("mouseover", handleLinkHover);
		};
	}, [router, prefetchRoutes, enableResourceHints, enableLazyLoading]);

	return null;
}
