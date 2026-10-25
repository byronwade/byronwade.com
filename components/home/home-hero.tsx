// Thorbis Design port: rules/page + guidelines/specimen @ 46b6654.
// Showcase adaptation; provenance and sync: docs/THORBIS-DESIGN-PORT.md.
import Link from "next/link";
import { Orbit } from "@/components/common/orbit";
import { Sheet } from "@/components/layout/sheet";
import { ArrowRight, ArrowUpRight } from "@/lib/icons";
import { getProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { HomeActions } from "./home-actions";

/**
 * The chain Thorbis organizes, in the order a service call moves through it.
 * Stages, not records: there are no invented customers or totals here, so the
 * specimen cannot be mistaken for live product data.
 */
const CHAIN = [
	{ stage: "Call", detail: "The customer and the job, from the first conversation" },
	{ stage: "Schedule", detail: "An estimate and a time on the calendar" },
	{ stage: "Dispatch", detail: "The right tech, with the job’s history" },
	{ stage: "Invoice", detail: "Priced from the work that was done" },
] as const;

function Fact({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex flex-col gap-1">
			<dt className="text-copy-12 text-muted-foreground">{label}</dt>
			<dd className="order-first font-medium text-heading-20 tabular-nums">{value}</dd>
		</div>
	);
}

function ThorbisSpecimen() {
	return (
		<Sheet caption="The chain Thorbis organizes, plotted as a flight path. An outline of the product’s scope, not live data.">
			<div className="flex flex-col gap-1.5 px-1.5 pt-1 pb-3">
				<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
					<h2 className="font-medium text-copy-14 text-foreground">
						What I’m building <span className="text-muted-foreground">·</span> Thorbis
					</h2>
					<a
						className="link-action text-copy-13"
						href="https://thorbis.com"
						rel="noopener noreferrer"
						target="_blank"
					>
						Explore Thorbis
						<ArrowUpRight aria-hidden="true" className="size-3.5" />
						<span className="sr-only"> (opens in a new tab)</span>
					</a>
				</div>
				<p className="font-medium text-copy-14 text-foreground">
					Software for the people who keep things running.
				</p>
				<p className="text-pretty text-body text-copy-14">
					From the first customer call to the last invoice. Product engineering and a shared design
					system, grounded in the work of a service business.
				</p>
			</div>
			{/* The stages read as one flight path: a dashed trajectory through a node per
			    stage, ending on the filled node where the work lands. On the measure each
			    stage is one ledger line; phones stack the detail under the stage. */}
			<ol className="relative flex flex-col gap-0.5">
				<span
					aria-hidden="true"
					className="absolute top-5 bottom-5 left-[0.6875rem] border-(--space-orbit) border-l border-dashed"
				/>
				{CHAIN.map(({ stage, detail }, index) => (
					<li
						className="grid grid-cols-[0.625rem_auto_minmax(0,1fr)] items-baseline gap-x-3 rounded-md px-1.5 py-2 sm:grid-cols-[0.625rem_auto_5.5rem_minmax(0,1fr)]"
						key={stage}
					>
						<span
							aria-hidden="true"
							className={cn(
								"relative size-2.5 self-center rounded-full border",
								index === CHAIN.length - 1
									? "border-brand bg-brand"
									: "border-(--space-rim) bg-card"
							)}
						/>
						<span className="text-copy-12 text-muted-foreground tabular-nums">
							{String(index + 1).padStart(2, "0")}
						</span>
						<span className="font-medium text-copy-14 text-foreground">{stage}</span>
						<span className="col-start-3 text-pretty text-body text-copy-14 sm:col-start-auto">
							{detail}
						</span>
					</li>
				))}
			</ol>
		</Sheet>
	);
}

export async function HomeHero() {
	const projects = await getProjects();
	return (
		// Claim, then the product it led to, then the facts behind the claim: one
		// column on the shared measure, so the title keeps the header's edge.
		<section aria-labelledby="home-title" className="flex flex-col gap-8">
			{/* From md the opening shares its row with a small planetary system: the
			    theme's one figure, set beside the claim so it never sits under text. */}
			<div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_11rem]">
				<div className="flex flex-col items-start gap-5">
					<p className="text-copy-13 text-muted-foreground">
						Byron Wade <span aria-hidden="true">·</span> Product engineer and founder
					</p>
					<h1
						className="wrap-anywhere max-w-xl text-balance font-medium text-heading-32 tracking-tight"
						id="home-title"
					>
						I ran the service business. Now I build the software it needed.
					</h1>
					{/* The story behind the claim is a link inside the lede, not a third
				    stranded action under the buttons: the opening ends on its CTAs. */}
					<p className="max-w-xl text-pretty text-body text-copy-16 leading-relaxed">
						I grew a plumbing company to $2.4M in year two. Then it closed. Dispatch, phones,
						reputation: I learned the problems firsthand. Today I turn those lessons into products
						for the trades.{" "}
						<Link
							prefetch={false}
							className="link-underline"
							href="/blog/scaling-plumbing-business"
						>
							Read what went wrong, and what I learned
						</Link>
						.
					</p>
					<HomeActions arrow={<ArrowRight aria-hidden="true" className="size-4" />} />
				</div>
				<Orbit className="hidden size-44 md:block" />
			</div>
			<ThorbisSpecimen />
			<dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,5rem),1fr))] gap-4">
				<Fact label="Year-two revenue, before closing" value="$2.4M" />
				<Fact label="Years shipping software" value="8+" />
				<Fact label="Projects documented here" value={String(projects.length)} />
			</dl>
		</section>
	);
}
