"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Link } from "@/components/ui/link";
import { formatPrice } from "@/lib/utils";

interface ProcessedProduct {
	id: string;
	title: string;
	handle: string;
	description: string;
	price: {
		amount: string;
		currencyCode: string;
	};
	image: {
		url: string;
		altText: string | null;
	} | null;
}

// Preload product images for better performance
const preloadImages = async (products: ProcessedProduct[]) => {
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

export default function ProductGrid({ products }: { products: ProcessedProduct[] }) {
	useEffect(() => {
		preloadImages(products);
	}, [products]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{products.map((product) => (
				<Link prefetch={true} key={product.id} href={`/shop/${product.handle}`} className="group">
					<div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
						{product.image && (
							<div className="aspect-square relative">
								<Image src={product.image.url} alt={product.image.altText || product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
							</div>
						)}
						<div className="p-4">
							<h2 className="text-lg font-semibold">{product.title}</h2>
							<p className="text-neutral-600">{formatPrice(product.price)}</p>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}
