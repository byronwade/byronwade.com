import { ArrowRight, Zap, Paintbrush, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroPages() {
	return (
		<section className="flex flex-col items-center justify-center py-12 text-center text-white">
			<div className="container px-4">
				<div className="mb-8 flex justify-center">
					<div className="h-12 w-12">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-full w-full">
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<path d="M3 12h18M12 3v18" />
						</svg>
					</div>
				</div>

				<div className="mb-6 text-sm font-medium uppercase tracking-wider">Systems</div>

				<h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
					A system crafted for
					<br />
					team success and growth
				</h1>

				<div className="mb-12 flex flex-wrap justify-center gap-4">
					<Button asChild size="lg" className="h-12 px-6">
						<Link href="/">
							Get started <ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg" className="h-12 px-6 text-black">
						<Link href="/docs">
							Read the docs <ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</Button>
				</div>

				<div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-muted-foreground">
					<div className="flex items-center gap-2">
						<Zap className="h-5 w-5" />
						<span>Quick setup guide</span>
					</div>
					<div className="flex items-center gap-2">
						<Paintbrush className="h-5 w-5" />
						<span>Fully customizable</span>
					</div>
					<div className="flex items-center gap-2">
						<Layers className="h-5 w-5" />
						<span>Easy to use components</span>
					</div>
				</div>
			</div>
		</section>
	);
}
