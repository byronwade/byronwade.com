"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart, Smartphone, Zap } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyses } from "@/lib/analysis-data";

const AnalysisCard = ({ analysis }: { analysis: (typeof analyses)[0] }) => {
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<Card className="h-full flex flex-col overflow-hidden group">
				<div className="relative overflow-hidden">
					<Image src={analysis.imageUrl} alt={analysis.title} width={800} height={600} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
				</div>
				<CardHeader>
					<CardTitle className="text-xl font-bold">{analysis.title}</CardTitle>
				</CardHeader>
				<CardContent className="flex-grow">
					<p className="text-muted-foreground mb-4">{analysis.description}</p>
					<div className="flex flex-wrap gap-2">
						{analysis.tags.map((tag) => (
							<span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
								{tag}
							</span>
						))}
					</div>
				</CardContent>
				<CardFooter>
					<Button asChild variant="ghost" size="sm" className="w-full justify-center">
						<Link href={`/analysis/${analysis.slug}`}>
							View Analysis
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
};

export default function AnalysisContent() {
	return (
		<div className="container mx-auto px-4 py-24">
			<div className="text-center mb-16">
				<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Case Studies & Analysis</h1>
				<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Discover the impact of strategic development and design on real-world projects. Here are some of my success stories.</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{analyses.map((analysis) => (
					<AnalysisCard key={analysis.id} analysis={analysis} />
				))}
			</div>
		</div>
	);
}
