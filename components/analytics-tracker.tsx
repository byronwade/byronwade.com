"use client";

import { analytics } from "@/lib/analytics";
import { useEffect } from "react";

interface ProjectViewTrackerProps {
	slug: string;
	title: string;
}

/**
 * Track project view when component mounts
 */
export function ProjectViewTracker({ slug, title }: ProjectViewTrackerProps) {
	useEffect(() => {
		analytics.projectView(slug, title);
	}, [slug, title]);

	return null;
}

interface BlogPostViewTrackerProps {
	slug: string;
	title: string;
}

/**
 * Track blog post view when component mounts
 */
export function BlogPostViewTracker({ slug, title }: BlogPostViewTrackerProps) {
	useEffect(() => {
		analytics.blogPostView(slug, title);
	}, [slug, title]);

	return null;
}
