"use client";

import { Code2Icon, SearchIcon, RocketIcon, BarChartIcon, PenToolIcon, GlobeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Marquee from "@/components/ui/marquee";

const services = [
	{
		name: "Web Design",
		description: "Crafting visually stunning and user-friendly websites.",
	},
	{
		name: "Web Development",
		description: "Building high-performance websites with cutting-edge technologies.",
	},
	{
		name: "SEO Optimization",
		description: "Boosting your online visibility and search engine rankings.",
	},
	{
		name: "E-commerce Solutions",
		description: "Creating seamless online shopping experiences.",
	},
	{
		name: "Performance Optimization",
		description: "Enhancing website speed and user experience.",
	},
];

const features = [
	{
		Icon: PenToolIcon,
		name: "Web Design",
		description: "Create stunning, responsive websites that captivate your audience.",
		href: "#",
		cta: "Learn more",
		className: "col-span-3 lg:col-span-2",
		background: (
			<Marquee pauseOnHover className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]">
				{services.map((service, idx) => (
					<figure key={idx} className={cn("relative w-48 cursor-pointer overflow-hidden rounded-xl border p-4 mr-4", "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]", "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]", "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none")}>
						<div className="flex flex-col">
							<figcaption className="text-sm font-medium dark:text-white">{service.name}</figcaption>
							<blockquote className="mt-2 text-xs">{service.description}</blockquote>
						</div>
					</figure>
				))}
			</Marquee>
		),
	},
	{
		Icon: Code2Icon,
		name: "Web Development",
		description: "Build lightning-fast websites with Next.js and SvelteKit.",
		href: "#",
		cta: "Explore our stack",
		className: "col-span-3 lg:col-span-1",
		background: (
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="text-4xl font-bold text-primary/20">{"</>"}</div>
			</div>
		),
	},
	{
		Icon: SearchIcon,
		name: "SEO Optimization",
		description: "Boost your online presence with our expert SEO services.",
		href: "#",
		cta: "Improve your rankings",
		className: "col-span-3 lg:col-span-2",
		background: (
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="w-24 h-24 border-4 border-primary/20 rounded-full flex items-center justify-center">
					<SearchIcon className="w-12 h-12 text-primary/40" />
				</div>
			</div>
		),
	},
	{
		Icon: RocketIcon,
		name: "Performance",
		description: "Optimize your website for lightning-fast load times.",
		className: "col-span-3 lg:col-span-1",
		href: "#",
		cta: "Speed up your site",
		background: (
			<div className="absolute inset-0 flex items-center justify-center">
				<RocketIcon className="w-16 h-16 text-primary/20 animate-pulse" />
			</div>
		),
	},
	{
		Icon: BarChartIcon,
		name: "Analytics",
		description: "Gain insights with our advanced analytics solutions.",
		href: "#",
		cta: "View demo",
		className: "col-span-3 lg:col-span-1",
		background: (
			<div className="absolute inset-0 flex items-center justify-center">
				<BarChartIcon className="w-16 h-16 text-primary/20" />
			</div>
		),
	},
	{
		Icon: GlobeIcon,
		name: "Local SEO",
		description: "Dominate local search results in Santa Cruz.",
		href: "#",
		cta: "Target local customers",
		className: "col-span-3 lg:col-span-2",
		background: (
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="text-2xl font-bold text-primary/20">Santa Cruz</div>
			</div>
		),
	},
];

export default function Features() {
	return (
		<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
			<BentoGrid>
				{features.map((feature, idx) => (
					<BentoCard key={idx} {...feature} className="bg-[#090909] border border-[#111111]" />
				))}
			</BentoGrid>
		</div>
	);
}
