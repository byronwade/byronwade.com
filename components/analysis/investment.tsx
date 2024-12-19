"use client";

import { Suspense } from "react";
import { investmentData } from "@/lib/investment-data";

interface InvestmentProps {
	mainFeatures?: ReadonlyArray<string>;
	monthlyServices?: ReadonlyArray<{
		feature: string;
		included: boolean;
	}>;
	addOns?: ReadonlyArray<{
		title: string;
		description: string;
		price: string;
		features: ReadonlyArray<string>;
	}>;
}

function InvestmentContent({ mainFeatures = investmentData.mainFeatures, monthlyServices = investmentData.monthlyServices, addOns = investmentData.addOns }: InvestmentProps) {
	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-3xl font-bold mb-4">Investment Details</h2>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold mb-4">Main Features</h3>
						<ul className="space-y-2">
							{mainFeatures.map((feature, index) => (
								<li key={index} className="flex items-center text-sm">
									<span className="mr-2">✓</span>
									{feature}
								</li>
							))}
						</ul>
					</div>

					<div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold mb-4">Monthly Services</h3>
						<ul className="space-y-2">
							{monthlyServices.map((service, index) => (
								<li key={index} className="flex items-center text-sm">
									<span className="mr-2">{service.included ? "✓" : "✗"}</span>
									{service.feature}
								</li>
							))}
						</ul>
					</div>

					<div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
						<h3 className="text-xl font-semibold mb-4">Add-Ons</h3>
						<div className="space-y-4">
							{addOns.map((addon, index) => (
								<div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
									<h4 className="font-semibold">{addon.title}</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{addon.description}</p>
									<p className="text-lg font-bold mt-2">{addon.price}</p>
									<ul className="mt-2 space-y-1">
										{addon.features.map((feature, featureIndex) => (
											<li key={featureIndex} className="text-sm flex items-center">
												<span className="mr-2">•</span>
												{feature}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Investment(props: InvestmentProps) {
	return (
		<Suspense fallback={<div>Loading investment details...</div>}>
			<InvestmentContent {...props} />
		</Suspense>
	);
}
