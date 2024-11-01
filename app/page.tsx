import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/sections/hero"));

export default function Home() {
	return (
		<>
			<Hero />
		</>
	);
}
