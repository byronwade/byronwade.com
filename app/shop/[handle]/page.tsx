import { getProduct } from "@/actions/shopify/getProducts";
import AddToCartButton from "@/app/shop/components/AddToCartButton";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface PageProps {
	params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: PageProps) {
	const { handle } = await params;
	const product = await getProduct(handle);

	if (!product) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid md:grid-cols-2 gap-8">
				<div className="aspect-square relative">
					<Image loading="eager" decoding="sync" quality={65} src={product.images[0].url} alt={product.images[0].altText || product.title} fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 50vw" priority />
				</div>

				<div>
					<h1 className="text-3xl font-bold mb-4">{product.title}</h1>
					<p className="text-xl mb-4">{formatPrice(product.price)}</p>
					<div className="prose mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
					<AddToCartButton variantId={product.variantId} />
				</div>
			</div>
		</div>
	);
}
