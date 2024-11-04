import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Technical() {
	return (
		<section id="technical" className="scroll-mt-28">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Technical Details</CardTitle>
					<CardDescription>Implementation specifics and optimizations</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div>
						<h3 className="font-semibold mb-2">Performance Optimizations</h3>
						<ul className="grid gap-2">
							<TechItem text="Advanced caching strategies implementation" />
							<TechItem text="Image optimization with WebP format and lazy loading" />
							<TechItem text="Code splitting and bundle optimization" />
							<TechItem text="CDN integration for global content delivery" />
						</ul>
					</div>
					<div>
						<h3 className="font-semibold mb-2">Security Enhancements</h3>
						<ul className="grid gap-2">
							<TechItem text="SSL/TLS implementation with A+ rating" />
							<TechItem text="Advanced firewall protection" />
							<TechItem text="Regular security audits and monitoring" />
							<TechItem text="Automated backup systems" />
						</ul>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}

function TechItem({ text }: { text: string }) {
	return (
		<li className="flex items-center gap-2">
			<CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
			<span className="text-sm text-muted-foreground">{text}</span>
		</li>
	);
}
