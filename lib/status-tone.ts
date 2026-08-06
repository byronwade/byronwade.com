/** The design-system status vocabulary. Owned here so UI depends on lib, not the reverse. */
export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

/** Map a free-text status label to a design-system status tone. */
export function statusTone(status?: string): { tone: StatusTone; pulse: boolean } | null {
	if (!status) return null;
	const s = status.toLowerCase();
	if (s.includes("live") || s.includes("shipped")) return { tone: "success", pulse: true };
	if (s.includes("dev") || s.includes("progress") || s.includes("beta"))
		return { tone: "warning", pulse: false };
	if (s.includes("open source") || s.includes("oss")) return { tone: "info", pulse: false };
	return { tone: "neutral", pulse: false };
}
