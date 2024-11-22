import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { getProducts } from "@/actions/shopify/getProducts";
import ProductGrid from "@/app/shop/components/ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/shopify";

interface ShopStats {
	totalProducts: number;
	averagePrice: number;
	inStock: number;
}

export const dynamic = "force-dynamic";

// Cache the shop stats
const getShopStats = unstable_cache(
	async (): Promise<ShopStats> => {
		const products = await getProducts();
		return {
			totalProducts: products.length,
			averagePrice: products.reduce((acc: number, p: Product) => acc + Number(p.price.amount), 0) / products.length,
			inStock: products.filter((p: Product) => p.availableForSale).length,
		};
	},
	["shop-stats"],
	{
		revalidate: 60,
		tags: ["products"],
	}
);

function ProductGridSkeleton() {
	return (
		<Suspense>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<Card key={i}>
						<CardContent className="p-0">
							<Skeleton className="h-[300px] w-full" />
							<div className="p-4">
								<Skeleton className="h-4 w-3/4 mb-2" />
								<Skeleton className="h-4 w-1/4" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</Suspense>
	);
}

async function ShopStats() {
	const stats = await getShopStats();

	return (
		<Suspense
			fallback={
				<div className="grid sm:grid-cols-3 gap-4 mb-8">
					<Skeleton className="h-[120px]" />
				</div>
			}
		>
			<div className="grid sm:grid-cols-3 gap-4 mb-8">
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Total Products</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalProducts}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Average Price</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${stats.averagePrice.toFixed(2)}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">In Stock</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.inStock}</div>
					</CardContent>
				</Card>
			</div>
		</Suspense>
	);
}

async function ProductSection() {
	const products = await getProducts();

	return (
		<Suspense fallback={<ProductGridSkeleton />}>
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-bold">Products</h2>
				</div>
				<ProductGrid products={products} />
			</div>
		</Suspense>
	);
}

export default async function ShopPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-4">Shop</h1>
				<p className="text-muted-foreground">Browse our collection of products</p>
			</div>

			<Suspense
				fallback={
					<div className="grid sm:grid-cols-3 gap-4 mb-8">
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} className="h-[120px]" />
						))}
					</div>
				}
			>
				<ShopStats />
			</Suspense>

			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductSection />
			</Suspense>
		</div>
	);
}

// Enable revalidation every minute
export const revalidate = 60;
