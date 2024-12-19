import { Suspense } from "react";
import { getProducts } from "@/app/actions/shopify/getProducts";
import { ProductGrid } from "./components";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const preferredRegion = "auto";

export default async function ShopPage() {
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

async function ProductSection() {
	const products = await getProducts();

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Products</h2>
			</div>
			<ProductGrid products={products} />
		</div>
	);
}
