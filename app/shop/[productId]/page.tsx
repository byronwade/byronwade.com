import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { CheckoutForm } from "@/components/shop";
import { Link } from "@/components/ui/link";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { isTestCheckoutEnabled } from "@/lib/shop/checkout";
import { shopPriceFormatter, shopProducts } from "@/lib/shop/products";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

interface ProductPageProps {
	params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
	const { productId } = await params;
	const product = shopProducts.find((candidate) => candidate.id === productId);
	if (!product) {
		notFound();
	}
	return generateSEOMetadata({
		title: `${product.name} · Shop preview`,
		description: `${product.description} Test-only placeholder; nothing is for sale or delivery.`,
		canonical: `${siteUrl}/shop/${product.id}`,
		noindex: true,
	});
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { productId } = await params;
	const product = shopProducts.find((candidate) => candidate.id === productId);
	if (!product) {
		notFound();
	}
	const enabled = isTestCheckoutEnabled();

	return (
		<SiteShell>
			<div className="flex flex-col items-start gap-8">
				<Link
					href="/shop"
					className="inline-flex min-h-11 items-center text-copy-14 hover:underline"
				>
					Return to the shop
				</Link>
				<div className="flex flex-col items-start gap-3">
					<p className="text-copy-14 text-muted-foreground">{product.format}</p>
					<PageHeader title={product.name} lede={product.description} />
					<p className="rounded-md bg-muted px-3 py-1 text-copy-14">{product.placeholderLabel}</p>
				</div>
				<section
					aria-labelledby="product-availability"
					className="flex w-full flex-col gap-4 border-border border-y py-6"
				>
					<h2 id="product-availability" className="font-medium text-heading-20">
						{enabled ? "Test checkout only" : "Shop coming soon"}
					</h2>
					<p className="text-copy-14 text-muted-foreground">
						Illustrative price · USD
						<span className="mt-1 block font-mono text-foreground text-heading-20 tabular-nums">
							{shopPriceFormatter.format(product.unitAmount / 100)}
						</span>
					</p>
					<p className="text-copy-14 text-muted-foreground leading-relaxed">
						{enabled
							? "You can try Stripe Checkout in test mode. Use test payment details only."
							: "Checkout is unavailable for now. Please check back later."}
					</p>
					{enabled && (
						<CheckoutForm
							productId={product.id}
							productName={product.name}
							requestId={randomUUID()}
						/>
					)}
				</section>
				<p className="text-copy-14 text-muted-foreground leading-relaxed">
					Byron is still choosing what belongs here. All products and prices are illustrative. Test
					checkouts do not place an order, reserve a product, or deliver a download.
				</p>
			</div>
		</SiteShell>
	);
}
