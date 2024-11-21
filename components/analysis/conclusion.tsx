import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { benchmarks, calculateImprovement } from "@/actions/analysis/get-analytics";
import { useMemo } from "react";

export default function Conclusion() {
	const improvements = useMemo(
		() => ({
			loadTime: calculateImprovement(benchmarks.loadTime.industry, benchmarks.loadTime.optimized),
			performanceScore: calculateImprovement(benchmarks.performanceScore.industry, benchmarks.performanceScore.optimized),
			seoScore: calculateImprovement(benchmarks.seoScore.industry, benchmarks.seoScore.optimized),
			mobileScore: calculateImprovement(benchmarks.mobileScore.industry, benchmarks.mobileScore.optimized),
		}),
		[]
	);

	return (
		<section id="conclusion" className="scroll-mt-28">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Conclusion</CardTitle>
					<CardDescription>Summary of improvements and future potential</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<p className="text-muted-foreground">Our premium redesign offers exceptional improvements across all key performance indicators:</p>
						<ul className="grid gap-2">
							<TechItem text={`${improvements.loadTime} reduction in load time`} />
							<TechItem text={`${improvements.performanceScore} increase in performance score`} />
							<TechItem text={`${improvements.seoScore} improvement in SEO score`} />
							<TechItem text={`${improvements.mobileScore} boost in mobile responsiveness`} />
						</ul>
					</div>
					<div className="bg-muted rounded-lg p-4">
						<p className="font-semibold mb-2">Potential ROI:</p>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>• {benchmarks.organicTrafficIncrease}% potential growth in organic traffic</li>
							<li>• Estimated 20-30% increase in customer satisfaction</li>
							<li>• Significant revenue increase potential from higher conversion rates</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}

function TechItem({ text }: { text: string }) {
	return (
		<li className="flex items-center gap-2">
			<CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
			<span className="text-sm text-muted-foreground">{text}</span>
		</li>
	);
}
