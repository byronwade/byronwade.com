"use client";

import { useEffect } from "react";

interface WebVitalMetric {
	name: string;
	value: number;
	rating: "good" | "needs-improvement" | "poor";
	attribution?: any;
}

export function PerformanceMonitor() {
	useEffect(() => {
		// Only run when explicitly enabled or in production
		if (process.env.NODE_ENV !== "production" && !process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS) {
			return;
		}

		const sendToAnalytics = (metric: WebVitalMetric) => {
			// Log to console in development
			if (process.env.NODE_ENV === "development") {
				console.log("Web Vital:", metric);
			}

			// Send to analytics service in production
			if (process.env.NODE_ENV === "production") {
				// Example: Send to Google Analytics, Vercel Analytics, etc.
				if (typeof window !== "undefined" && "gtag" in window) {
					(window as any).gtag("event", metric.name, {
						event_category: "Web Vitals",
						event_label: metric.rating,
						value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
						non_interaction: true,
					});
				}
			}
		};

		// Dynamically import web-vitals to avoid bundle size impact
		import("web-vitals")
			.then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
				// Measure Core Web Vitals
				onCLS(sendToAnalytics);
				onFCP(sendToAnalytics);
				onLCP(sendToAnalytics);
				onTTFB(sendToAnalytics);
				onINP(sendToAnalytics);
			})
			.catch(() => {
				// Silently fail if web-vitals is not available
				console.warn("Web Vitals monitoring failed to load");
			});
	}, []);

	// This component doesn't render anything
	return null;
}

// Hook for manual performance tracking
export function usePerformanceTracking() {
	const trackCustomMetric = (name: string, value: number, unit = "ms") => {
		if (process.env.NODE_ENV === "development") {
			console.log(`Custom Metric - ${name}: ${value}${unit}`);
		}

		// Send to analytics in production
		if (process.env.NODE_ENV === "production" && typeof window !== "undefined" && "gtag" in window) {
			(window as any).gtag("event", "custom_metric", {
				event_category: "Performance",
				event_label: name,
				value: Math.round(value),
				custom_parameter_1: unit,
			});
		}
	};

	const trackPageLoad = (pageName: string) => {
		const startTime = performance.now();

		return () => {
			const loadTime = performance.now() - startTime;
			trackCustomMetric(`page_load_${pageName}`, loadTime);
		};
	};

	return {
		trackCustomMetric,
		trackPageLoad,
	};
}
