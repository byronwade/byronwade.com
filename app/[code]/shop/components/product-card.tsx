"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/components/ui/link";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "@/types/shopify";

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

interface ProductCardProps {
	product: Product;
	priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
	return (
		<motion.div variants={item} className="group relative flex flex-col overflow-hidden rounded-lg border bg-card">
			<Link href={`/shop/${product.handle}`} className="relative aspect-square overflow-hidden">
				<Image src={product.image?.url ?? "/placeholder.svg"} alt={product.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority={priority} />
			</Link>

			<div className="flex flex-1 flex-col justify-between p-6">
				<div className="flex-1">
					<Link href={`/shop/${product.handle}`} className="block">
						<h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{product.title}</h3>
						<p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
					</Link>
				</div>

				<div className="mt-6 flex items-center justify-between">
					<p className="text-lg font-semibold">${Number(product.price.amount).toFixed(2)}</p>
					<AddToCartButton variantId={product.variantId ?? ""} disabled={!product.availableForSale} />
				</div>
			</div>
		</motion.div>
	);
}
