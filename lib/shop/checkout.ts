import { shopProducts } from "@/lib/shop/products";

const UNAVAILABLE =
	"Shop coming soon. Test checkout is unavailable right now. Please check back later.";
const RETRY = "Couldn't open test checkout. Please try again. No payment was taken on this site.";

// Server consumers only. Never pass credentials to a component or return provider errors.
function getTestKey(): string | undefined {
	const key = process.env.STRIPE_SECRET_KEY;
	return key?.startsWith("sk_test_") && key.length > "sk_test_".length ? key : undefined;
}

export function isTestCheckoutEnabled(): boolean {
	return getTestKey() !== undefined;
}

type CheckoutResult = { ok: true; url: string } | { ok: false; error: string };

export async function createTestCheckout(
	productId: unknown,
	origin: string,
	requestId: string
): Promise<CheckoutResult> {
	// Fail closed before validation, request construction, or any Stripe network activity.
	const key = getTestKey();
	if (!key) {
		return { ok: false, error: UNAVAILABLE };
	}
	const product = shopProducts.find((candidate) => candidate.id === productId);
	if (!product) {
		return { ok: false, error: "Choose one of the placeholder products and try again." };
	}

	try {
		const body = new URLSearchParams({
			mode: "payment",
			integration_identifier: "byronwade_shop_preview_qvkmwrpx",
			success_url: new URL("/shop/success", origin).href,
			cancel_url: new URL("/shop/cancel", origin).href,
			"line_items[0][quantity]": "1",
			"line_items[0][price_data][currency]": product.currency,
			"line_items[0][price_data][unit_amount]": String(product.unitAmount),
			"line_items[0][price_data][product_data][name]": `${product.name} (${product.placeholderLabel})`,
			"line_items[0][price_data][product_data][description]":
				"Test-only placeholder. No goods or files will be delivered.",
			"metadata[product_id]": product.id,
			"metadata[placeholder]": "true",
			"custom_text[submit][message]":
				"Test checkout only. Placeholder - pending Byron's choice. No goods or files will be delivered.",
		});
		const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${key}`,
				"Content-Type": "application/x-www-form-urlencoded",
				"Idempotency-Key": `shop-${product.id}-${requestId}`,
				"Stripe-Version": "2026-09-30.endive",
			},
			body,
			cache: "no-store",
			signal: AbortSignal.timeout(10_000),
		});
		if (!response.ok) {
			return { ok: false, error: RETRY };
		}
		const session: unknown = await response.json();
		if (
			!session ||
			typeof session !== "object" ||
			!("livemode" in session) ||
			session.livemode !== false ||
			!("id" in session) ||
			typeof session.id !== "string" ||
			!session.id.startsWith("cs_test_") ||
			!("url" in session) ||
			typeof session.url !== "string"
		) {
			return { ok: false, error: RETRY };
		}
		const url = new URL(session.url);
		if (url.origin !== "https://checkout.stripe.com" || url.username || url.password) {
			return { ok: false, error: RETRY };
		}
		return { ok: true, url: url.href };
	} catch {
		// Network failures and malformed provider responses share a safe, recoverable message.
		return { ok: false, error: RETRY };
	}
}
