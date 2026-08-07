import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { HomeActions } from "./home-actions";

/**
 * The post that carries the full account of the plumbing company closing.
 * Named here so the claim in the opening and the caveat on the figure both
 * point at the same source, and so a rename breaks the build rather than
 * leaving the claim unsupported.
 */
const FAILURE_POST_SLUG = "scaling-plumbing-business";

/**
 * Homepage opening: Showcase profile, claim-and-proof composed as a title card.
 *
 * The earlier attempt at "cinematic" reached for atmosphere: a fixed dot grid, a
 * brand glow, and a gradient wash behind an otherwise ordinary document.
 * DESIGN.md §13 rejects all three by name, and they were the reason the page read
 * as a template with effects on top. Those layers are gone; the drama here comes
 * from the four things the standard does allow.
 *
 * 1. Framing. The opening owns a viewport and is composed inside it, silence at
 *    the top, content weighted to the lower third, the proof band as the floor.
 *    `justify-end` is what produces that; a centred block cannot.
 * 2. Range. The claim is the one page-defining statement where scale is earned
 *    (§5.2), so it runs to 80px while the lede drops to body size. The gap
 *    between them is the hierarchy, not a second colour or a heavier weight.
 * 3. Editing. One action. The five social pills that used to sit under the claim
 *    were the least cinematic thing on the page; they live in the footer, which
 *    is where a visitor looks for them anyway.
 * 4. Sequence. Locator, claim, lede and action, proof, staged in that order.
 *    §6.1 puts first-view page entrance in the row where the delight budget may
 *    be spent, and this spends it once.
 *
 * §7.1 still governs: the proof is inside the first screen, not below it. The
 * opening is a title card *with the figures on it*, not a claim-only splash.
 *
 * Server-rendered. The only client island is the action row.
 */

/**
 * One shipped-evidence fact. Tabular numerals per DESIGN.md §5.2.
 *
 * Nothing here is tinted. `$2.4M` was previously set in the success green, which
 * §5.1 reserves for a positive outcome, and the outcome was that the company
 * closed. Colouring a revenue figure green while the label says the business
 * failed would have made the palette contradict the copy, so every figure is
 * neutral and the label carries the meaning.
 */
function Fact({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex flex-col gap-1.5">
			<dt className="sr-only">{label}</dt>
			<dd className="font-semibold text-2xl text-foreground tabular-nums tracking-tight sm:text-4xl">
				{value}
			</dd>
			<p aria-hidden="true" className="text-muted-foreground text-xs sm:text-sm">
				{label}
			</p>
		</div>
	);
}

export async function HomeHero() {
	// Derived, not hardcoded, so the claim cannot drift from the content.
	const shippedProjects = (await getProjects()).length;

	return (
		// The subtraction accounts for the shell's own padding and the fixed dock
		// clearance, so the scene fills the frame exactly once instead of forcing a
		// scroll of a few dozen pixels.
		<section className="flex min-h-[calc(100svh-11rem)] flex-col justify-end gap-8 sm:min-h-[calc(100svh-9rem)] sm:gap-12">
			<p className="reveal max-w-xs text-balance text-muted-foreground text-sm sm:max-w-none">
				Byron Wade. I build software for service businesses.
			</p>

			{/* One statement, balanced rather than hand-broken: forced line breaks
			    read as composition at one width and as raggedness at every other.
			    The reversal in the middle is the point. §9 requires claims here to
			    stay qualified, and the company closing is the qualification. Writing
			    it as a success would have been the easier headline and a false one. */}
			<h1 className="reveal reveal-delay-1 max-w-4xl text-balance font-heading font-semibold text-[2.6rem] leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[5rem] lg:leading-[0.94]">
				I grew a plumbing company to $2.4M. Then I lost it. Now I build the software it needed.
			</h1>

			<div className="reveal reveal-delay-2 flex flex-col gap-6">
				<p className="max-w-md text-base text-muted-foreground leading-relaxed">
					Dispatch, phones, reputation, and the design system underneath them. I got the problems
					from running the company. The answers ship as code.{" "}
					<Link className="link-underline" href={`/blog/${FAILURE_POST_SLUG}`}>
						Here is what went wrong
					</Link>
					.
				</p>

				<HomeActions />
			</div>

			{/* The floor of the frame, and the proof that stays inside the first screen. */}
			<dl className="reveal reveal-delay-3 grid grid-cols-3 gap-4 border-border border-t pt-6 sm:gap-10 sm:pt-8">
				<Fact label="Year-two revenue, before it closed" value="$2.4M" />
				<Fact label="Years shipping software" value="8+" />
				<Fact label="Projects written up here" value={String(shippedProjects)} />
			</dl>
		</section>
	);
}
