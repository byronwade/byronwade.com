export const investmentData = {
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
} as const;
