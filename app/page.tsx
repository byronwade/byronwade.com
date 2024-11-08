import dynamic from "next/dynamic";
import { Suspense, memo } from "react";

// Dynamically import and memoize the Hero component
const Hero = memo(dynamic(() => import("@/components/sections/hero")));
const CTA = memo(dynamic(() => import("@/components/sections/cta")));
const Features = memo(dynamic(() => import("@/components/sections/features")));

const Home = () => {
	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<Hero />
			</Suspense>

			<Suspense fallback={<div>Loading...</div>}>
				<CTA />
			</Suspense>

			<Suspense fallback={<div>Loading...</div>}>
				<Features />
			</Suspense>
		</>
	);
};

export default memo(Home);
