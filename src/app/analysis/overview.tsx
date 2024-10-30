import { Lightbulb, Users, Globe, Zap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Component() {
	return (
		<div className="max-w-4xl mx-auto space-y-12 py-12">
			<section className="text-center space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Website Redesign: The Essentials</h1>
				<p className="text-xl text-muted-foreground">Understanding the why, who, and where of your digital transformation</p>
			</section>

			<section className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Lightbulb className="h-6 w-6 text-primary" />
							Why Redesign?
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li>Stay competitive in the digital landscape</li>
							<li>Improve user experience and engagement</li>
							<li>Align your online presence with current brand identity</li>
							<li>Leverage new technologies for better performance</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-6 w-6 text-primary" />
							Who Benefits?
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li>Your customers: Easier navigation and information access</li>
							<li>Your team: Streamlined content management</li>
							<li>Your business: Increased conversions and brand loyalty</li>
							<li>New visitors: Better first impressions</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Globe className="h-6 w-6 text-primary" />
							Where to Focus?
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li>Mobile responsiveness for on-the-go users</li>
							<li>Clear call-to-actions on key pages</li>
							<li>Optimized content for search engines</li>
							<li>Intuitive navigation structure</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Zap className="h-6 w-6 text-primary" />
							Key Improvements
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li>Faster loading speeds</li>
							<li>Enhanced security measures</li>
							<li>Modern, clean design aesthetic</li>
							<li>Improved accessibility features</li>
						</ul>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
