import { gradientFor } from "@/lib/identity";
import { cn } from "@/lib/utils";

const sizes = { sm: "size-6", md: "size-8", lg: "size-10", xl: "size-16" } as const;

/** Radial-gradient avatar disc derived deterministically from a seed (anonymous identities). */
export function GradientAvatar({
	seed,
	size = "md",
	className,
}: {
	seed: string;
	size?: keyof typeof sizes;
	className?: string;
}) {
	const g = gradientFor(seed);
	return (
		<span
			aria-hidden
			className={cn("inline-block shrink-0 rounded-full", sizes[size], className)}
			style={{ backgroundImage: `radial-gradient(circle at 30% 30%, ${g.from}, ${g.to})` }}
		/>
	);
}
