"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Zap, Search, LayoutGrid, Smartphone } from "lucide-react";

const fadeIn = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

interface OverviewProps {
	stats: {
		label: string;
		industryValue: number;
		optimizedValue: number;
		improvement: number;
		iconName: "clock" | "zap" | "search" | "layout" | "smartphone";
	}[];
}

const IconMap = {
	clock: Clock,
	zap: Zap,
	search: Search,
	layout: LayoutGrid,
	smartphone: Smartphone,
};

export default function Overview({ stats }: OverviewProps) {
	return (
		<section id="overview" className="scroll-mt-28">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Project Overview</CardTitle>
					<CardDescription>A comprehensive analysis of website transformation</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						{stats.map((stat, index) => {
							const Icon = IconMap[stat.iconName];
							return (
								<motion.div
									key={stat.label}
									initial="hidden"
									animate="visible"
									variants={fadeIn}
									transition={{ delay: index * 0.1 }}
									style={{
										display: "grid",
										gridTemplateColumns: "1fr auto 1fr",
										gap: "1rem",
										alignItems: "center",
									}}
								>
									<div className="flex items-center gap-2">
										<Icon className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="font-medium">{stat.label}</p>
											<p className="text-2xl font-bold">{stat.industryValue}</p>
											<p className="text-sm text-muted-foreground">Industry Average</p>
										</div>
									</div>
									<div className="hidden sm:block">
										<ArrowRight className="h-5 w-5 text-muted-foreground" />
									</div>
									<div className="text-right">
										<p className="font-medium">Optimized</p>
										<p className="text-2xl font-bold text-primary">{stat.optimizedValue}</p>
										<p className="text-sm text-green-600">+{stat.improvement} improvement</p>
									</div>
								</motion.div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
