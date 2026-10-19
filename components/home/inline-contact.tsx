"use client";

import dynamic from "next/dynamic";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { pillLinkClass } from "@/components/ui/pill";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/use-contact-form";
import { CONTACT_TOPICS } from "@/lib/contact-form";
import { Check, Copy, Loader2, Send, X } from "@/lib/icons";
import { cn } from "@/lib/utils";

const ContactSentToast = dynamic(
	() => import("@/components/common/contact-sent-toast").then((module) => module.ContactSentToast),
	{ ssr: false }
);

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
	// Keep the keyed notification at the same level when the form closes.
	const notification = status.kind === "sent" ? <ContactSentToast key="delivery" /> : null;
	if (!open) {
		return notification;
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
		<>
			{notification}
			<section
				className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-card"
				aria-label="Contact"
			>
				<div className="flex items-center justify-between border-border border-b px-4 py-3">
					<div className="flex flex-col">
						<span className="font-medium text-sm">Start a conversation</span>
						<span className="text-muted-foreground text-xs">
							Product builds, service software, or just an intro. Brief is fine.
						</span>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="flex size-11 shrink-0 items-center justify-center rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
								className="h-11"
								aria-invalid={fieldError?.field === "name"}
								aria-describedby={fieldError?.field === "name" ? `${formId}-name-error` : undefined}
								id={nameFieldId}
								name="name"
								autoComplete="name"
								autoFocus
								value={formData.name}
								onChange={(event) => handleChange("name", event.target.value)}
								placeholder="Your name…"
								required
							/>
							{fieldError?.field === "name" && (
								<p id={`${formId}-name-error`} className="text-destructive text-sm">
									{fieldError.reason}
								</p>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor={`${formId}-email`}>Email</Label>
							<Input
								className="h-11"
								aria-invalid={fieldError?.field === "email"}
								aria-describedby={
									fieldError?.field === "email" ? `${formId}-email-error` : undefined
								}
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
								<p id={`${formId}-email-error`} className="text-destructive text-sm">
									{fieldError.reason}
								</p>
							)}
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor={`${formId}-topic`}>What is this about?</Label>
						<select
							aria-invalid={fieldError?.field === "topic"}
							aria-describedby={fieldError?.field === "topic" ? `${formId}-topic-error` : undefined}
							id={`${formId}-topic`}
							name="topic"
							value={formData.topic}
							onChange={(event) => handleChange("topic", event.target.value)}
							className="h-11 rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm"
						>
							{CONTACT_TOPICS.map((topic) => (
								<option key={topic.value} value={topic.value}>
									{topic.label}
								</option>
							))}
						</select>
						{fieldError?.field === "topic" && (
							<p id={`${formId}-topic-error`} className="text-destructive text-sm">
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
							placeholder="A sentence or two about what you’re working on…"
							required
							rows={4}
							className="resize-y"
							onKeyDown={(event) => {
								if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
									event.currentTarget.form?.requestSubmit();
								}
							}}
						/>
						{fieldError?.field === "message" && (
							<p id={`${formId}-message-error`} className="text-destructive text-sm">
								{fieldError.reason}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-wrap items-center gap-2">
							<ObfuscatedEmail className="font-medium text-brand text-sm [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_button]:min-h-11" />
							<button type="button" onClick={copyEmail} className={cn(pillLinkClass, "min-h-11")}>
								{copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
								{copied ? "Copied" : "Copy"}
							</button>
						</div>
						<Button type="submit" disabled={isSubmitting} className="h-11 gap-2">
							{isSubmitting ? (
								<>
									<Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
									Send message
								</>
							) : (
								<>
									<Send aria-hidden="true" className="h-4 w-4" />
									Send message
								</>
							)}
						</Button>
					</div>
					<p
						aria-live="polite"
						role="status"
						className={
							status.kind === "failed" ? "text-destructive text-sm" : "text-sm text-success"
						}
					>
						{status.kind === "sent" && "Sent. I'll be in touch."}
						{isSubmitting && "Sending your message…"}
						{status.kind === "failed" &&
							(fieldError ? "Check the highlighted field." : status.reason)}
					</p>
				</form>
			</section>
		</>
	);
}
