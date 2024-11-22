import { unstable_cache } from "next/cache";
import { shopifyClient } from "@/lib/shopify";
import { getAllProductsQuery, getProductByHandleQuery } from "@/lib/queries/products";
import type { Product } from "@/types/shopify";

export const getProducts = unstable_cache(
	async () => {
		const { data } = await shopifyClient.request(getAllProductsQuery);

		return data.products.edges.map(({ node }: any) => ({
			id: node.id,
			title: node.title,
			handle: node.handle,
			description: node.description,
			price: node.priceRange.minVariantPrice,
			image: node.images.edges[0]?.node || null,
		}));
	},
	["all-products"],
	{
		revalidate: 60, // Cache for 1 minute
		tags: ["products"],
	}
);

export const getProduct = unstable_cache(
	async (handle: string) => {
		const { data } = await shopifyClient.request(getProductByHandleQuery, {
			variables: { handle },
		});

		if (!data.product) return null;

		return {
			id: data.product.id,
			title: data.product.title,
			description: data.product.description,
			handle: data.product.handle,
			price: data.product.priceRange.minVariantPrice,
			images: data.product.images.edges.map((edge: any) => edge.node),
			variantId: data.product.variants.edges[0]?.node.id,
			availableForSale: data.product.availableForSale,
		};
	},
	["product"],
	{
		revalidate: 60,
		tags: ["products"],
	}
);
