import { getProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { HomeActions } from "./home-actions";

/**
 * Homepage opening — Showcase profile, claim-and-proof composition.
 *
 * The organizing move for `/` (DESIGN.md §7.1) is claim, then immediate proof.
 * The claim is the heading, and the evidence sits in the first viewport rather
 * than below three sections of preamble. Everything here renders on the server;
 * only the action row is a client island, because only it needs state.
 */

/**
 * One shipped-evidence fact. Tabular numerals per DESIGN.md §5.2.
 *
 * `tone` is semantic, not decorative: `success` marks a positive financial
 * outcome, which is what the green family exists for (§5.1). Facts that carry no
 * status — a duration, a count — stay neutral. Colour here has to mean
 * something, or it is decoration, and the label carries the meaning on its own
 * so nothing depends on colour alone.
 */
function Fact({ value, label, tone }: { value: string; label: string; tone?: "success" }) {
	return (
		<div className="flex flex-col gap-1">
			<dt className="sr-only">{label}</dt>
			<dd
				className={cn(
					"font-semibold text-2xl tabular-nums sm:text-3xl",
					tone === "success" ? "text-success" : "text-foreground"
				)}
			>
				{value}
			</dd>
			<p aria-hidden="true" className="text-muted-foreground text-sm">
				{label}
			</p>
		</div>
	);
}

export async function HomeHero() {
	// Derived, not hardcoded, so the claim cannot drift from the content.
	const shippedProjects = (await getProjects()).length;

	return (
		<section className="flex w-full flex-col gap-10">
			<div className="reveal flex flex-col gap-6">
				<h1 className="max-w-3xl text-balance font-heading font-semibold text-4xl leading-[1.1] tracking-tight sm:text-5xl">
					I grew a plumbing company to $2.4M, then built the software it needed.
				</h1>

				<p className="max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
					I&rsquo;m Byron Wade. I build product for service businesses — dispatch, phones,
					reputation, and the design system underneath them. The problems come from the truck and
					the office; the answers ship as code.
				</p>
			</div>

			{/* Proof, in the first viewport. */}
			<dl className="reveal reveal-delay-1 grid grid-cols-2 gap-6 border-border border-y py-6 sm:grid-cols-3 sm:gap-8">
				<Fact label="Year-two revenue, built from zero" tone="success" value="$2.4M" />
				<Fact label="Years shipping software" value="8+" />
				<Fact label="Projects written up here" value={String(shippedProjects)} />
			</dl>

			<div className="reveal reveal-delay-2 flex flex-col gap-5">
				<p className="max-w-2xl text-base text-foreground leading-relaxed">
					Today I&rsquo;m building{" "}
					<a
						className="link-underline font-medium"
						href="https://thorbis.com"
						rel="noopener noreferrer"
						target="_blank"
					>
						Thorbis
					</a>
					, a field management platform for the trades. Open to conversations about product
					engineering, design systems, and software for service businesses.
				</p>

				<HomeActions />
			</div>
		</section>
	);
}
