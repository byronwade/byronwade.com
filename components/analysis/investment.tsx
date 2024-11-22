"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InvestmentProps {
	mainFeatures: string[];
	monthlyServices: { feature: string }[];
	addOns: {
		title: string;
		price: string;
		features: string[];
		description: string;
	}[];
}

export default function Investment({ mainFeatures, monthlyServices, addOns }: InvestmentProps) {
	return (
		<section id="investment" className="max-w-screen-2xl mx-auto px-4 py-12 space-y-16">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">Investment Options</h1>
				<p className="text-xl text-muted-foreground">Choose the perfect plan for your business</p>
			</div>

			<section className="space-y-8">
				<h2 className="text-3xl font-bold">Complete Website Package</h2>
				<Card className="border-2 border-primary">
					<CardHeader>
						<div className="flex items-baseline justify-between">
							<div>
								<CardTitle className="text-2xl">Premium Website Solution</CardTitle>
								<CardDescription>Everything you need to get started</CardDescription>
							</div>
							<div className="text-right">
								<div className="text-4xl font-bold">$4,999</div>
								<div className="text-sm text-muted-foreground">one-time payment</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<h3 className="font-semibold">Included Features:</h3>
							<ul className="grid gap-3 sm:grid-cols-2">
								{mainFeatures.map((feature) => (
									<li key={feature} className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">{feature}</span>
									</li>
								))}
							</ul>
						</div>
						<Button className="w-full" size="lg">
							Get Started
						</Button>
					</CardContent>
				</Card>
			</section>

			<section className="space-y-8">
				<h2 className="text-3xl font-bold">Monthly Maintenance & Hosting</h2>
				<Card>
					<CardHeader>
						<div className="flex items-baseline justify-between">
							<div>
								<CardTitle className="text-2xl">Essential Care Package</CardTitle>
								<CardDescription>Keep your website running smoothly</CardDescription>
							</div>
							<div className="text-right">
								<div className="text-4xl font-bold">$199</div>
								<div className="text-sm text-muted-foreground">per month</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<h3 className="font-semibold">Services Included:</h3>
							<ul className="grid gap-3 sm:grid-cols-2">
								{monthlyServices.map((service) => (
									<li key={service.feature} className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">{service.feature}</span>
									</li>
								))}
							</ul>
						</div>
						<Button className="w-full" size="lg">
							Subscribe Now
						</Button>
					</CardContent>
				</Card>
			</section>

			<section className="space-y-8">
				<h2 className="text-3xl font-bold">Additional Features & Services</h2>
				<div className="grid gap-8 md:grid-cols-3">
					{addOns.map((addon) => (
						<Card key={addon.title}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										{addon.title}
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger>
													<Info className="h-4 w-4 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p className="max-w-xs">{addon.description}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</CardTitle>
								</div>
								<CardDescription>
									<span className="text-2xl font-bold">{addon.price}</span>
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{addon.features.map((feature) => (
										<li key={feature} className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											<span className="text-sm">{feature}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="space-y-8">
				<h2 className="text-3xl font-bold">Custom Development</h2>
				<Card>
					<CardHeader>
						<CardTitle>Need Something Specific?</CardTitle>
						<CardDescription>Let&apos;s build the perfect solution for your business</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8">
						<div className="grid gap-8 md:grid-cols-2">
							<div className="space-y-4">
								<h3 className="font-semibold">Custom Feature Development</h3>
								<ul className="space-y-2">
									<li className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Custom API integrations from $1,499</span>
									</li>
									<li className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Advanced search functionality from $999</span>
									</li>
									<li className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Custom database solutions from $2,499</span>
									</li>
								</ul>
							</div>
							<div className="space-y-4">
								<h3 className="font-semibold">Additional Support Options</h3>
								<ul className="space-y-2">
									<li className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Priority support: +$99/month</span>
									</li>
									<li className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">24/7 emergency support: +$199/month</span>
									</li>
									<li className="flex items-center gap-2">
										<Check className="h-4 w-4 text-primary" />
										<span className="text-sm">Additional content updates: +$149/month</span>
									</li>
								</ul>
							</div>
						</div>
						<div className="bg-muted rounded-lg p-4">
							<p className="text-sm text-muted-foreground">All prices are in USD. Custom development projects are quoted based on specific requirements and complexity. Contact us for a detailed quote tailored to your needs.</p>
						</div>
					</CardContent>
				</Card>
			</section>
		</section>
	);
}
