"use client";

import { Check, Copy, Mail, Send, X } from "lucide-react";
import { useState } from "react";

interface InlineContactProps {
	open: boolean;
	onClose: () => void;
	email?: string;
}

export function InlineContact({
	open,
	onClose,
	email = "byron@byronwade.com",
}: InlineContactProps) {
	const [copied, setCopied] = useState(false);

	if (!open) return null;

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			/* clipboard unavailable */
		}
	};

	return (
		<section
			className="reveal w-full overflow-hidden rounded-2xl border border-border bg-card shadow-card"
			aria-label="Contact"
		>
			<div className="flex items-center justify-between border-b border-border px-4 py-3">
				<span className="text-sm font-medium">Contact</span>
				<button
					type="button"
					onClick={onClose}
					className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					aria-label="Close"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
			<div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
				<a
					href={`mailto:${email}`}
					className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
				>
					<Mail className="h-4 w-4" />
					{email}
				</a>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={copyEmail}
						className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
					>
						{copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
						{copied ? "Copied" : "Copy"}
					</button>
					<a
						href={`mailto:${email}`}
						className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
					>
						<Send className="h-4 w-4" />
						Email
					</a>
				</div>
			</div>
		</section>
	);
}
