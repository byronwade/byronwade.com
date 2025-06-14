"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { analyses, type Analysis } from "@/lib/analysis-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function AnalysisDetailContent({ slug }: { slug: string }) {
	const analysis = analyses.find((a) => a.slug === slug);

	if (!analysis) {
		notFound();
	}

	return (
		<div className="bg-background text-foreground">
			{/* Hero Section */}
			<div className="relative bg-secondary/50">
				<div className="container mx-auto px-4 py-24 sm:py-32">
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
						<div className="flex flex-wrap gap-2">
							{analysis.tags.map((tag) => (
								<Badge key={tag} variant="outline">
									{tag}
								</Badge>
							))}
						</div>
						<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mt-4">{analysis.title}</h1>
						<p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl">{analysis.longDescription}</p>
					</motion.div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
					{/* Left Column */}
					<div className="lg:col-span-2">
						{/* Gallery */}
						<div className="mb-16">
							<h2 className="text-3xl font-bold mb-8">Gallery</h2>
							<div className="grid grid-cols-1 gap-8">
								{analysis.gallery.map((src, index) => (
									<motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
										<Image src={src} alt={`${analysis.title} gallery image ${index + 1}`} width={1200} height={800} className="rounded-lg shadow-lg object-cover" />
									</motion.div>
								))}
							</div>
						</div>

						<Separator className="my-16" />

						{/* Project Deep Dive */}
						<div>
							<h2 className="text-3xl font-bold mb-8">Case Study Details</h2>
							<div className="space-y-12">
								<div>
									<h3 className="text-2xl font-semibold mb-4 text-primary">The Problem</h3>
									<p className="text-lg text-muted-foreground leading-relaxed">{analysis.problem}</p>
								</div>
								<div>
									<h3 className="text-2xl font-semibold mb-4 text-primary">The Solution</h3>
									<p className="text-lg text-muted-foreground leading-relaxed">{analysis.solution}</p>
								</div>
								<div>
									<h3 className="text-2xl font-semibold mb-4 text-primary">The Outcome</h3>
									<p className="text-lg text-muted-foreground leading-relaxed">{analysis.outcome}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column (Sidebar) */}
					<aside>
						<div className="sticky top-24 space-y-12">
							{/* Key Metrics */}
							<div>
								<h3 className="text-2xl font-semibold mb-4">Key Metrics</h3>
								<div className="space-y-4">
									{analysis.keyMetrics.map((metric) => (
										<Card key={metric.label}>
											<CardHeader className="pb-2">
												<CardTitle className="text-lg">{metric.label}</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="flex items-baseline gap-2">
													<p className="text-3xl font-bold">{metric.value}</p>
													<div className={`flex items-center text-sm font-semibold ${metric.improvement.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
														{metric.improvement.startsWith("+") ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
														{metric.improvement}
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
