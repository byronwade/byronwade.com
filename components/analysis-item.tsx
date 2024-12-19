"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Zap, Search, SmartphoneIcon as Mobile } from "lucide-react";

interface AnalysisItemProps {
	id: number;
	title: string;
	description: string;
	performanceIncrease: string;
	seoImprovement: string;
	mobileScore: string;
	imageUrl: string;
	tags: string[];
}

export default function AnalysisItem({ id, title, description, performanceIncrease, seoImprovement, mobileScore, imageUrl, tags }: AnalysisItemProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div className="bg-zinc-50 dark:bg-black border-t border-gray-200 dark:border-gray-800 py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="lg:flex lg:items-center lg:justify-between">
					<div className="lg:w-1/2 pr-8">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">{title}</h2>
							<span className="text-2xl font-bold text-gray-400 dark:text-gray-600">#{id}</span>
						</div>
						<p className="mt-3 text-lg text-gray-600 dark:text-gray-400 mb-6">{description}</p>
						<div className="grid grid-cols-3 gap-4 mb-6">
							<div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
								<Zap className="h-8 w-8 text-black dark:text-white mb-2" />
								<span className="text-lg font-bold text-black dark:text-white">{performanceIncrease}</span>
								<span className="text-sm text-gray-600 dark:text-gray-400">Faster</span>
							</div>
							<div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
								<Search className="h-8 w-8 text-black dark:text-white mb-2" />
								<span className="text-lg font-bold text-black dark:text-white">{seoImprovement}</span>
								<span className="text-sm text-gray-600 dark:text-gray-400">SEO Boost</span>
							</div>
							<div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
								<Mobile className="h-8 w-8 text-black dark:text-white mb-2" />
								<span className="text-lg font-bold text-black dark:text-white">{mobileScore}</span>
								<span className="text-sm text-gray-600 dark:text-gray-400">Mobile Score</span>
							</div>
						</div>
						<div className="flex flex-wrap gap-2 mb-6">
							{tags.map((tag) => (
								<span key={tag} className="px-3 py-1 text-sm font-medium bg-gray-200 text-black rounded-full dark:bg-gray-800 dark:text-white">
									{tag}
								</span>
							))}
						</div>
						<a href={`/analysis/${id}`} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 dark:text-black dark:bg-zinc-50 dark:hover:bg-gray-200 transition duration-150 ease-in-out">
							View Full Analysis
							<ArrowUpRight className="ml-2 h-5 w-5" />
						</a>
					</div>
					<div className="mt-10 lg:mt-0 lg:w-1/2">
						<div className="relative rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
							<Image src={imageUrl} alt={`${title} preview`} width={1200} height={800} className="object-cover" quality={90} />
							<div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
								<span className="text-white text-xl font-semibold">View Details</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
