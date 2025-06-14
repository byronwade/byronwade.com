import { notFound } from "next/navigation";

export default async function AnalysisDetailPage({ params }: { params: { slug: string[] } }) {
	// Temporarily disabled for build optimization
	notFound();
}
