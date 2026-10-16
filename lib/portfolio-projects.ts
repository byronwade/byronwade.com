interface PortfolioProject {
	caseStudyUrl?: string;
	gallery: string[];
	githubUrl?: string;
	id: number;
	image: string;
	keyFeatures: string[];
	liveUrl?: string;
	longDescription: string;
	outcome: string;
	problem: string;
	shortDescription: string;
	slug: string;
	solution: string;
	status: string;
	tags: string[];
	techStack: { name: string }[];
	title: string;
}

export const projects: PortfolioProject[] = [
	{
		id: 1,
		slug: "thorbis",
		title: "Thorbis.com",
		shortDescription:
			"The Amazon for businesses - a comprehensive B2B marketplace platform revolutionizing procurement with AI-powered automation and global supplier network.",
		longDescription:
			"Thorbis.com is building the future of B2B commerce. Our platform combines the convenience of Amazon with the complexity and scale of enterprise procurement, powered by AI and machine learning. We're creating a one-stop solution for businesses to source, compare, and purchase everything they need with automated workflows, real-time pricing, and intelligent supplier matching.",
		image: "/images/portfolio/thorbis-preview.jpg",
		liveUrl: "https://thorbis.com",
		caseStudyUrl: "/portfolio/thorbis",
		tags: ["B2B Marketplace", "AI Procurement", "Enterprise Platform", "Funding Round"],
		status: "Funding Round",
		keyFeatures: [
			"AI-Powered Procurement",
			"Global Supplier Network",
			"Automated Workflows",
			"Real-time Pricing",
			"Enterprise Integration",
			"Market Validation",
		],
		techStack: [
			{ name: "Next.js" },
			{ name: "TypeScript" },
			{ name: "AI/ML" },
			{ name: "Cloud Infrastructure" },
			{ name: "Enterprise APIs" },
			{ name: "Blockchain" },
		],
		gallery: [
			"/images/portfolio/thorbis-1.jpg",
			"/images/portfolio/thorbis-2.jpg",
			"/images/portfolio/thorbis-3.jpg",
		],
		problem:
			"B2B procurement is fragmented, inefficient, and lacks transparency. Businesses spend countless hours sourcing suppliers, negotiating prices, and managing complex procurement processes across multiple platforms and vendors.",
		solution:
			"Thorbis.com creates a unified B2B marketplace that combines AI-powered supplier matching, automated procurement workflows, real-time pricing transparency, and enterprise-grade integrations. Our platform eliminates the complexity of traditional B2B commerce.",
		outcome:
			"Thorbis.com is positioned to capture a significant share of the $50B+ B2B e-commerce market. With 10,000+ suppliers ready to onboard and proprietary AI technology, we're seeking $20M in funding to accelerate market expansion and technology development.",
	},
	{
		id: 2,
		slug: "thorbis-ai",
		title: "Thorbis AI Platform",
		shortDescription:
			"Proprietary AI engine powering intelligent procurement, supplier matching, and automated business workflows.",
		longDescription:
			"Our proprietary AI platform is the core differentiator of Thorbis.com. It analyzes millions of data points to provide intelligent supplier recommendations, automated price negotiations, demand forecasting, and predictive analytics for business procurement.",
		image: "/images/portfolio/ai-platform.jpg",
		liveUrl: "#",
		caseStudyUrl: "/portfolio/thorbis-ai",
		tags: ["AI/ML", "Procurement", "Predictive Analytics", "Enterprise"],
		status: "In Development",
		keyFeatures: [
			"Intelligent Supplier Matching",
			"Predictive Analytics",
			"Automated Negotiations",
			"Demand Forecasting",
			"Real-time Optimization",
			"Proprietary Algorithms",
		],
		techStack: [
			{ name: "Machine Learning" },
			{ name: "Python" },
			{ name: "TensorFlow" },
			{ name: "Big Data" },
			{ name: "Cloud Computing" },
			{ name: "APIs" },
		],
		gallery: [
			"/images/portfolio/ai-1.jpg",
			"/images/portfolio/ai-2.jpg",
			"/images/portfolio/ai-3.jpg",
		],
		problem:
			"Traditional procurement relies on manual processes, limited supplier knowledge, and reactive decision-making, leading to inefficiencies and missed opportunities.",
		solution:
			"Our AI platform provides proactive, data-driven procurement solutions that learn from business patterns, predict needs, and automatically optimize purchasing decisions.",
		outcome:
			"The AI platform will deliver 40%+ cost savings and 60%+ time reduction in procurement processes, creating significant competitive advantages for Thorbis.com in the B2B marketplace.",
	},
	{
		id: 3,
		slug: "thorbis-mobile",
		title: "Thorbis Mobile Platform",
		shortDescription:
			"Mobile-first B2B commerce platform enabling on-the-go procurement and supplier management.",
		longDescription:
			"The Thorbis mobile platform brings enterprise-grade B2B commerce to mobile devices. Business owners and procurement managers can source suppliers, place orders, track deliveries, and manage their entire procurement process from anywhere.",
		image: "/images/portfolio/mobile-platform.jpg",
		liveUrl: "#",
		caseStudyUrl: "/portfolio/thorbis-mobile",
		tags: ["Mobile App", "B2B Commerce", "Procurement", "Cross-platform"],
		status: "In Development",
		keyFeatures: [
			"Mobile-First Design",
			"Offline Capabilities",
			"Push Notifications",
			"Barcode Scanning",
			"Real-time Tracking",
			"Mobile Payments",
		],
		techStack: [
			{ name: "React Native" },
			{ name: "TypeScript" },
			{ name: "Mobile APIs" },
			{ name: "Push Notifications" },
			{ name: "Offline Sync" },
			{ name: "Biometrics" },
		],
		gallery: [
			"/images/portfolio/mobile-1.jpg",
			"/images/portfolio/mobile-2.jpg",
			"/images/portfolio/mobile-3.jpg",
		],
		problem:
			"B2B commerce is still primarily desktop-based, limiting business owners' ability to manage procurement while on the go or at job sites.",
		solution:
			"A comprehensive mobile platform that provides full B2B commerce capabilities with offline functionality, real-time notifications, and mobile-optimized workflows.",
		outcome:
			"Mobile platform will drive 70%+ of B2B transactions by 2025, positioning Thorbis.com as the leading mobile-first B2B marketplace.",
	},
];
