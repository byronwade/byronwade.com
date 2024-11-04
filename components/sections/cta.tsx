import { Vortex } from "@/components/ui/vortex";
import { Button } from "@/components/ui/button";

export default function CTA() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
			<Vortex className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full">
				<h2 className="text-2xl md:text-6xl font-bold text-center">The hell is this?</h2>
				<p className="text-sm md:text-2xl max-w-xl mt-6 text-center">This is chemical burn. It&apos;ll hurt more than you&apos;ve ever been burned and you&apos;ll have a scar.</p>
				<div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
					<Button variant="default">Order now</Button>
					<Button variant="secondary">Watch trailer</Button>
				</div>
			</Vortex>
		</div>
	);
}
