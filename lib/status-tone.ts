/** The design-system status vocabulary. Owned here so UI depends on lib, not the reverse. */
export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

/**
 * Map a free-text status label to a design-system status tone. The label is
 * always rendered beside the tone, so status never relies on colour alone, and
 * nothing pulses: Thorbis reserves pulsing for work that is actually busy.
 */
export function statusTone(status?: string): { tone: StatusTone } | null {
	if (!status) {
		return null;
	}
	const s = status.toLowerCase();
	if (s.includes("live") || s.includes("shipped")) {
		return { tone: "success" };
	}
	if (s.includes("dev") || s.includes("progress") || s.includes("beta")) {
		return { tone: "warning" };
	}
	if (s.includes("open source") || s.includes("oss")) {
		return { tone: "info" };
	}
	return { tone: "neutral" };
}
