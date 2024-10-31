import { ArrowRight, CheckCircle, FileText, Globe, ImageIcon, Link2, List, Search, Type, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

interface SEOElement {
	name: string;
	icon: any;
	currentStatus: string;
	industryStandard: string;
	newStatus: string;
}

const seoElements: SEOElement[] = [
	{
		name: "Page Title",
		icon: FileText,
		currentStatus: "Generic, missing keywords",
		industryStandard: "50-60 characters, includes primary keyword",
		newStatus: "Optimized with primary and secondary keywords",
	},
	{
		name: "Meta Description",
		icon: FileText,
		currentStatus: "Missing on most pages",
		industryStandard: "150-160 characters, compelling call-to-action",
		newStatus: "Unique, keyword-rich descriptions for all pages",
	},
	{
		name: "Headings Structure",
		icon: List,
		currentStatus: "Inconsistent use of H1-H6 tags",
		industryStandard: "Clear hierarchy, H1 for main title, H2-H6 for subsections",
		newStatus: "Properly structured, keyword-optimized headings",
	},
	{
		name: "Image Optimization",
		icon: ImageIcon,
		currentStatus: "Missing alt text, large file sizes",
		industryStandard: "Descriptive alt text, compressed images",
		newStatus: "All images optimized with alt text and efficient file sizes",
	},
	{
		name: "Internal Linking",
		icon: Link2,
		currentStatus: "Minimal internal links",
		industryStandard: "Strategic internal linking to important pages",
		newStatus: "Comprehensive internal linking strategy implemented",
	},
	{
		name: "Content Quality",
		icon: Type,
		currentStatus: "Thin content on key pages",
		industryStandard: "In-depth, valuable content (1000+ words for key pages)",
		newStatus: "Rich, engaging content optimized for target keywords",
	},
	{
		name: "Mobile Responsiveness",
		icon: Globe,
		currentStatus: "Not fully mobile-friendly",
		industryStandard: "Fully responsive design across all devices",
		newStatus: "Seamless experience on all screen sizes",
	},
];

export default function Component() {
	return (
		<div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
			<header className="text-center space-y-4">
				<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">SEO Improvement Analysis</h1>
				<p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">See how your new website elevates your SEO game across all devices</p>
			</header>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl sm:text-2xl lg:text-3xl">
						<Search className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
						SEO Elements Comparison
					</CardTitle>
					<CardDescription className="text-base sm:text-lg">Compare your current site, industry standards, and your new optimized website</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-8">
						{seoElements.map((element, index) => (
							<div key={index} className="pb-8 border-b last:border-b-0 last:pb-0">
								<h3 className="flex items-center gap-3 text-lg sm:text-xl lg:text-2xl font-semibold mb-4">
									<element.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
									{element.name}
								</h3>
								<div className="grid gap-4 sm:grid-cols-3">
									<div>
										<h4 className="font-semibold text-sm sm:text-base text-muted-foreground mb-2">Current Website</h4>
										<Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-sm sm:text-base">
											<XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
											{element.currentStatus}
										</Badge>
									</div>
									<div>
										<h4 className="font-semibold text-sm sm:text-base text-muted-foreground mb-2">Industry Standard</h4>
										<p className="text-sm sm:text-base">{element.industryStandard}</p>
									</div>
									<div>
										<h4 className="font-semibold text-sm sm:text-base text-muted-foreground mb-2">New Website</h4>
										<Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-sm sm:text-base">
											<CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
											{element.newStatus}
										</Badge>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card className="bg-primary text-primary-foreground">
				<CardHeader>
					<CardTitle className="text-xl sm:text-2xl lg:text-3xl">The Impact of Your New Website</CardTitle>
					<CardDescription className="text-primary-foreground/80 text-base sm:text-lg">Potential benefits of your SEO improvements across all devices</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-base sm:text-lg">By implementing these SEO improvements, your new website is set to:</p>
					<ul className="space-y-3 text-base sm:text-lg">
						<li className="flex items-start gap-3">
							<CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
							<span>Boost search engine rankings for targeted keywords on mobile and desktop</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
							<span>Drive more organic traffic to your website from all devices</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
							<span>Enhance user experience, leading to higher engagement across screen sizes</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
							<span>Establish greater credibility in your industry with a professional, optimized site</span>
						</li>
					</ul>
					<div className="pt-4 sm:pt-6">
						<Button variant="secondary" size="lg" className="w-full sm:w-auto text-base sm:text-lg">
							Explore Your SEO Improvements
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
