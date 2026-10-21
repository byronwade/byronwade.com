"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRevealedEmail } from "@/hooks/use-revealed-email";
import { analytics } from "@/lib/analytics";
import { Check, Download, Mail } from "@/lib/icons";
import { fetchResumePdf, RESUME_PDF_FILENAME, shouldHandleResumeDownload } from "@/lib/resume-pdf";

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
			<span role="status" className="text-copy-14 print:hidden">
				{STATUS_TEXT[status]}
			</span>
		</span>
	);
}

type DownloadPhase = "idle" | "pending" | "failed";

const DOWNLOAD_STATUS: Record<DownloadPhase, string> = {
	idle: "",
	pending: "Preparing the PDF…",
	failed: "Couldn’t create the PDF. Try again.",
};

function saveResumePdf(blob: Blob) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = RESUME_PDF_FILENAME;
	document.body.append(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Download button. A plain click saves the file here so an error is not stored
 * as a PDF. Without JavaScript, or with a modified click, the link still opens
 * the route and the server's Content-Disposition names a real PDF.
 */
export function DownloadResumeButton() {
	const [phase, setPhase] = useState<DownloadPhase>("idle");
	const pending = useRef<AbortController | null>(null);

	// Leaving the page cancels a pending download, so a late PDF is never saved
	// while the visitor is reading something else.
	useEffect(() => () => pending.current?.abort(), []);

	const onClick = async (event: MouseEvent<HTMLAnchorElement>) => {
		if (!shouldHandleResumeDownload(event)) {
			return;
		}
		event.preventDefault();
		if (pending.current) {
			return;
		}
		const controller = new AbortController();
		pending.current = controller;
		setPhase("pending");
		const pdf = await fetchResumePdf({ signal: controller.signal });
		pending.current = null;
		if (controller.signal.aborted) {
			setPhase("idle");
			return;
		}
		if (pdf) {
			saveResumePdf(pdf);
			analytics.resumeDownload("pdf");
		}
		setPhase(pdf ? "idle" : "failed");
	};

	return (
		<span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
			<Button
				variant="outline"
				render={
					<a aria-busy={phase === "pending"} href="/api/resume-pdf" onClick={onClick}>
						<Download className="size-3.5" aria-hidden="true" />
						Download PDF
					</a>
				}
			/>
			<span role="status" className="text-copy-14 print:hidden">
				{DOWNLOAD_STATUS[phase]}
			</span>
		</span>
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
