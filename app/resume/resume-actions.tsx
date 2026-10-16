"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRevealedEmail } from "@/hooks/use-revealed-email";
import { analytics } from "@/lib/analytics";
import { Check, Download, Mail } from "@/lib/icons";

type CopyStatus = "idle" | "copied" | "failed";

const STATUS_TEXT: Record<CopyStatus, string> = {
	idle: "",
	copied: "Copied",
	failed: "Couldn’t copy. Select the address instead.",
};

/**
 * The résumé's email line. The address is decoded after mount, so prerendered
 * HTML never contains it; the PDF route waits for `data-resume-email` before
 * printing so the downloaded copy does.
 */
export function CopyEmailButton() {
	const email = useRevealedEmail();
	const [status, setStatus] = useState<CopyStatus>("idle");

	useEffect(() => {
		if (status === "idle") {
			return;
		}
		const timer = setTimeout(() => setStatus("idle"), 2500);
		return () => clearTimeout(timer);
	}, [status]);

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(email);
			setStatus("copied");
		} catch {
			setStatus("failed");
		}
	};

	return (
		<span className="inline-flex flex-wrap items-center gap-x-3">
			<button
				type="button"
				onClick={copyEmail}
				disabled={!email}
				className="inline-flex min-h-11 cursor-pointer items-center gap-2 border-none bg-transparent p-0 transition-colors hover:text-brand disabled:cursor-default"
			>
				{status === "copied" ? (
					<Check className="size-4 text-brand" aria-hidden="true" />
				) : (
					<Mail className="size-4" aria-hidden="true" />
				)}
				{email ? <span data-resume-email="">{email}</span> : <span>Email</span>}
				<span className="sr-only">, copy to clipboard</span>
			</button>
			<span role="status" className="text-sm print:hidden">
				{STATUS_TEXT[status]}
			</span>
		</span>
	);
}

/** Download button; a client island only because it reports the download. */
export function DownloadResumeButton() {
	return (
		<Button
			variant="outline"
			render={
				<a
					href="/api/resume-pdf"
					download="Byron_Wade_Resume.pdf"
					onClick={() => analytics.resumeDownload("pdf")}
				>
					<Download className="size-3.5" aria-hidden="true" />
					Download PDF
				</a>
			}
		/>
	);
}

/**
 * Paper is light. Browsers drop backgrounds when printing, so a reader in the
 * dark theme would otherwise print pale text on white. For the duration of a
 * print (Ctrl+P), swap back to the light tokens instead of duplicating them as
 * print CSS; next-themes owns the `dark` class and is restored afterwards.
 */
export function PrintInLightTheme() {
	useEffect(() => {
		const root = document.documentElement;
		let restore: (() => void) | undefined;

		const beforePrint = () => {
			if (restore || !root.classList.contains("dark")) {
				return;
			}
			const colorScheme = root.style.colorScheme;
			root.classList.remove("dark");
			root.style.colorScheme = "light";
			restore = () => {
				root.classList.add("dark");
				root.style.colorScheme = colorScheme;
			};
		};
		const afterPrint = () => {
			restore?.();
			restore = undefined;
		};

		window.addEventListener("beforeprint", beforePrint);
		window.addEventListener("afterprint", afterPrint);
		return () => {
			window.removeEventListener("beforeprint", beforePrint);
			window.removeEventListener("afterprint", afterPrint);
			afterPrint();
		};
	}, []);

	return null;
}
