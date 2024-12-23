import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AnalysisContent from "@/components/analysis/analysis-content";

export default function AnalysisPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<AnalysisContent />
		</Suspense>
	);
}
