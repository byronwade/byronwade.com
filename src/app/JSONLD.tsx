import { SocialProfileJsonLd } from "next-seo";

export default function JSONLD() {
	return (
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
	);
}
