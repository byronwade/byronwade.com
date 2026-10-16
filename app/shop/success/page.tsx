import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Link } from "@/components/ui/link";
import { generateMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata = generateMetadata({
	title: "Test checkout return",
	description: "Return from the shop's test checkout. No products are delivered.",
	canonical: `${siteUrl}/shop/success`,
	noindex: true,
});

export default function ShopSuccessPage() {
	return (
		<SiteShell>
			<div className="flex flex-col items-start gap-8">
				<PageHeader
					title="Back from test checkout"
					lede="Thanks for trying the shop preview. This checkout is for testing only, and no goods or files will be delivered."
				/>
				<p className="text-muted-foreground leading-relaxed">
					This page does not verify payment. You can view a test payment in Stripe’s test dashboard.
					All items remain placeholders pending Byron’s choice.
				</p>
				<Link
					href="/shop"
					className="link-underline focus-ring inline-flex min-h-11 items-center rounded-sm"
				>
					Return to the shop
				</Link>
			</div>
		</SiteShell>
	);
}
