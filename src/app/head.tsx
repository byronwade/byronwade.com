import { NextSeo } from "next-seo";
import { NEXT_SEO_DEFAULT } from "../../next-seo.config";

export default function Head() {
	return (
		<>
			<NextSeo {...NEXT_SEO_DEFAULT} useAppDir={true} />
		</>
	);
}
