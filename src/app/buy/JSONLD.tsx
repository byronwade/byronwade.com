import { ProductJsonLd } from "next-seo";

export default function JSONLD() {
	return (
		<>
			<ProductJsonLd
				useAppDir={true}
				productName="Executive Anvil"
				images={[
					"https://example.com/photos/1x1/photo.jpg",
					"https://example.com/photos/4x3/photo.jpg",
					"https://example.com/photos/16x9/photo.jpg",
				]}
				description="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height."
				brand="ACME"
				color="blue"
				manufacturerName="Gary Meehan"
				manufacturerLogo="https://www.example.com/photos/logo.jpg"
				material="steel"
				slogan="For the business traveller looking for something to drop from a height."
				disambiguatingDescription="Executive Anvil, perfect for the business traveller."
				releaseDate="2014-02-05T08:00:00+08:00"
				productionDate="2015-02-05T08:00:00+08:00"
				purchaseDate="2015-02-06T08:00:00+08:00"
				award="Best Executive Anvil Award."
				reviews={[
					{
						author: "Jim",
						datePublished: "2017-01-06T03:37:40Z",
						reviewBody:
							"This is my favorite product yet! Thanks Nate for the example products and reviews.",
						name: "So awesome!!!",
						reviewRating: {
							bestRating: "5",
							ratingValue: "5",
							worstRating: "1",
						},
						publisher: {
							type: "Organization",
							name: "TwoVit",
						},
					},
				]}
				aggregateRating={{
					ratingValue: "4.4",
					reviewCount: "89",
				}}
				offers={[
					{
						price: "119.99",
						priceCurrency: "USD",
						priceValidUntil: "2020-11-05",
						itemCondition: "https://schema.org/UsedCondition",
						availability: "https://schema.org/InStock",
						url: "https://www.example.com/executive-anvil",
						seller: {
							name: "Executive Objects",
						},
					},
					{
						price: "139.99",
						priceCurrency: "CAD",
						priceValidUntil: "2020-09-05",
						itemCondition: "https://schema.org/UsedCondition",
						availability: "https://schema.org/InStock",
						url: "https://www.example.ca/executive-anvil",
						seller: {
							name: "Executive Objects",
						},
					},
				]}
				mpn="925872"
			/>
		</>
	);
}
