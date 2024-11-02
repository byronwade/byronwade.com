import dynamic from "next/dynamic";
import { Suspense, memo } from "react";
import Image from "next/image";

// Dynamically import and memoize the Hero component
const Hero = memo(dynamic(() => import("@/components/sections/hero")));

export default function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
      </Suspense>
      <div className="h-screen bg-black">
        <Image src="/path/to/image.jpg" alt="Description" width={500} height={500} />
        wedcer
      </div>
    </>
  );
}
