"use client";

import { useEffect } from "react";
import Image from "next/image";
import { type Product } from "@/types/shopify";

// Preload product images for better performance
const preloadImages = async (products: Product[]) => {
	return Promise.all(
		products.map((product) => {
			if (product.image?.url) {
				return new Promise((resolve, reject) => {
					const img = new Image();
					img.onload = resolve;
					img.onerror = reject;
					img.src = product.image.url;
				});
			}
			return Promise.resolve();
		})
	);
};

export function ProductGrid({ products }: { products: Product[] }) {
	useEffect(() => {
		preloadImages(products);
	}, [products]);

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product) => (
				<div key={product.id} className="group relative">
					<div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">{product.image?.url && <Image src={product.image.url} alt={product.title} width={500} height={500} className="h-full w-full object-cover object-center group-hover:opacity-75" priority />}</div>
					<div className="mt-4 flex justify-between">
						<div>
							<h3 className="text-sm text-gray-700">
								<a href={`/products/${product.handle}`}>
									<span aria-hidden="true" className="absolute inset-0" />
									{product.title}
								</a>
							</h3>
							<p className="mt-1 text-sm text-gray-500">{product.vendor}</p>
						</div>
						<p className="text-sm font-medium text-gray-900">{product.priceRange.minVariantPrice.amount}</p>
					</div>
				</div>
			))}
		</div>
	);
}
