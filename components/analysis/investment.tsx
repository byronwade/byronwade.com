"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface InvestmentProps {
	data: {
		mainFeatures: string[];
		monthlyServices: {
			feature: string;
			included: boolean;
		}[];
		addOns: {
			title: string;
			description: string;
			price: string;
			features: string[];
		}[];
	};
}

export default function Investment({ data }: InvestmentProps) {
	const { mainFeatures, monthlyServices, addOns } = data;

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<section className="py-12">
			<motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="space-y-8">
				<div className="text-center space-y-4">
					<h2 className="text-3xl font-bold">Investment Overview</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">A comprehensive breakdown of our service offerings and investment options tailored to deliver maximum value and ROI.</p>
				</div>

				<motion.div variants={itemVariants} className="grid gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Core Features</CardTitle>
							<CardDescription>Essential features included in our base package</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{mainFeatures.map((feature, index) => (
									<motion.li key={index} variants={itemVariants} className="flex items-center gap-2">
										<Check className="h-5 w-5 text-green-500" />
										<span>{feature}</span>
									</motion.li>
								))}
							</ul>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants} className="grid gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Monthly Services</CardTitle>
							<CardDescription>Ongoing support and maintenance services</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{monthlyServices.map((service, index) => (
									<motion.li key={index} variants={itemVariants} className="flex items-center gap-2">
										<Check className="h-5 w-5 text-green-500" />
										<span>{service.feature}</span>
										{service.included && <Badge variant="secondary">Included</Badge>}
									</motion.li>
								))}
							</ul>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3">
					{addOns.map((addon, index) => (
						<Card key={index} className="relative overflow-hidden">
							<CardHeader>
								<CardTitle>{addon.title}</CardTitle>
								<CardDescription>{addon.description}</CardDescription>
								<div className="absolute top-4 right-4">
									<Badge variant="secondary">{addon.price}</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{addon.features.map((feature, featureIndex) => (
										<motion.li key={featureIndex} variants={itemVariants} className="flex items-center gap-2">
											<Check className="h-4 w-4 text-green-500" />
											<span className="text-sm">{feature}</span>
										</motion.li>
									))}
								</ul>
							</CardContent>
						</Card>
					))}
				</motion.div>
			</motion.div>
		</section>
	);
}
