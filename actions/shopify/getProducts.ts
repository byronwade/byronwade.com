"use cache";

import { shopifyClient } from "@/lib/shopify";
import { getAllProductsQuery, getProductByHandleQuery } from "@/lib/queries/products";
import { ShopifyError } from "@/lib/errors";
import { ERROR_MESSAGES, SHOPIFY } from "@/lib/constants";

interface ShopifyImage {
	url: string;
	altText: string;
	width: number;
	height: number;
}

interface ShopifyProduct {
	id: string;
	title: string;
	handle: string;
	description: string;
	priceRange: {
		minVariantPrice: {
			amount: string;
			currencyCode: string;
		};
	};
	images: {
		edges: Array<{
			node: ShopifyImage;
		}>;
	};
	variants: {
		edges: Array<{
			node: {
				id: string;
			};
		}>;
	};
	availableForSale: boolean;
}

interface ProcessedProduct {
	id: string;
	title: string;
	handle: string;
	description: string;
	price: {
		amount: string;
		currencyCode: string;
	};
	image: ShopifyImage | null;
}

interface ProcessedProductDetails extends ProcessedProduct {
	images: ShopifyImage[];
	variantId: string;
	availableForSale: boolean;
}

export async function getProducts(): Promise<ProcessedProduct[]> {
	try {
		const { data } = await shopifyClient.request(getAllProductsQuery);

		if (!data?.products?.edges) {
			throw ShopifyError.notFound(ERROR_MESSAGES.PRODUCTS.NOT_FOUND);
		}

		return data.products.edges.map(({ node }: { node: ShopifyProduct }) => ({
			id: node.id,
			title: node.title,
			handle: node.handle,
			description: node.description,
			price: node.priceRange.minVariantPrice,
			image: node.images.edges[0]?.node || null,
		}));
	} catch (error) {
		console.error("Failed to fetch products:", error);
		throw ShopifyError.fetchError(ERROR_MESSAGES.PRODUCTS.FETCH_FAILED, error);
	}
}

export async function getProduct(handle: string): Promise<ProcessedProductDetails | null> {
	if (!handle || typeof handle !== "string") {
		throw ShopifyError.invalidInput(ERROR_MESSAGES.PRODUCTS.INVALID_HANDLE);
	}

	try {
		const { data } = await shopifyClient.request(getProductByHandleQuery, {
			variables: { handle },
		});

		if (!data?.product) {
			return null;
		}

		const product = data.product as ShopifyProduct;

		return {
			id: product.id,
			title: product.title,
			description: product.description,
			handle: product.handle,
			price: product.priceRange.minVariantPrice,
			image: product.images.edges[0]?.node || null,
			images: product.images.edges.map((edge) => edge.node),
			variantId: product.variants.edges[0]?.node.id,
			availableForSale: product.availableForSale,
		};
	} catch (error) {
		console.error(`Failed to fetch product with handle ${handle}:`, error);
		throw ShopifyError.fetchError(ERROR_MESSAGES.PRODUCTS.FETCH_FAILED, error);
	}
}
