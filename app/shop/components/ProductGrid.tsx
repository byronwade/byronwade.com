"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/shopify";

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

export default function ProductGrid({ products }: { products: Product[] }) {
	return (
		<motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product, index) => (
				<ProductCard key={product.id} product={product} priority={index < 6} />
			))}
		</motion.div>
	);
}
