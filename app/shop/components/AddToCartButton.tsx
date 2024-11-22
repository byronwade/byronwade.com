"use client";

import { useState } from "react";
import { shopifyClient } from "@/lib/shopify";
import { addToCartMutation } from "@/lib/queries/cart";
import { toast } from "@/components/ui/use-toast";

interface AddToCartButtonProps {
	variantId: string;
	disabled?: boolean;
}

export default function AddToCartButton({ variantId, disabled }: AddToCartButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const addToCart = async () => {
		setIsLoading(true);
		try {
			const { data } = await shopifyClient.request(addToCartMutation, {
				variables: {
					lines: [
						{
							quantity: 1,
							merchandiseId: variantId,
						},
					],
				},
			});

			if (data.cartCreate.cart?.checkoutUrl) {
				window.location.href = data.cartCreate.cart.checkoutUrl;
			} else {
				throw new Error("No checkout URL returned");
			}
		} catch (error) {
			console.error("Error adding to cart:", error);
			toast({
				title: "Error",
				description: "Could not add item to cart. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			onClick={addToCart}
			disabled={isLoading || disabled}
			className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
					 disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{isLoading ? "Adding to Cart..." : "Add to Cart"}
		</button>
	);
}
