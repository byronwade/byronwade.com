"use client";

interface PerformanceMetric {
	name: string;
	value: number;
	timestamp: number;
	url: string;
}

interface WebVital {
	name: "CLS" | "FCP" | "LCP" | "TTFB" | "INP";
	value: number;
	delta: number;
	id: string;
	rating: "good" | "needs-improvement" | "poor";
}

class PerformanceMonitor {
	private metrics: PerformanceMetric[] = [];
	private webVitals: WebVital[] = [];

	constructor() {
		if (typeof window !== "undefined") {
			this.initializeWebVitals();
			this.trackNavigationTiming();
		}
	}

	private async initializeWebVitals() {
		try {
			const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import("web-vitals");

			onCLS(this.handleWebVital.bind(this));
			onFCP(this.handleWebVital.bind(this));
			onLCP(this.handleWebVital.bind(this));
			onTTFB(this.handleWebVital.bind(this));
			onINP(this.handleWebVital.bind(this));
		} catch (error) {
			console.warn("Web Vitals not available:", error);
		}
	}

	private handleWebVital(metric: WebVital) {
		this.webVitals.push(metric);
		this.reportWebVital(metric);
	}

	private reportWebVital(metric: WebVital) {
		// In production, you might want to send this to an analytics service
		if (process.env.NODE_ENV === "development") {
			console.log(`[Performance] ${metric.name}:`, {
				value: metric.value,
				rating: metric.rating,
				delta: metric.delta,
			});
		}

		// Example: Send to analytics service (replace with your preferred service)
		if (typeof window !== "undefined" && "gtag" in window) {
			// @ts-ignore
			window.gtag("event", metric.name, {
				event_category: "Web Vitals",
				value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
				event_label: metric.id,
				non_interaction: true,
			});
		}
	}

	private trackNavigationTiming() {
		if (typeof window === "undefined" || !window.performance) return;

		// Track when the page is fully loaded
		window.addEventListener("load", () => {
			setTimeout(() => {
				const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

				if (navigation) {
					this.addMetric("DOM Content Loaded", navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
					this.addMetric("Load Complete", navigation.loadEventEnd - navigation.loadEventStart);
					this.addMetric("DNS Lookup", navigation.domainLookupEnd - navigation.domainLookupStart);
					this.addMetric("TCP Connection", navigation.connectEnd - navigation.connectStart);
					this.addMetric("Server Response", navigation.responseEnd - navigation.requestStart);
					this.addMetric("DOM Processing", navigation.domComplete - navigation.responseEnd);
				}
			}, 0);
		});
	}

	public addMetric(name: string, value: number) {
		const metric: PerformanceMetric = {
			name,
			value,
			timestamp: Date.now(),
			url: typeof window !== "undefined" ? window.location.href : "",
		};

		this.metrics.push(metric);

		if (process.env.NODE_ENV === "development") {
			console.log(`[Performance] ${name}: ${value}ms`);
		}
	}

	public getMetrics(): PerformanceMetric[] {
		return [...this.metrics];
	}

	public getWebVitals(): WebVital[] {
		return [...this.webVitals];
	}

	public async measureFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
		const start = performance.now();
		try {
			const result = await fn();
			const duration = performance.now() - start;
			this.addMetric(name, duration);
			return result;
		} catch (error) {
			const duration = performance.now() - start;
			this.addMetric(`${name} (error)`, duration);
			throw error;
		}
	}

	public getPerformanceReport() {
		return {
			metrics: this.getMetrics(),
			webVitals: this.getWebVitals(),
			timestamp: new Date().toISOString(),
			url: typeof window !== "undefined" ? window.location.href : "",
		};
	}
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for React components
export function usePerformanceMonitor() {
	return performanceMonitor;
}

// Utility functions
export function trackPageView(pageName: string) {
	performanceMonitor.addMetric(`Page View: ${pageName}`, 0);
}

export function trackUserInteraction(action: string, target?: string) {
	performanceMonitor.addMetric(`User Interaction: ${action}${target ? ` (${target})` : ""}`, 0);
}
