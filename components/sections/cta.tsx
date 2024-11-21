import { Vortex } from "@/components/ui/vortex";
import { Button } from "@/components/ui/button";

export default function CTA() {
	return (
		<section className="min-h-[100dvh] w-full flex items-center justify-center py-8 md:py-16 overflow-hidden">
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
				<Vortex className="flex items-center flex-col justify-center px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20 w-full">
					<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 sm:mb-8">The hell is this?</h2>
					<p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl text-center mb-8 sm:mb-10">This is chemical burn. It&apos;ll hurt more than you&apos;ve ever been burned and you&apos;ll have a scar.</p>
					<div className="flex flex-col sm:flex-row items-center gap-4">
						<Button size="lg" variant="default" className="w-full sm:w-auto text-base sm:text-lg">
							Order now
						</Button>
						<Button size="lg" variant="secondary" className="w-full sm:w-auto text-base sm:text-lg">
							Watch trailer
						</Button>
					</div>
				</Vortex>
			</div>
		</section>
	);
}
