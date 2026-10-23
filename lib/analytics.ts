"use client";

import { track } from "@vercel/analytics";

/**
 * Portfolio-specific event types for analytics tracking
 */
type AnalyticsEvent =
	| { name: "project_view"; properties: { projectSlug: string; projectTitle: string } }
	| { name: "blog_post_view"; properties: { postSlug: string; postTitle: string } }
	| { name: "resume_download"; properties: { format?: string } };

/**
 * Track a custom analytics event
 * @param event - The event to track with name and properties
 */
function trackEvent(event: AnalyticsEvent): void {
	if (typeof window === "undefined") {
		return;
	}

	try {
		track(event.name, event.properties);
	} catch (error) {
		// Silently fail in case of errors (e.g., ad blockers)
		if (process.env.NODE_ENV === "development") {
			console.error("Analytics tracking error:", error);
		}
	}
}

/**
 * Convenience functions for common portfolio events
 */
export const analytics = {
	/**
	 * Track when a user views a project
	 */
	projectView: (slug: string, title: string) => {
		trackEvent({ name: "project_view", properties: { projectSlug: slug, projectTitle: title } });
	},

	/**
	 * Track when a user views a blog post
	 */
	blogPostView: (slug: string, title: string) => {
		trackEvent({ name: "blog_post_view", properties: { postSlug: slug, postTitle: title } });
	},

	/**
	 * Track when a user downloads the resume
	 */
	resumeDownload: (format = "pdf") => {
		trackEvent({ name: "resume_download", properties: { format } });
	},
};
