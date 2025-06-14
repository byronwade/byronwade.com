export interface Analysis {
	id: number;
	slug: string;
	title: string;
	description: string;
	longDescription: string;
	imageUrl: string;
	tags: string[];
	stats: { label: string; value: string; icon: any }[];
	problem: string;
	solution: string;
	outcome: string;
	keyMetrics: {
		label: string;
		value: string;
		improvement: string;
	}[];
	gallery: string[];
}

export const analyses: Analysis[] = [
	{
		id: 1,
		slug: "e-commerce-performance-boost",
		title: "E-commerce Performance Boost",
		description: "An in-depth analysis of how we increased page load speed by 70% and boosted SEO rankings to the first page for a major online retailer.",
		longDescription: "This case study examines the performance optimization of a high-traffic e-commerce website. The project focused on improving page load times, enhancing user experience, and boosting search engine rankings to drive sales.",
		imageUrl: "https://placehold.co/800x600/1a1a1a/ffffff",
		tags: ["Performance", "SEO", "E-commerce"],
		stats: [],
		problem: "The client's website was suffering from slow load times, a high bounce rate, and poor search engine visibility, which negatively impacted sales and customer satisfaction.",
		solution: "I conducted a comprehensive performance audit and implemented a series of optimizations, including server-side rendering, image optimization, code splitting, and leveraging a CDN. I also performed an in-depth SEO analysis and implemented on-page and technical SEO best practices.",
		outcome: "The optimizations resulted in a 70% reduction in page load time, a 50% decrease in bounce rate, and a top-3 ranking on Google for key search terms. This led to a 40% increase in organic traffic and a 25% increase in online sales.",
		keyMetrics: [
			{ label: "Page Load Time", value: "1.2s", improvement: "-70%" },
			{ label: "SEO Ranking", value: "Top 3", improvement: "+25 pos" },
			{ label: "Conversion Rate", value: "4.5%", improvement: "+2%" },
			{ label: "Bounce Rate", value: "25%", improvement: "-50%" },
		],
		gallery: ["https://placehold.co/1200x800/1a1a1a/ffffff", "https://placehold.co/1200x800/EEE/31343C", "https://placehold.co/1200x800/31343C/EEE"],
	},
	// Add more analysis data here
];
