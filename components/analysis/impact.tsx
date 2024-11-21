import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { benchmarks, calculateImprovement } from "@/actions/analysis/get-analytics";
import { useMemo } from "react";

export default function Impact() {
	const metrics = useMemo(
		() => [
			{
				title: "Bounce Rate",
				value: `-${benchmarks.bounceRate.industry - benchmarks.bounceRate.optimized}%`,
				trend: "decrease" as const,
			},
			{
				title: "Conversion Rate",
				value: `+${calculateImprovement(benchmarks.conversionRate.industry, benchmarks.conversionRate.optimized)}`,
				trend: "increase" as const,
			},
			{
				title: "Organic Traffic",
				value: `+${benchmarks.organicTrafficIncrease}%`,
				trend: "increase" as const,
			},
			{
				title: "Mobile Score",
				value: `+${calculateImprovement(benchmarks.mobileScore.industry, benchmarks.mobileScore.optimized)}`,
				trend: "increase" as const,
			},
		],
		[]
	);

	return (
		<section id="impact" className="scroll-mt-28">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Business Impact</CardTitle>
					<CardDescription>Measurable improvements in key business metrics</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{metrics.map((metric) => (
							<MetricCard key={metric.title} title={metric.title} value={metric.value} trend={metric.trend} />
						))}
					</div>
				</CardContent>
			</Card>
		</section>
	);
}

function MetricCard({ title, value, trend }: { title: string; value: string; trend: "increase" | "decrease" }) {
	return (
		<div className="p-4 border rounded-lg">
			<div className="text-sm text-muted-foreground mb-1">{title}</div>
			<div className="text-2xl font-bold">{value}</div>
			<div className={trend === "increase" ? "text-green-600" : "text-red-600"}>{trend === "increase" ? "Increase" : "Decrease"}</div>
		</div>
	);
}
