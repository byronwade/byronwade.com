import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatPrice(price: { amount: string; currencyCode: string }) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: price.currencyCode,
	}).format(Number.parseFloat(price.amount));
}
