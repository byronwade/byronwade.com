"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Calendar, Target, Award, Users } from "lucide-react";

interface InvestmentData {
	amount: string;
	date: string;
	valuation: string;
	stage: string;
	description: string;
	highlights: string[];
	metrics: {
		revenue: string;
		growth: string;
		team: string;
		customers: string;
	};
}

const investmentData: InvestmentData = {
	amount: "$2.5M",
	date: "March 2024",
	valuation: "$12M",
	stage: "Series A",
	description: "Leading investment in innovative tech startup revolutionizing digital infrastructure for small businesses.",
	highlights: ["AI-powered business automation platform", "100% revenue growth year-over-year", "Expanding to international markets", "Strategic partnership with industry leaders"],
	metrics: {
		revenue: "$8.2M ARR",
		growth: "156% YoY",
		team: "45 employees",
		customers: "2,500+ businesses",
	},
};

function InvestmentDetails() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<DollarSign className="h-5 w-5 text-green-600" />
								Strategic Investment
							</CardTitle>
							<CardDescription>Portfolio company performance overview</CardDescription>
						</div>
						<Badge variant="secondary" className="bg-green-100 text-green-800">
							{investmentData.stage}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center p-3 bg-muted rounded-lg">
							<div className="text-2xl font-bold text-green-600">{investmentData.amount}</div>
							<div className="text-sm text-muted-foreground">Investment Amount</div>
						</div>
						<div className="text-center p-3 bg-muted rounded-lg">
							<div className="text-2xl font-bold">{investmentData.valuation}</div>
							<div className="text-sm text-muted-foreground">Valuation</div>
						</div>
						<div className="text-center p-3 bg-muted rounded-lg">
							<div className="text-2xl font-bold flex items-center justify-center gap-1">
								<Calendar className="h-4 w-4" />
								{investmentData.date}
							</div>
							<div className="text-sm text-muted-foreground">Investment Date</div>
						</div>
						<div className="text-center p-3 bg-muted rounded-lg">
							<div className="text-2xl font-bold flex items-center justify-center gap-1">
								<TrendingUp className="h-4 w-4 text-green-600" />
								Active
							</div>
							<div className="text-sm text-muted-foreground">Status</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<InvestmentDetails />
		</div>
	);
}

export default function Investment() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-4">Investment Portfolio</h1>
					<p className="text-muted-foreground">Strategic investments in high-growth technology companies</p>
				</div>

				<InvestmentDetails />
			</div>
		</div>
	);
}
