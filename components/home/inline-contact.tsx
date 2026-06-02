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
			className="animate-in w-full overflow-hidden rounded-xl border border-accent/30 bg-card shadow-lg"
			aria-label="Contact"
		>
			<div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
				<span className="text-sm font-medium">Contact</span>
				<button
					type="button"
					onClick={onClose}
					className="rounded-md p-1 hover:bg-muted"
					aria-label="Close"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
			<div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
				<a
					href={`mailto:${email}`}
					className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
				>
					<Mail className="h-4 w-4" />
					{email}
				</a>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={copyEmail}
						className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
					>
						{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
						{copied ? "Copied" : "Copy"}
					</button>
					<a
						href={`mailto:${email}`}
						className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
					>
						<Send className="h-4 w-4" />
						Email
					</a>
				</div>
			</div>
		</section>
	);
}
