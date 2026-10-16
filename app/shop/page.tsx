import { randomUUID } from "node:crypto";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { CheckoutForm } from "@/components/shop";
import { generateMetadata } from "@/lib/seo";
import { isTestCheckoutEnabled } from "@/lib/shop/checkout";
import { shopProducts } from "@/lib/shop/products";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = generateMetadata({
	title: "Shop",
	description: "A preview of Byron Wade's shop. Placeholder products and test checkout only.",
	canonical: `${siteUrl}/shop`,
	noindex: true,
});

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function ShopPage() {
	const enabled = isTestCheckoutEnabled();

	return (
		<SiteShell width="wide">
			<div className="flex flex-col gap-12">
				<div className="grid gap-6 md:grid-cols-2 md:gap-12">
					<PageHeader
						className="animate-none!"
						title="Shop"
						lede="A small collection, still taking shape. A place for useful things from the work of building software."
					/>
					<aside
						aria-labelledby="shop-availability"
						className="flex flex-col gap-2 border-border border-l-2 pl-6"
					>
						<h2 id="shop-availability" className="font-medium">
							{enabled ? "Test checkout only" : "Shop coming soon"}
						</h2>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{enabled
								? "You can try Stripe Checkout in test mode. Use test payment details only."
								: "Checkout is unavailable for now. You can browse the placeholder collection below."}
						</p>
						<p className="text-muted-foreground text-sm leading-relaxed">
							All products and prices are illustrative. Nothing is for sale or delivery yet.
						</p>
					</aside>
				</div>

				<section aria-labelledby="collection-heading" className="flex flex-col gap-6">
					<div className="flex flex-wrap items-baseline justify-between gap-3">
						<h2
							id="collection-heading"
							className="font-heading font-semibold text-xl tracking-tight"
						>
							The preview collection
						</h2>
						<p className="text-muted-foreground text-sm">3 concepts · Illustrative prices in USD</p>
					</div>
					<ol className="divide-y divide-border border-border border-y">
						{shopProducts.map((product, index) => (
							<li
								key={product.id}
								className="grid gap-6 py-8 sm:grid-cols-[auto_1fr_auto] sm:gap-8"
							>
								<span aria-hidden="true" className="pt-1 font-mono text-muted-foreground text-sm">
									{String(index + 1).padStart(2, "0")}
								</span>
								<div className="flex max-w-lg flex-col items-start gap-3">
									<p className="text-muted-foreground text-sm">{product.format}</p>
									<h3 className="font-heading font-medium text-xl tracking-tight">
										{product.name}
									</h3>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{product.description}
									</p>
									<p className="rounded-md bg-muted px-3 py-1 text-foreground text-sm">
										{product.placeholderLabel}
									</p>
								</div>
								<div className="flex flex-col items-start justify-between gap-4 sm:items-end">
									<p className="font-mono text-lg tabular-nums">
										{priceFormatter.format(product.unitAmount / 100)}
									</p>
									{enabled ? (
										<CheckoutForm
											productId={product.id}
											productName={product.name}
											requestId={randomUUID()}
										/>
									) : (
										<p className="text-muted-foreground text-sm">Coming soon</p>
									)}
								</div>
							</li>
						))}
					</ol>
				</section>
				<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
					This is an early preview. Byron is still choosing what belongs here. Test checkouts do not
					place an order, reserve a product, or deliver a download.
				</p>
			</div>
		</SiteShell>
	);
}
