import { IndexList, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { Link } from "@/components/ui/link";
import { StatusPill } from "@/components/ui/status-pill";
import { ArrowRight, Sparkle } from "@/lib/icons";
import { safeFormatDate } from "@/lib/markdown-utils";
import type { Project } from "@/lib/projects";
import { statusTone } from "@/lib/status-tone";

/**
 * The `/projects` index: a ranked list where each row carries its own evidence
 * (DESIGN.md §7.1).
 *
 * Two things went in this rebuild. The `INDEX` label above the list was an
 * all-caps eyebrow, which §13 rejects by name, and it labelled a list that is
 * self-evidently a list. The `01 02 03` row numerals went with it: they implied
 * a rank the sort does not actually assert, flagships first, then recency, so
 * they were decoration pretending to be data, and they cost the row its whole
 * left column.
 *
 * The count survives, because "how much work is here" is a real question a
 * visitor arrives with. It sits beside each group's heading on the page.
 */

/**
 * The type mark: a single colour-coded word from the `--type-*` family.
 *
 * Set as plain coloured text rather than a filled pill, because a second pill
 * beside the status pill turns every row into a badge rack, and §13 rejects
 * making every control a pill. The word itself carries the meaning, so the hue
 * is reinforcement rather than the signal.
 */
const TYPE_TONE: Record<string, string> = {
	product: "text-type-product",
	client: "text-type-client",
	concept: "text-type-concept",
	hobby: "text-type-hobby",
};

function TypeMark({ type }: { type?: string }) {
	const tone = TYPE_TONE[type ?? ""] ?? "text-muted-foreground";
	return (
		<span
			className={`hidden shrink-0 font-medium text-copy-12 capitalize sm:inline ${type ? tone : ""}`}
		>
			{type}
		</span>
	);
}

/**
 * The right-hand marker. Exactly one of status, concept, or year, a row that
 * showed two competed with its own title for attention.
 */
function RowMarker({ project }: { project: Project }) {
	const tone = statusTone(project.status);
	if (tone) {
		return (
			<StatusPill className="justify-self-end capitalize" tone={tone.tone}>
				{project.status}
			</StatusPill>
		);
	}
	const year = safeFormatDate(project.date, "yyyy");
	if (year) {
		return (
			<span className="justify-self-end font-mono text-copy-12 text-muted-foreground tabular-nums">
				{year}
			</span>
		);
	}
	return <span />;
}

export function ProjectsIndex({ projects }: { projects: Project[] }) {
	return (
		<IndexList as="ol">
			{projects.map((project) => {
				const proof = project.outcome || project.excerpt;
				const leadMetric = project.metrics?.[0];
				const carriesEvidence = Boolean(project.featured || project.flagship);

				return (
					<li key={project.slug}>
						<Link className={indexRowLinkClass} href={`/projects/${project.slug}`}>
							{/* Same tracks on every row: title, kind, status, way in.
							    A flex row let long taglines shove the kind and status. */}
							<div className="grid grid-cols-[minmax(0,1fr)_auto_1rem] items-center gap-x-3 sm:grid-cols-[minmax(0,1fr)_5.25rem_6.5rem_1rem]">
								<span className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
									<span
										className={`min-w-0 font-medium text-copy-16 text-foreground ${indexRowAccentClass}`}
									>
										{project.title.split(":")[0]}
									</span>
									{project.flagship && (
										<Sparkle
											aria-label="Flagship"
											className="size-3 shrink-0 translate-y-px fill-brand text-brand"
										/>
									)}
									{project.tagline && (
										<span className="hidden text-copy-14 text-muted-foreground sm:inline">
											{project.tagline}
										</span>
									)}
								</span>

								<TypeMark type={project.type} />
								<RowMarker project={project} />

								<ArrowRight
									aria-hidden="true"
									className="size-4 justify-self-end text-muted-foreground transition-colors duration-(--motion-fast) ease-(--ease-out) group-hover/row:text-foreground group-focus-visible/row:text-foreground motion-reduce:transition-none"
								/>
							</div>

							{carriesEvidence && (proof || leadMetric) && (
								<div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
									{proof && <p className="max-w-2xl text-pretty text-body text-copy-14">{proof}</p>}
									{leadMetric && (
										<span className="shrink-0 font-mono text-copy-12 text-muted-foreground tabular-nums">
											<span className="font-medium text-foreground">{leadMetric.value}</span>
											{" · "}
											{leadMetric.label}
										</span>
									)}
								</div>
							)}
						</Link>
					</li>
				);
			})}
		</IndexList>
	);
}
