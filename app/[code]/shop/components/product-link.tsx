"use client";

import { useEffect } from "react";
import { Link } from "@/components/ui/link";
import Image, { getImageProps } from "next/image";
import type { Product } from "@/types/shopify";

interface ProductLinkProps {
	product: Product;
	loading?: "eager" | "lazy";
	priority?: boolean;
}

interface HTMLImageElementWithPriority extends HTMLImageElement {
	fetchPriority: "high" | "low" | "auto";
}

export function getProductImageProps(imageUrl: string, productName: string) {
	return getImageProps({
		width: 48,
		height: 48,
		quality: 65,
		src: imageUrl,
		alt: `Product image of ${productName}`,
	});
}

export function ProductLink({ product, loading = "lazy", priority = false }: ProductLinkProps) {
	// Prefetch the main product image
	const prefetchProps = getImageProps({
		height: 256,
		width: 256,
		quality: 80,
		src: product.image?.url ?? "/placeholder.svg",
		alt: `Product image of ${product.title}`,
	});

	useEffect(() => {
		if (typeof window === "undefined") return;

		try {
			const imgProps = prefetchProps.props;
			const imgElement = document.createElement("img") as HTMLImageElementWithPriority;

			// Set image properties
			imgElement.fetchPriority = "low";
			imgElement.decoding = "async";
			imgElement.src = imgProps.src as string;

			if (imgProps.sizes) {
				imgElement.sizes = imgProps.sizes;
			}
			if (imgProps.srcSet) {
				imgElement.srcset = imgProps.srcSet;
			}

			// Optional: append to DOM temporarily for preloading
			imgElement.style.display = "none";
			document.body.appendChild(imgElement);

			// Cleanup
			return () => {
				if (imgElement.parentNode) {
					imgElement.parentNode.removeChild(imgElement);
				}
			};
		} catch (error) {
			console.error("Failed to preload image:", error);
		}
	}, [prefetchProps.props]);

	return (
		<Link prefetch={true} href={`/shop/${product.handle}`} className="group flex h-[130px] w-full flex-row border px-4 py-2 hover:bg-muted/50">
			<div className="py-2">
				<Image src={product.image?.url ?? "/placeholder.svg"} alt={`Product image of ${product.title}`} width={48} height={48} quality={65} loading={loading} priority={priority} className="h-auto w-12 flex-shrink-0 object-cover" />
			</div>
			<div className="px-2" />
			<div className="flex flex-grow flex-col items-start py-2">
				<div className="text-sm font-medium group-hover:underline">{product.title}</div>
				<p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
				<div className="mt-auto text-sm font-semibold">${Number(product.price.amount).toFixed(2)}</div>
			</div>
		</Link>
	);
}
