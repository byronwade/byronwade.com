import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Link } from "@/components/ui/link";
import { generateMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata = generateMetadata({
	title: "Test checkout canceled",
	description: "Return to the placeholder shop collection after leaving test checkout.",
	canonical: `${siteUrl}/shop/cancel`,
	noindex: true,
});

export default function ShopCancelPage() {
	return (
		<SiteShell>
			<div className="flex flex-col items-start gap-8">
				<PageHeader
					title="Test checkout canceled"
					lede="You left checkout. No order has been placed. The placeholder collection is here whenever you want another look."
				/>
				<p className="text-muted-foreground leading-relaxed">
					This shop is a preview with test payments only. No goods or files are available for
					delivery.
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
