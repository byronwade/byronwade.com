"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from "@/components/charts";

interface MarketProps {
	performanceData: any[];
	conversionData: any[];
}

export default function Market({ performanceData, conversionData }: MarketProps) {
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
								<LineChart data={performanceData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line type="monotone" dataKey="industry" name="Industry Average" stroke="hsl(var(--muted-foreground))" />
									<Line type="monotone" dataKey="optimized" name="Optimized Website" stroke="hsl(var(--primary))" />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
					<div>
						<h3 className="font-semibold mb-4">Conversion Rate Comparison</h3>
						<div className="h-[300px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={conversionData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="category" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey="industry" name="Industry Average" fill="hsl(var(--muted-foreground))" />
									<Bar dataKey="optimized" name="Optimized Website" fill="hsl(var(--primary))" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
