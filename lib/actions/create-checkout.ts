"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createTestCheckout } from "@/lib/shop/checkout";
import { siteUrl } from "@/lib/site";

export async function createCheckout(
	productId: string,
	requestId: string,
	_previousState: { error: string },
	_formData: FormData
): Promise<{ error: string }> {
	// Next.js checks the Origin against Host for server actions. Return to this same
	// origin (including localhost/preview), never a callback URL supplied by the form.
	const requestHeaders = await headers();
	const origin = requestHeaders.get("origin") ?? siteUrl;
	const result = await createTestCheckout(productId, origin, requestId);
	if (!result.ok) {
		return { error: result.error };
	}
	// Redirect throws; keep it outside the checkout boundary's error handler.
	redirect(result.url);
}
