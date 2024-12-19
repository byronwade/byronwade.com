import { Suspense } from "react";
import { getProducts } from "@/app/actions/shopify/getProducts";
import { ProductGrid } from "./components/ProductGrid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { unstable_cache } from "next/cache";
import { type Product } from "@/types/shopify";
import { showShop, pageFlags } from "@/lib/feature-flags";
import { notFound } from "next/navigation";

// Cache products data with server-side caching
const getProductsData = unstable_cache(
	async (): Promise<Product[]> => {
		try {
			const products = await getProducts();
			return products;
		} catch (error) {
			console.error("Error fetching products:", error);
			return [];
		}
	},
	["products"],
	{
		revalidate: 60 * 60, // Cache for 1 hour
		tags: ["products"],
	}
);

async function ProductSection() {
	const products = await getProductsData();

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Products</h2>
			</div>
			<ProductGrid products={products} />
		</div>
	);
}

export default async function ShopPage({ params: { code } }: { params: { code: string } }) {
	// Check if shop feature is enabled
	const isEnabled = await showShop(code, pageFlags);
	if (!isEnabled) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-4">Shop</h1>
					<p className="text-muted-foreground">Browse our collection of products</p>
				</div>

				<Suspense fallback={<LoadingSpinner />}>
					<ProductSection />
				</Suspense>
			</div>
		</div>
	);
}

export const generateMetadata = async ({ params: { code } }: { params: { code: string } }) => {
	// Check if shop feature is enabled for metadata
	const isEnabled = await showShop(code, pageFlags);
	if (!isEnabled) {
		return {};
	}

	const products = await getProductsData();
	return {
		title: "Shop | Byron Wade",
		description: "Browse our collection of high-quality products",
		openGraph: {
			title: "Shop | Byron Wade",
			description: "Browse our collection of high-quality products",
			images: products[0]?.image ? [{ url: products[0].image.url }] : [],
		},
	};
};
