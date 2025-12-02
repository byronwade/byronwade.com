"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

interface WebVitalMetric {
	name: string;
	value: number;
	rating: "good" | "needs-improvement" | "poor";
	attribution?: any;
}

/**
 * Performance Monitor Component
 *
 * Works alongside Vercel Speed Insights to track Core Web Vitals.
 * Speed Insights automatically tracks metrics, but this component provides:
 * - Additional analytics event tracking via Vercel Analytics
 * - Local development logging
 * - Custom metric tracking
 */
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

			// Send to Vercel Analytics for custom tracking
			// Note: Speed Insights handles its own tracking automatically
			if (process.env.NODE_ENV === "production") {
				try {
					track("web_vital", {
						name: metric.name,
						value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
						rating: metric.rating,
					});
				} catch (error) {
					// Silently fail (e.g., ad blockers)
					if (process.env.NODE_ENV !== "production") {
						console.error("Failed to track web vital:", error);
					}
				}
			}
		};

		// Dynamically import web-vitals to avoid bundle size impact
		// This works alongside Speed Insights which tracks automatically
		import("web-vitals")
			.then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
				// Measure Core Web Vitals
				// Speed Insights also tracks these automatically, but we track them
				// here for additional analytics visibility
				onCLS(sendToAnalytics);
				onFCP(sendToAnalytics);
				onLCP(sendToAnalytics);
				onTTFB(sendToAnalytics);
				onINP(sendToAnalytics);
			})
			.catch(() => {
				// Silently fail if web-vitals is not available
				if (process.env.NODE_ENV === "development") {
					console.warn("Web Vitals monitoring failed to load");
				}
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

		// Send to Vercel Analytics in production
		if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
			try {
				track("custom_performance_metric", {
					metric_name: name,
					value: Math.round(value),
					unit,
				});
			} catch (error) {
				// Silently fail (e.g., ad blockers)
				if (process.env.NODE_ENV !== "production") {
					console.error("Failed to track custom metric:", error);
				}
			}
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
