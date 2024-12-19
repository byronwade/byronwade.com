import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AnalysisDetailContent from "@/components/analysis/analysis-detail-content";

export default async function AnalysisDetailPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<AnalysisDetailContent />
		</Suspense>
	);
}
