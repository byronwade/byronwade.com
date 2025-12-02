"use client";

import { track } from "@vercel/analytics";

/**
 * Portfolio-specific event types for analytics tracking
 */
export type AnalyticsEvent =
	| { name: "project_view"; properties: { projectSlug: string; projectTitle: string } }
	| {
			name: "project_click";
			properties: { projectSlug: string; projectTitle: string; projectUrl?: string };
	  }
	| { name: "blog_post_view"; properties: { postSlug: string; postTitle: string } }
	| {
			name: "blog_post_read";
			properties: { postSlug: string; postTitle: string; readTime?: number };
	  }
	| { name: "resume_download"; properties: { format?: string } }
	| { name: "external_link_click"; properties: { url: string; linkText?: string } }
	| { name: "contact_form_submit"; properties: { formType?: string } }
	| { name: "search_performed"; properties: { query: string; resultsCount?: number } }
	| { name: "social_link_click"; properties: { platform: string; url: string } }
	| { name: "navigation"; properties: { from: string; to: string } };

/**
 * Track a custom analytics event
 * @param event - The event to track with name and properties
 */
export function trackEvent(event: AnalyticsEvent): void {
	if (typeof window === "undefined") return;

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
 * Track a page view manually (usually handled automatically by Analytics component)
 * @param pathname - The pathname of the page
 */
export function trackPageView(pathname: string): void {
	if (typeof window === "undefined") return;

	try {
		track("page_view", { pathname });
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Page view tracking error:", error);
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
	 * Track when a user clicks on a project
	 */
	projectClick: (slug: string, title: string, url?: string) => {
		trackEvent({
			name: "project_click",
			properties: { projectSlug: slug, projectTitle: title, projectUrl: url },
		});
	},

	/**
	 * Track when a user views a blog post
	 */
	blogPostView: (slug: string, title: string) => {
		trackEvent({ name: "blog_post_view", properties: { postSlug: slug, postTitle: title } });
	},

	/**
	 * Track when a user reads a blog post (e.g., scrolled to bottom)
	 */
	blogPostRead: (slug: string, title: string, readTime?: number) => {
		trackEvent({
			name: "blog_post_read",
			properties: { postSlug: slug, postTitle: title, readTime },
		});
	},

	/**
	 * Track when a user downloads the resume
	 */
	resumeDownload: (format = "pdf") => {
		trackEvent({ name: "resume_download", properties: { format } });
	},

	/**
	 * Track when a user clicks an external link
	 */
	externalLinkClick: (url: string, linkText?: string) => {
		trackEvent({ name: "external_link_click", properties: { url, linkText } });
	},

	/**
	 * Track when a user submits a contact form
	 */
	contactFormSubmit: (formType?: string) => {
		trackEvent({ name: "contact_form_submit", properties: { formType } });
	},

	/**
	 * Track when a user performs a search
	 */
	searchPerformed: (query: string, resultsCount?: number) => {
		trackEvent({ name: "search_performed", properties: { query, resultsCount } });
	},

	/**
	 * Track when a user clicks a social media link
	 */
	socialLinkClick: (platform: string, url: string) => {
		trackEvent({ name: "social_link_click", properties: { platform, url } });
	},

	/**
	 * Track navigation between pages
	 */
	navigation: (from: string, to: string) => {
		trackEvent({ name: "navigation", properties: { from, to } });
	},
};
