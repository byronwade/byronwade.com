"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AddToCartButtonProps {
	variantId: string;
}

export default function AddToCartButton({ variantId }: AddToCartButtonProps) {
	const { toast } = useToast();

	const handleAddToCart = async () => {
		try {
			// Add to cart logic here
			toast({
				title: "Added to cart",
				description: "The item has been added to your cart.",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to add item to cart. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<Button onClick={handleAddToCart} className="w-full">
			Add to Cart
		</Button>
	);
}
