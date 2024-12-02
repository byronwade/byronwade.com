"use client";

import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SEOProps {
	seo: string;
	benchmarks: {
		seoScore: {
			optimized: number;
		};
	};
	seoMetrics: {
		keyOptimizations: {
			title: string;
			improvement?: string;
		}[];
	};
}

export default function SEO({ seo, benchmarks, seoMetrics }: SEOProps) {
	const { keyOptimizations } = seoMetrics;

	return (
		<section id="seo" className="scroll-mt-28">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">SEO Improvements</CardTitle>
					<CardDescription>Comprehensive search engine optimization analysis</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-6">
						<div className="space-y-2">
							<h3 className="font-semibold">SEO Score Improvement</h3>
							<p className="text-sm text-muted-foreground">{seo}</p>
						</div>
						<div className="grid gap-4">
							<div className="grid gap-2">
								<div className="font-semibold">Key Optimizations</div>
								<ul className="grid gap-2">
									{keyOptimizations.map((opt, index) => (
										<TechItem key={index} text={`${opt.title}${opt.improvement ? ` (${opt.improvement} improvement)` : ""}`} />
									))}
								</ul>
							</div>
						</div>
					</div>
					<div className="bg-muted rounded-lg p-4">
						<p className="font-semibold mb-2">Industry Insight:</p>
						<p className="text-sm text-muted-foreground">
							Websites on the first page of Google search results have an average SEO score of 80-100. Our optimized score of {benchmarks.seoScore.optimized}
							puts Impact Marine Group at the top of this range.
						</p>
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
