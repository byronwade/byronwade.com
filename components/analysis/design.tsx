import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { benchmarks, calculateImprovement } from "@/actions/analysis/get-analytics";

export default function Design() {
	return (
		<section id="design" className="scroll-mt-28">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Design Excellence</CardTitle>
					<CardDescription>User interface and experience improvements</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-6">
						<div className="space-y-2">
							<h3 className="font-semibold">User Interface Refinements</h3>
							<ul className="grid gap-2">
								<TechItem text="Implementation of intuitive navigation structure" />
								<TechItem text="Responsive grid layout for optimal content presentation" />
								<TechItem text="Enhanced typography for superior readability" />
								<TechItem text="Refined color contrast for accessibility excellence" />
								<TechItem text="Integration of subtle, elegant animations" />
							</ul>
						</div>
						<div className="grid sm:grid-cols-2 gap-4">
							<MetricCard title="Bounce Rate Reduction" value={`${100 - benchmarks.bounceRate.optimized}%`} trend="decrease" />
							<MetricCard title="Session Duration Increase" value={calculateImprovement(benchmarks.averageTimeOnPage.industry, benchmarks.averageTimeOnPage.optimized)} trend="increase" />
						</div>
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

function MetricCard({ title, value, trend }: { title: string; value: string; trend: "increase" | "decrease" }) {
	return (
		<div className="p-4 border rounded-lg">
			<div className="text-sm text-muted-foreground mb-1">{title}</div>
			<div className="text-2xl font-bold">{value}</div>
			<div className={trend === "increase" ? "text-green-600" : "text-red-600"}>{trend === "increase" ? "Increase" : "Decrease"}</div>
		</div>
	);
}
