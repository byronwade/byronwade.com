import { NextSeo, SocialProfileJsonLd } from "next-seo";
import { NEXT_SEO_DEFAULT } from "../../next-seo.config";

export default function Head() {
	return (
		<>
			<NextSeo {...NEXT_SEO_DEFAULT} useAppDir={true} />
			<SocialProfileJsonLd
				useAppDir={true}
				type="Person"
				name="your name"
				url="http://www.your-site.com"
				sameAs={[
					"http://www.facebook.com/your-profile",
					"http://instagram.com/yourProfile",
					"http://www.linkedin.com/in/yourprofile",
					"http://plus.google.com/your_profile",
				]}
			/>
		</>
	);
}
