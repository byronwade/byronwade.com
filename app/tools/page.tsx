"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Database, Globe, Palette, Server, Zap, Cloud, Lock, Smartphone, Cpu, ExternalLink, Check } from "lucide-react";
import { useRef, useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, RefObject } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const tools = [
	{
		name: "Next.js",
		icon: Globe,
		description: "Next.js is a powerful React framework that enables functionality such as server-side rendering and generating static websites for React based web applications.",
		tags: ["React", "JavaScript", "TypeScript", "Server-Side Rendering", "Static Site Generation"],
		keyFeatures: ["Hybrid Static & Server Rendering", "TypeScript Support", "Smart Bundling", "Route Pre-fetching", "Built-in CSS Support"],
		useCases: ["E-commerce websites", "Blog platforms", "Social media applications", "Dashboard interfaces"],
		url: "https://nextjs.org/",
		image: "/images/nextjs.png",
	},
	{
		name: "React",
		icon: Code,
		description: "React is a declarative, efficient, and flexible JavaScript library for building user interfaces.",
		tags: ["React", "JavaScript", "TypeScript", "Component-Based Architecture", "Unidirectional data flow"],
		keyFeatures: ["Virtual DOM for improved performance", "JSX syntax", "Component-Based Architecture", "Unidirectional data flow", "Rich ecosystem and community"],
		useCases: ["Single Page Applications (SPAs)", "Progressive Web Apps (PWAs)", "Cross-platform mobile applications", "Interactive dashboards"],
		url: "https://reactjs.org/",
	},
	{
		name: "Tailwind CSS",
		icon: Palette,
		description: "Tailwind CSS is a utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.",
		tags: ["Tailwind CSS", "CSS", "Utility-First Approach", "Highly Customizable", "Responsive Design", "Dark Mode", "JIT (Just-In-Time) Compiler"],
		keyFeatures: ["Utility-First Approach", "Highly Customizable", "Responsive Design", "Dark Mode", "JIT (Just-In-Time) Compiler"],
		useCases: ["Rapid prototyping", "Consistent design systems", "Responsive web design", "Custom component libraries"],
		url: "https://tailwindcss.com/",
	},
	{
		name: "Node.js",
		icon: Server,
		description: "Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside of a web browser.",
		tags: ["Node.js", "JavaScript", "Open-Source", "Cross-Platform", "Event-Driven", "Non-Blocking I/O", "NPM (Node Package Manager)", "Large Ecosystem"],
		keyFeatures: ["Non-blocking I/O", "Event-driven architecture", "NPM (Node Package Manager)", "Cross-platform compatibility", "Large ecosystem of libraries"],
		useCases: ["Web servers", "Real-time applications", "API development", "Microservices architecture", "Command-line tools"],
		url: "https://nodejs.org/",
	},
	{
		name: "MongoDB",
		icon: Database,
		description: "MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.",
		tags: ["MongoDB", "NoSQL", "Document-oriented storage", "Full index support", "Replication & high availability", "Auto-sharding", "Rich queries"],
		keyFeatures: ["Document-oriented storage", "Full index support", "Replication & high availability", "Auto-sharding", "Rich queries"],
		useCases: ["Content management systems", "Real-time analytics", "Caching and high performance", "Mobile and social infrastructure", "User data management"],
		url: "https://www.mongodb.com/",
	},
	{
		name: "GraphQL",
		icon: Zap,
		description: "GraphQL is a query language for APIs and a runtime for executing those queries with your existing data.",
		tags: ["GraphQL", "API", "Query Language", "Runtime", "Hierarchical data fetching", "Strong typing", "Single endpoint", "Introspection", "Real-time updates with subscriptions"],
		keyFeatures: ["Hierarchical data fetching", "Strong typing", "Single endpoint", "Introspection", "Real-time updates with subscriptions"],
		useCases: ["Mobile applications", "Complex data requirements", "Microservices aggregation", "Rapid prototyping and iteration", "Real-time data updates"],
		url: "https://graphql.org/",
	},
	{
		name: "Vercel",
		icon: Cloud,
		description: "Vercel is a cloud platform for static sites and Serverless Functions that fits perfectly with your workflow.",
		tags: ["Vercel", "Cloud Platform", "Static Sites", "Serverless Functions", "Edge Network", "HTTPS by default", "Preview deployments"],
		keyFeatures: ["Automatic deployments", "Serverless Functions", "Edge Network", "HTTPS by default", "Preview deployments"],
		useCases: ["Static website hosting", "Jamstack applications", "Serverless API endpoints", "Next.js deployments", "Continuous deployment pipelines"],
		url: "https://vercel.com/",
	},
	{
		name: "Auth0",
		icon: Lock,
		description: "Auth0 is an easy to implement, adaptable authentication and authorization platform.",
		tags: ["Auth0", "Authentication", "Authorization", "Universal authentication", "Single Sign-On (SSO)", "Multi-factor Authentication (MFA)", "Social identity providers", "Passwordless authentication"],
		keyFeatures: ["Universal authentication", "Single Sign-On (SSO)", "Multi-factor Authentication (MFA)", "Social identity providers", "Passwordless authentication"],
		useCases: ["B2C identity management", "B2B enterprise solutions", "API security", "IoT device authentication", "Customer identity and access management"],
		url: "https://auth0.com/",
	},
	{
		name: "React Native",
		icon: Smartphone,
		description: "React Native is an open-source mobile application development framework created by Facebook.",
		tags: ["React Native", "Open-Source", "Mobile Development", "Cross-platform", "Native Components", "Hot Reloading", "Large Community", "Performance Close to Native"],
		keyFeatures: ["Cross-platform development", "Native components", "Hot reloading", "Large community and ecosystem", "Performance close to native apps"],
		useCases: ["Cross-platform mobile apps", "Rapid prototyping", "Adding mobile experience to existing web apps", "Social media applications", "E-commerce mobile apps"],
		url: "https://reactnative.dev/",
	},
	{
		name: "WebAssembly",
		icon: Cpu,
		description: "WebAssembly (Wasm) is a binary instruction format for a stack-based virtual machine.",
		tags: ["WebAssembly", "Wasm", "Binary Instruction Format", "Stack-based Virtual Machine", "Near-native performance", "Language independence", "Secure execution", "Compact binary format", "Complements JavaScript"],
		keyFeatures: ["Near-native performance", "Language independence", "Secure execution", "Compact binary format", "Complements JavaScript"],
		useCases: ["High-performance web applications", "Gaming in the browser", "Audio and video processing", "Cryptography and security applications", "Porting existing C/C++ applications to the web"],
		url: "https://webassembly.org/",
	},
];

function Tool({
	tool,
	index,
	setActiveToolIndex,
}: {
	tool: {
		name: string;
		icon: any;
		description: string;
		tags: string[];
		keyFeatures: string[];
		useCases: string[];
		url: string;
	};
	index: number;
	setActiveToolIndex: (index: number) => void;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref as RefObject<HTMLElement>,
		offset: ["start end", "end start"],
	});
	const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

	useEffect(() => {
		const unsubscribe = scrollYProgress.onChange((v) => {
			if (v > 0.3 && v < 0.7) {
				setActiveToolIndex(index);
			}
		});
		return () => unsubscribe();
	}, [scrollYProgress, index, setActiveToolIndex]);

	return (
		// @ts-ignore
		<motion.div ref={ref} style={{ opacity, scale }} className="min-h-[calc(100vh-64px)] md:-ml-32 flex items-center justify-center px-4">
			<Card className="w-full mx-auto max-w-5xl bg-white dark:bg-black border dark:border-zinc-800 border-zinc-200 rounded-xl overflow-hidden z-10">
				<CardHeader className="flex justify-between items-center py-10 border-b dark:border-zinc-800 border-zinc-200">
					<div className="h-8 w-8 flex items-center justify-center">
						<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-zinc-500">
							<path d="M12 2L2 19.7778H22L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
				</CardHeader>
				<CardContent className="space-y-4 p-6">
					<h2 className="text-2xl font-semibold tracking-tight">{tool.name}</h2>
					<p className="text-neutral-700 dark:text-neutral-300 text-sm">{tool.description}</p>
					<div className="flex flex-wrap gap-2">
						{tool.tags.map((tag: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
							<Badge key={index} variant="secondary" className="bg-zinc-800 text-zinc-400">
								{tag}
							</Badge>
						))}
					</div>
					<Separator className="dark:bg-zinc-800 bg-zinc-200" />
					<div className="space-y-2">
						<h3 className="text-sm font-medium text-white">Key Features:</h3>
						<ul className="space-y-1">
							{tool.keyFeatures.map((feature: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
								<li key={index} className="flex items-center dark:text-zinc-400 text-neutral-700 text-sm">
									<Check className="h-4 w-4 mr-2 text-green-500" />
									{feature}
								</li>
							))}
						</ul>
					</div>
				</CardContent>
				<CardFooter className="border-t dark:border-zinc-800 border-zinc-200 p-6">
					<a href="#" className="inline-flex items-center gap-2 text-sm dark:text-zinc-400 text-neutral-700 hover:text-yellow-400 transition-colors">
						View Template
						<ExternalLink className="h-4 w-4" />
					</a>
				</CardFooter>
			</Card>
		</motion.div>
	);
}

export default function ToolsShowcase() {
	const [activeToolIndex, setActiveToolIndex] = useState(0);

	return (
		<>
			<div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] z-10">
				{/* Left side - Title, Description, and Overview */}
				<div className="w-full lg:w-1/4 flex flex-col justify-between p-6 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)]">
					<div className="max-w-xs mx-auto lg:mx-0">
						{/* @ts-ignore */}
						<motion.h1 className="text-3xl font-bold mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
							Our Toolkit
						</motion.h1>
						{/* @ts-ignore */}
						<motion.p className="text-base dark:text-neutral-300 text-neutral-700 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
							Explore the cutting-edge tools we leverage to build high-performance, SEO-optimized websites for businesses in Santa Cruz and beyond.
						</motion.p>
					</div>
					<div className="mt-6 lg:mt-0">
						<h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Overview</h3>
						<ul className="space-y-2">
							{tools.map((tool, index) => (
								<li key={tool.name} className={`transition-all duration-300 text-sm ${index === activeToolIndex ? "text-yellow-400 translate-x-1" : "text-neutral-500 hover:text-yellow-400"}`}>
									<tool.icon className="w-3 h-3 inline-block mr-1" />
									{tool.name}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Right side - Scrolling Tools */}
				<div className="w-full lg:w-3/4">
					{tools.map((tool, index) => (
						<Tool key={tool.name} tool={tool} index={index} setActiveToolIndex={setActiveToolIndex} />
					))}
				</div>
			</div>
		</>
	);
}
