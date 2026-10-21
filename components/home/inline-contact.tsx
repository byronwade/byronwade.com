"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { pillLinkClass } from "@/components/ui/pill";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/use-contact-form";
import { CONTACT_TOPICS } from "@/lib/contact-form";
import { Check, Copy, Loader2, Send, X } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface InlineContactProps {
	email: string;
	onClose: () => void;
	open: boolean;
}

export function InlineContact({ open, onClose, email }: InlineContactProps) {
	const [copied, setCopied] = useState(false);
	const { formData, isSubmitting, status, fieldError, handleChange, handleSubmit } =
		useContactForm();
	const formId = useId();
	const nameFieldId = `${formId}-name`;

	if (!open) {
		// Keep delivery feedback available after closing a previously opened form.
		return <Toaster />;
	}

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.warn("Clipboard copy unavailable", error);
		}
	};

	return (
		<section
			className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-card"
			aria-label="Contact"
		>
			<Toaster />
			<div className="flex items-center justify-between gap-3 px-4 pt-3">
				<div className="flex flex-col gap-0.5">
					<span className="font-medium text-copy-14">Start a conversation</span>
					<span className="text-copy-12 text-muted-foreground">
						Product builds, service software, or just an intro. Brief is fine.
					</span>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					aria-label="Close"
				>
					<X className="h-4 w-4" />
				</button>
			</div>

			<form
				noValidate
				aria-busy={isSubmitting}
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 p-4"
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor={`${formId}-name`}>Name</Label>
						<Input
							aria-invalid={fieldError?.field === "name"}
							aria-describedby={fieldError?.field === "name" ? `${formId}-name-error` : undefined}
							id={nameFieldId}
							name="name"
							autoComplete="name"
							autoFocus
							value={formData.name}
							onChange={(event) => handleChange("name", event.target.value)}
							placeholder="Alex Rivera…"
							required
						/>
						{fieldError?.field === "name" && (
							<p id={`${formId}-name-error`} className="text-copy-13 text-destructive">
								{fieldError.reason}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor={`${formId}-email`}>Email</Label>
						<Input
							aria-invalid={fieldError?.field === "email"}
							aria-describedby={fieldError?.field === "email" ? `${formId}-email-error` : undefined}
							id={`${formId}-email`}
							name="email"
							type="email"
							inputMode="email"
							autoComplete="email"
							spellCheck={false}
							value={formData.email}
							onChange={(event) => handleChange("email", event.target.value)}
							placeholder="you@company.com…"
							required
						/>
						{fieldError?.field === "email" && (
							<p id={`${formId}-email-error`} className="text-copy-13 text-destructive">
								{fieldError.reason}
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor={`${formId}-topic`}>What is this about?</Label>
					<NativeSelect
						aria-invalid={fieldError?.field === "topic"}
						aria-describedby={fieldError?.field === "topic" ? `${formId}-topic-error` : undefined}
						id={`${formId}-topic`}
						name="topic"
						value={formData.topic}
						onChange={(event) => handleChange("topic", event.target.value)}
					>
						{CONTACT_TOPICS.map((topic) => (
							<option key={topic.value} value={topic.value}>
								{topic.label}
							</option>
						))}
					</NativeSelect>
					{fieldError?.field === "topic" && (
						<p id={`${formId}-topic-error`} className="text-copy-13 text-destructive">
							{fieldError.reason}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor={`${formId}-message`}>Brief</Label>
					<Textarea
						aria-invalid={fieldError?.field === "message"}
						aria-describedby={
							fieldError?.field === "message" ? `${formId}-message-error` : undefined
						}
						id={`${formId}-message`}
						name="message"
						value={formData.message}
						onChange={(event) => handleChange("message", event.target.value)}
						placeholder="I’d like to talk about a project…"
						required
						rows={4}
						className="min-h-28 resize-y"
						onKeyDown={(event) => {
							if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
								event.currentTarget.form?.requestSubmit();
							}
						}}
					/>
					{fieldError?.field === "message" && (
						<p id={`${formId}-message-error`} className="text-copy-13 text-destructive">
							{fieldError.reason}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-wrap items-center gap-2">
						<ObfuscatedEmail className="font-medium text-copy-14 text-foreground [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_button]:min-h-11" />
						{/* Both words share one cell so the chip never changes width. */}
						<button type="button" onClick={copyEmail} className={pillLinkClass}>
							{copied ? (
								<Check aria-hidden="true" className="size-4" />
							) : (
								<Copy aria-hidden="true" className="size-4" />
							)}
							<span className="grid">
								<span className={cn("col-start-1 row-start-1", copied && "invisible")}>Copy</span>
								<span className={cn("col-start-1 row-start-1", !copied && "invisible")}>
									Copied
								</span>
							</span>
						</button>
						<span className="sr-only" role="status">
							{copied ? "Email copied" : ""}
						</span>
					</div>
					<Button type="submit" disabled={isSubmitting} className="gap-2">
						{isSubmitting ? (
							<Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
						) : (
							<Send aria-hidden="true" className="h-4 w-4" />
						)}
						Send message
					</Button>
				</div>
				<p
					aria-live="polite"
					role="status"
					className={
						status.kind === "failed"
							? "text-copy-14 text-destructive"
							: "text-copy-14 text-success-contrast"
					}
				>
					{status.kind === "sent" && "Sent. I’ll be in touch."}
					{isSubmitting && "Sending your message…"}
					{status.kind === "failed" &&
						(fieldError ? "Check the highlighted field." : status.reason)}
				</p>
			</form>
		</section>
	);
}
