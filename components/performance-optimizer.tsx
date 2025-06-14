"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PerformanceOptimizerProps {
	prefetchRoutes?: string[];
	enableResourceHints?: boolean;
	enableLazyLoading?: boolean;
}

export function PerformanceOptimizer({ prefetchRoutes = ["/portfolio", "/contact", "/resume"], enableResourceHints = true, enableLazyLoading = true }: PerformanceOptimizerProps) {
	const router = useRouter();

	useEffect(() => {
		// Prefetch critical routes on idle
		if ("requestIdleCallback" in window) {
			window.requestIdleCallback(() => {
				prefetchRoutes.forEach((route) => {
					router.prefetch(route);
				});
			});
		} else {
			// Fallback for browsers without requestIdleCallback
			setTimeout(() => {
				prefetchRoutes.forEach((route) => {
					router.prefetch(route);
				});
			}, 2000);
		}

		// Add resource hints
		if (enableResourceHints) {
			const head = document.head;

			// DNS prefetch for external domains
			const dnsPrefetchDomains = ["api.github.com", "api.dribbble.com", "api.figma.com", "fonts.googleapis.com", "fonts.gstatic.com"];

			dnsPrefetchDomains.forEach((domain) => {
				const link = document.createElement("link");
				link.rel = "dns-prefetch";
				link.href = `//${domain}`;
				head.appendChild(link);
			});

			// Preconnect to critical origins
			const preconnectDomains = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];

			preconnectDomains.forEach((domain) => {
				const link = document.createElement("link");
				link.rel = "preconnect";
				link.href = domain;
				link.crossOrigin = "anonymous";
				head.appendChild(link);
			});
		}

		// Enable lazy loading for images
		if (enableLazyLoading && "IntersectionObserver" in window) {
			const images = document.querySelectorAll("img[data-src]");
			const imageObserver = new IntersectionObserver((entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target as HTMLImageElement;
						img.src = img.dataset.src!;
						img.classList.remove("lazy");
						imageObserver.unobserve(img);
					}
				});
			});

			images.forEach((img) => imageObserver.observe(img));
		}

		// Optimize third-party scripts
		const optimizeThirdPartyScripts = () => {
			// Delay non-critical scripts
			const scripts = document.querySelectorAll("script[data-delay]");
			scripts.forEach((script) => {
				const delayedScript = document.createElement("script");
				delayedScript.src = script.getAttribute("data-delay")!;
				delayedScript.async = true;
				document.head.appendChild(delayedScript);
			});
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
