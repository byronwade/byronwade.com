import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { showAnalysis, pageFlags } from "@/lib/feature-flags";
import { notFound } from "next/navigation";

async function AnalysisContent() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-4">Analysis</h1>
					<p className="text-muted-foreground">Detailed analysis and insights about your website's performance.</p>
				</div>

				{/* Add your analysis components here */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{/* Example cards - replace with actual analysis components */}
					<div className="p-6 rounded-lg border bg-card">
						<h2 className="text-xl font-semibold mb-2">Performance Metrics</h2>
						<p className="text-muted-foreground">View detailed performance metrics and insights.</p>
					</div>
					<div className="p-6 rounded-lg border bg-card">
						<h2 className="text-xl font-semibold mb-2">SEO Analysis</h2>
						<p className="text-muted-foreground">Check your website's SEO performance and recommendations.</p>
					</div>
					<div className="p-6 rounded-lg border bg-card">
						<h2 className="text-xl font-semibold mb-2">User Behavior</h2>
						<p className="text-muted-foreground">Understand how users interact with your website.</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default async function AnalysisPage({ params: { code } }: { params: { code: string } }) {
	// Check if analysis feature is enabled
	const isEnabled = await showAnalysis(code, pageFlags);
	if (!isEnabled) {
		notFound();
	}

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<AnalysisContent />
		</Suspense>
	);
}

export const generateMetadata = async ({ params: { code } }: { params: { code: string } }) => {
	// Check if analysis feature is enabled for metadata
	const isEnabled = await showAnalysis(code, pageFlags);
	if (!isEnabled) {
		return {};
	}

	return {
		title: "Analysis | Byron Wade",
		description: "Detailed analysis and insights about your website's performance",
		openGraph: {
			title: "Analysis | Byron Wade",
			description: "Detailed analysis and insights about your website's performance",
			type: "website",
		},
	};
};
