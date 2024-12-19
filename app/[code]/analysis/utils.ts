export async function getAnalyticsData() {
	const start = performance.now();
	const stats = [
		{
			label: "Load Time",
			industryValue: 4.2,
			optimizedValue: 1.8,
			improvement: 57,
			iconName: "clock" as const,
		},
		{
			label: "Performance Score",
			industryValue: 65,
			optimizedValue: 95,
			improvement: 46,
			iconName: "zap" as const,
		},
		{
			label: "SEO Score",
			industryValue: 72,
			optimizedValue: 98,
			improvement: 36,
			iconName: "search" as const,
		},
		{
			label: "Layout Shifts",
			industryValue: 0.25,
			optimizedValue: 0.05,
			improvement: 80,
			iconName: "layout" as const,
		},
		{
			label: "Mobile Score",
			industryValue: 60,
			optimizedValue: 94,
			improvement: 57,
			iconName: "smartphone" as const,
		},
	];

	const data = {
		benchmarks: {
			loadTime: { industry: 4.2, optimized: 1.8 },
			performanceScore: { industry: 65, optimized: 95 },
			seoScore: { industry: 72, optimized: 98 },
			mobileScore: { industry: 60, optimized: 94 },
			bounceRate: { industry: 55, optimized: 25 },
			conversionRate: { industry: 2.1, optimized: 4.5 },
			averageTimeOnPage: { industry: 120, optimized: 280 },
			bestPractices: { industry: 60, optimized: 95 },
			organicTrafficIncrease: 150,
		},
		stats,
		performanceData: [
			{ month: "Jan", industry: 50, optimized: 90 },
			{ month: "Feb", industry: 52, optimized: 91 },
			{ month: "Mar", industry: 51, optimized: 92 },
			{ month: "Apr", industry: 53, optimized: 93 },
			{ month: "May", industry: 52, optimized: 94 },
			{ month: "Jun", industry: 54, optimized: 95 },
		],
		conversionData: [
			{ category: "E-commerce", industry: 2.3, optimized: 3.9 },
			{ category: "Marine", industry: 2.5, optimized: 4.5 },
			{ category: "B2B", industry: 2.7, optimized: 4.8 },
		],
	};
	console.log("Cache fetch time:", performance.now() - start);
	return data;
}

export async function getTechnicalData() {
	const start = performance.now();
	const data = {
		performanceOptimizations: ["Advanced caching strategies implementation", "Image optimization with WebP format and lazy loading", "Code splitting and bundle optimization", "CDN integration for global content delivery"],
		securityEnhancements: ["SSL/TLS implementation with A+ rating", "Advanced firewall protection", "Regular security audits and monitoring", "Automated backup systems"],
	};
	console.log("Cache fetch time:", performance.now() - start);
	return data;
}

export async function getClientData() {
	const start = performance.now();
	const data = {
		name: "Impact Marine Group",
		industry: "Marine Industry",
		duration: "8 weeks",
		completionDate: "Q4 2023",
		goals: ["Increase conversions", "Reduce bounce rates", "Improve user experience"],
	};
	console.log("Cache fetch time:", performance.now() - start);
	return data;
}

export async function getInvestmentData() {
	const start = performance.now();
	const data = {
		mainFeatures: ["Fully responsive design", "SEO optimization", "Performance optimization", "Security implementation", "Analytics integration", "Content management system", "Contact forms", "Social media integration", "Basic email setup", "30-day support"],
		monthlyServices: [
			{ feature: "24/7 monitoring", included: true },
			{ feature: "Security updates", included: true },
			{ feature: "Daily backups", included: true },
			{ feature: "CDN service", included: true },
			{ feature: "SSL certificate", included: true },
			{ feature: "Database management", included: true },
			{ feature: "Performance optimization", included: true },
			{ feature: "Content updates (2/month)", included: true },
		],
		addOns: [
			{
				title: "Landing Pages",
				description: "Custom designed, high-converting landing pages",
				price: "$799",
				features: ["Conversion-optimized design", "A/B testing setup", "Analytics integration", "Lead capture forms", "Mobile optimization"],
			},
			{
				title: "E-commerce Integration",
				description: "Full e-commerce functionality",
				price: "$2,499",
				features: ["Product catalog", "Shopping cart", "Payment gateway", "Inventory management", "Order processing"],
			},
			{
				title: "Custom Features",
				description: "Tailored functionality for your business",
				price: "From $999",
				features: ["Custom database design", "API integration", "Advanced search", "User authentication", "Custom reporting"],
			},
		],
	};
	console.log("Cache fetch time:", performance.now() - start);
	return data;
}

export function calculateImprovement(industry: number, optimized: number): string {
	const improvement = ((optimized - industry) / industry) * 100;
	return `${improvement.toFixed(1)}%`;
}
