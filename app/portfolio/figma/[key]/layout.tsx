import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isFigmaFileKey } from "@/lib/portfolio-data";

interface FigmaFileLayoutProps {
	children: ReactNode;
	params: Promise<{ key: string }>;
}

/**
 * Rejects a malformed file key above `loading.tsx`. The loading boundary
 * streams a 200 shell before the page renders, so a `notFound()` in the page
 * arrives too late to set the status: the URL became a soft 404. Thrown here,
 * before any boundary, it is a real 404. Awaits only the params, never the
 * Figma request, so a valid key still shows the skeleton at once.
 */
export default async function FigmaFileLayout({ children, params }: FigmaFileLayoutProps) {
	const { key } = await params;
	if (!isFigmaFileKey(key)) {
		notFound();
	}
	return children;
}
