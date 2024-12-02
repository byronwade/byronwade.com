import dynamic from "next/dynamic";
import { Suspense, memo } from "react";

// Dynamically import and memoize the Hero component
const Hero = memo(dynamic(() => import("@/components/sections/hero")));

const Home = () => {
	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<Hero />
			</Suspense>
		</>
	);
};

export default memo(Home);
