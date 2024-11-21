import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar } from "recharts";
import dynamic from "next/dynamic";

const DynamicLineChart = dynamic<any>(() => import("recharts").then((mod) => mod.LineChart), {
	ssr: false,
	loading: () => <div className="h-[300px] animate-pulse bg-muted" />,
});

const DynamicBarChart = dynamic<any>(() => import("recharts").then((mod) => mod.BarChart), {
	ssr: false,
	loading: () => <div className="h-[300px] animate-pulse bg-muted" />,
});

export default function Market({ performanceData, conversionData }: { performanceData: any[]; conversionData: any[] }) {
	return (
		<section id="market-research" className="scroll-mt-28">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Market Research Insights</CardTitle>
					<CardDescription>Industry performance analysis and benchmarks</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8">
					<div>
						<h3 className="font-semibold mb-4">Performance Trends</h3>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<DynamicLineChart data={performanceData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line type="monotone" dataKey="industry" name="Industry Average" stroke="hsl(var(--muted-foreground))" />
									<Line type="monotone" dataKey="optimized" name="Optimized Website" stroke="hsl(var(--primary))" />
								</DynamicLineChart>
							</ResponsiveContainer>
						</div>
					</div>
					<div>
						<h3 className="font-semibold mb-4">Conversion Rate Comparison</h3>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<DynamicBarChart data={conversionData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="category" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey="industry" name="Industry Average" fill="hsl(var(--muted-foreground))" />
									<Bar dataKey="optimized" name="Optimized Website" fill="hsl(var(--primary))" />
								</DynamicBarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
