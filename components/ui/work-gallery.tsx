"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";

interface GalleryItem {
	id: number;
	title: string;
	category: string;
	location: string;
	date: string;
	image: string;
	description: string;
}

// Gallery items based on Wade's Plumbing & Septic actual services
const galleryItems: GalleryItem[] = [
	{
		id: 1,
		title: "Trenchless Sewer Line Replacement",
		category: "Sewer Services",
		location: "Santa Cruz County, CA",
		date: "December 2024",
		image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop&crop=center",
		description: "Modern trenchless technology for sewer line replacement with minimal property disruption",
	},
	{
		id: 2,
		title: "Enhanced Septic System Installation",
		category: "Septic Services",
		location: "Pickens County, GA",
		date: "November 2024",
		image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&crop=center",
		description: "Three-tank enhanced treatment system with concrete pad for hillside properties",
	},
	{
		id: 3,
		title: "Tankless Water Heater Installation",
		category: "Water Heater Services",
		location: "Santa Cruz, CA",
		date: "November 2024",
		image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center",
		description: "Energy-efficient tankless water heater installation with professional setup and warranty",
	},
	{
		id: 4,
		title: "Water Filtration System Installation",
		category: "Water Treatment",
		location: "Scotts Valley, CA",
		date: "October 2024",
		image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop&crop=center",
		description: "Whole house water filtration system for clean, safe drinking water throughout the home",
	},
	{
		id: 5,
		title: "Commercial Grease Trap Installation",
		category: "Commercial Plumbing",
		location: "Santa Cruz, CA",
		date: "October 2024",
		image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&crop=center",
		description: "Professional grease trap installation for restaurant compliance with local regulations",
	},
	{
		id: 6,
		title: "Leak Detection & Water Line Repair",
		category: "Leak Detection",
		location: "Capitola, CA",
		date: "September 2024",
		image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop&crop=center",
		description: "Advanced leak detection technology and professional water line repair services",
	},
	{
		id: 7,
		title: "Septic Filter Cleaning & Replacement",
		category: "Septic Services",
		location: "Jasper, GA",
		date: "September 2024",
		image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&crop=center",
		description: "Professional septic filter maintenance and replacement for optimal system performance",
	},
	{
		id: 8,
		title: "High-Pressure Jetting for Septic Lines",
		category: "Septic Services",
		location: "Pickens County, GA",
		date: "August 2024",
		image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop&crop=center",
		description: "Professional high-pressure jetting to clear septic line blockages and restore flow",
	},
	{
		id: 9,
		title: "Commercial Drain Cleaning",
		category: "Commercial Plumbing",
		location: "Santa Cruz, CA",
		date: "August 2024",
		image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&crop=center",
		description: "Professional commercial drain cleaning for restaurants and business properties",
	},
	{
		id: 10,
		title: "Water Line Installation",
		category: "Water Line Services",
		location: "Ben Lomond, CA",
		date: "July 2024",
		image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop&crop=center",
		description: "New water line installation with modern materials and professional techniques",
	},
	{
		id: 11,
		title: "Alternative Septic System Installation",
		category: "Septic Services",
		location: "Dawsonville, GA",
		date: "July 2024",
		image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&crop=center",
		description: "Advanced alternative septic system designed for challenging terrain and soil conditions",
	},
	{
		id: 12,
		title: "Septic System Certification",
		category: "Septic Services",
		location: "Pickens County, GA",
		date: "June 2024",
		image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&crop=center",
		description: "Professional septic system inspection and certification for property transfers and compliance",
	},
	{
		id: 13,
		title: "Commercial Plumbing Maintenance",
		category: "Commercial Plumbing",
		location: "Santa Cruz County, CA",
		date: "June 2024",
		image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&crop=center",
		description: "Comprehensive commercial plumbing maintenance program for business facilities and restaurants",
	},
	{
		id: 14,
		title: "Grease Trap Cleaning",
		category: "Commercial Plumbing",
		location: "Santa Cruz, CA",
		date: "May 2024",
		image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&crop=center",
		description: "Regular grease trap cleaning and maintenance for restaurant operations and compliance",
	},
	{
		id: 15,
		title: "Septic System Abandonment",
		category: "Septic Services",
		location: "Jasper, GA",
		date: "May 2024",
		image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop&crop=center",
		description: "Professional septic system abandonment following local regulations and environmental standards",
	},
];

const ITEMS_PER_LOAD = 6;

export default function WorkGallery() {
	const [visibleItems, setVisibleItems] = useState(ITEMS_PER_LOAD);
	const [selectedCategory, setSelectedCategory] = useState("All");

	const categories = ["All", ...Array.from(new Set(galleryItems.map((item) => item.category)))];

	const filteredItems = selectedCategory === "All" ? galleryItems : galleryItems.filter((item) => item.category === selectedCategory);

	const displayedItems = filteredItems.slice(0, visibleItems);
	const hasMore = visibleItems < filteredItems.length;

	const loadMore = () => {
		setVisibleItems((prev) => Math.min(prev + ITEMS_PER_LOAD, filteredItems.length));
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		setVisibleItems(ITEMS_PER_LOAD);
	};

	return (
		<div className="space-y-8">
			{/* Category Filter */}
			<div className="flex flex-wrap gap-2 justify-center">
				{categories.map((category) => (
					<Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => handleCategoryChange(category)} className={selectedCategory === category ? "bg-yellow-600 hover:bg-yellow-700 text-black" : "border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600"}>
						{category}
					</Button>
				))}
			</div>

			{/* Gallery Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{displayedItems.map((item) => (
					<Card key={item.id} className="group overflow-hidden bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
						<div className="relative aspect-[4/3] overflow-hidden">
							<Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
							<div className="absolute top-4 left-4">
								<Badge className="bg-yellow-600 text-black font-medium">{item.category}</Badge>
							</div>
							<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-black">
									<Eye className="w-4 h-4 mr-2" />
									View Details
								</Button>
							</div>
						</div>
						<CardContent className="p-6">
							<h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-yellow-600 transition-colors">{item.title}</h3>
							<p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.description}</p>
							<div className="flex items-center justify-between text-sm text-muted-foreground">
								<div className="flex items-center gap-1">
									<MapPin className="w-4 h-4 text-yellow-600" />
									<span>{item.location}</span>
								</div>
								<div className="flex items-center gap-1">
									<Calendar className="w-4 h-4 text-yellow-600" />
									<span>{item.date}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Load More Button */}
			{hasMore && (
				<div className="text-center">
					<Button onClick={loadMore} size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8">
						Load More Projects
						<ArrowRight className="w-4 h-4 ml-2" />
					</Button>
				</div>
			)}

			{/* Results Info */}
			<div className="text-center text-muted-foreground">
				<p>
					Showing {displayedItems.length} of {filteredItems.length} projects
					{selectedCategory !== "All" && ` in ${selectedCategory}`}
				</p>
			</div>
		</div>
	);
}
