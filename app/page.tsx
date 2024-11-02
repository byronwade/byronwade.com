import dynamic from "next/dynamic";
import { Suspense, memo } from "react";
import Image from "next/image";

// Dynamically import and memoize the Hero component
const Hero = memo(dynamic(() => import("@/components/sections/hero")));

const Home = () => {
	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<Hero />
			</Suspense>
			<div className="h-screen bg-black">
				wedcer
			</div>
		</>
	);
};

export default memo(Home);
