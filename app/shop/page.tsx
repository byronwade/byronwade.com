"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Search, Menu, Download, Code, Globe, ShoppingBag, Component, Eye, Shirt } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import Image from "next/image";

const products = [
	{ id: 1, title: "Modern Blog", price: 49, rating: 4.5, sales: 1234, image: "https://placehold.co/600x400", type: "WordPress" },
	{ id: 2, title: "E-commerce Pro", price: 79, rating: 4.7, sales: 2345, image: "https://placehold.co/600x400", type: "Shopify" },
	{ id: 3, title: "Portfolio Plus", price: 39, rating: 4.2, sales: 987, image: "https://placehold.co/600x400", type: "Webflow" },
	{ id: 4, title: "Next Dashboard", price: 99, rating: 4.8, sales: 3456, image: "https://placehold.co/600x400", type: "Next.js" },
	{ id: 5, title: "Responsive Navbar", price: 19, rating: 4.6, sales: 876, image: "https://placehold.co/600x400", type: "Component" },
	{ id: 6, title: "Modal Dialog", price: 24, rating: 4.5, sales: 654, image: "https://placehold.co/600x400", type: "Component" },
];

const merchandise = [
	{ id: 101, title: "Developer T-Shirt", price: 25, rating: 4.7, sales: 532, image: "https://placehold.co/600x400", type: "Shirt" },
	{ id: 102, title: "Code Ninja Cap", price: 20, rating: 4.5, sales: 423, image: "https://placehold.co/600x400", type: "Hat" },
	{ id: 103, title: "Debugging Mug", price: 15, rating: 4.8, sales: 765, image: "https://placehold.co/600x400", type: "Mug" },
	{ id: 104, title: "Programmer Hoodie", price: 45, rating: 4.6, sales: 321, image: "https://placehold.co/600x400", type: "Hoodie" },
];

const categories = {
	themes: ["WordPress", "Shopify", "Webflow", "Next.js", "Component"],
	merchandise: ["Shirt", "Hat", "Mug", "Hoodie"],
};

const TypeIcon = ({ type }: { type: string }) => {
	switch (type) {
		case "WordPress":
			return <Globe className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
		case "Shopify":
			return <ShoppingBag className="h-5 w-5 text-green-500 dark:text-green-400" />;
		case "Webflow":
			return <Download className="h-5 w-5 text-purple-500 dark:text-purple-400" />;
		case "Next.js":
			return <Code className="h-5 w-5 text-black dark:text-white" />;
		case "Component":
			return <Component className="h-5 w-5 text-red-500 dark:text-red-400" />;
		default:
			return <Shirt className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
	}
};

const ProductCard = ({ item, isMerchandise = false }: { item: any; isMerchandise?: boolean }) => {
	const router = useRouter();

	return (
		<Card className="transition-transform duration-300 hover:scale-105">
			<CardHeader className="p-0">
				<div className="relative">
					<Image src={item.image} alt={item.title} width={500} height={300} className="w-full h-auto" />
					<Badge className={`absolute top-2 right-2 ${isMerchandise ? "bg-indigo-500 text-white" : item.type === "Component" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-white text-neutral-800 dark:bg-neutral-800 dark:text-white"}`}>
						<TypeIcon type={item.type} />
						<span className="ml-1">{item.type}</span>
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="p-4">
				<CardTitle className="mb-2">{item.title}</CardTitle>
				<div className="flex items-center justify-between mb-2">
					<span className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">${item.price}</span>
					<div className="flex items-center">
						<Star className="h-5 w-5 text-yellow-400 fill-current" />
						<span className="ml-1 text-sm text-neutral-600 dark:text-neutral-400">{item.rating}</span>
					</div>
				</div>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">{item.sales} sales</p>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button className="flex-1 mr-2">Add to Cart</Button>
				<Button variant="outline" className="flex-1" onClick={() => router.push(`/product-details/${item.id}`)}>
					<Eye className="w-4 h-4 mr-2" />
					Preview
				</Button>
			</CardFooter>
		</Card>
	);
};

export default function Shop() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [activeTab, setActiveTab] = useState<"themes" | "merchandise">("themes");

	const toggleCategory = (category: string) => {
		setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
	};

	const filteredProducts =
		activeTab === "themes"
			? products.filter((product) => (product.title.toLowerCase().includes(searchQuery.toLowerCase()) || product.type.toLowerCase().includes(searchQuery.toLowerCase())) && (selectedCategories.length === 0 || selectedCategories.includes(product.type)))
			: merchandise.filter((item) => (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase())) && (selectedCategories.length === 0 || selectedCategories.includes(item.type)));

	return (
		<div className="min-h-screen bg-background py-16">
			<div className="container mx-auto px-4 max-w-6xl">
				<div className="flex flex-col md:flex-row">
					<aside className={`w-full md:w-64 pr-8 mb-8 md:mb-0 ${sidebarOpen ? "block" : "hidden"} md:block`}>
						<div className="mb-6">
							<h2 className="text-lg font-semibold mb-2">Search</h2>
							<div className="relative">
								<Input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100" />
								<Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
							</div>
						</div>
						<div>
							<h2 className="text-lg font-semibold mb-4">Categories</h2>
							<ul className="space-y-2">
								{categories[activeTab].map((category) => (
									<li key={category} className="flex items-center">
										<Checkbox id={category} checked={selectedCategories.includes(category)} onCheckedChange={() => toggleCategory(category)} />
										<label htmlFor={category} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
											{category}
										</label>
									</li>
								))}
							</ul>
						</div>
					</aside>

					<main className="flex-1">
						<div className="md:hidden mb-4">
							<Button variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)}>
								<Menu className="h-4 w-4 mr-2" />
								{sidebarOpen ? "Hide Filters" : "Show Filters"}
							</Button>
						</div>

						<Tabs defaultValue="themes" className="mb-8" onValueChange={(value) => setActiveTab(value as "themes" | "merchandise")}>
							<TabsList>
								<TabsTrigger value="themes">Themes & Components</TabsTrigger>
								<TabsTrigger value="merchandise">Merchandise</TabsTrigger>
							</TabsList>
							<TabsContent value="themes">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									{filteredProducts.map((product) => (
										<ProductCard key={product.id} item={product} />
									))}
								</div>
								{filteredProducts.length === 0 && <p className="text-center text-neutral-500 dark:text-neutral-400 mt-8">No products found matching your search criteria.</p>}
							</TabsContent>
							<TabsContent value="merchandise">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									{filteredProducts.map((item) => (
										<ProductCard key={item.id} item={item} isMerchandise={true} />
									))}
								</div>
								{filteredProducts.length === 0 && <p className="text-center text-neutral-500 dark:text-neutral-400 mt-8">No merchandise found matching your search criteria.</p>}
							</TabsContent>
						</Tabs>

						{filteredProducts.length > 0 && (
							<div className="mt-8 flex justify-center">
								<Button variant="outline">Load More</Button>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
