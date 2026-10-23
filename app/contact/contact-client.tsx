"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/use-contact-form";
import { CONTACT_TOPICS } from "@/lib/contact-form";

const ContactSentToast = dynamic(
	() => import("@/components/common/contact-sent-toast").then((module) => module.ContactSentToast),
	{ ssr: false }
);

// Guided profile: one focused task, with persistent feedback and recoverable drafts.
// The page renders the submit glyphs, so their definitions stay out of this form's JavaScript.
export default function ContactClient({
	icons,
}: {
	icons: { send: ReactNode; sending: ReactNode };
}) {
	const { formData, isSubmitting, status, fieldError, handleChange, handleSubmit } =
		useContactForm();

	return (
		// Narrow, not wide. A single form has no business spanning a five-column
		// shell; the measure is the point on a page with one task.
		<SiteShell profile="guided">
			<PageHeader
				lede="Product engineering, software for service businesses, and design systems that have to ship. Tell me what you’re working on and I usually reply within a day or two."
				title="Get in touch"
			/>

			<form
				aria-busy={isSubmitting}
				noValidate
				className="flex flex-col gap-5"
				onSubmit={handleSubmit}
			>
				<div className="grid gap-5 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							autoComplete="name"
							aria-invalid={fieldError?.field === "name"}
							aria-describedby={fieldError?.field === "name" ? "name-error" : undefined}
							id="name"
							name="name"
							onChange={(e) => handleChange("name", e.target.value)}
							placeholder="Alex Rivera…"
							required
							value={formData.name}
						/>
						{fieldError?.field === "name" && (
							<p id="name-error" className="text-copy-13 text-destructive">
								{fieldError.reason}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							autoComplete="email"
							inputMode="email"
							spellCheck={false}
							aria-invalid={fieldError?.field === "email"}
							aria-describedby={fieldError?.field === "email" ? "email-error" : undefined}
							id="email"
							name="email"
							onChange={(e) => handleChange("email", e.target.value)}
							placeholder="you@example.com…"
							required
							type="email"
							value={formData.email}
						/>
						{fieldError?.field === "email" && (
							<p id="email-error" className="text-copy-13 text-destructive">
								{fieldError.reason}
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="topic">What is this about?</Label>
					{/* A select is a well, the same sink as the text fields. */}
					<NativeSelect
						aria-invalid={fieldError?.field === "topic"}
						aria-describedby={fieldError?.field === "topic" ? "topic-error" : undefined}
						id="topic"
						name="topic"
						onChange={(e) => handleChange("topic", e.target.value)}
						value={formData.topic}
					>
						{CONTACT_TOPICS.map((topic) => (
							<option key={topic.value} value={topic.value}>
								{topic.label}
							</option>
						))}
					</NativeSelect>
					{fieldError?.field === "topic" && (
						<p id="topic-error" className="text-copy-13 text-destructive">
							{fieldError.reason}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="message">Message</Label>
					{/* `field-sizing-content` on the primitive overrides `rows`, so the
						    empty field collapsed to 64px, which was the smallest thing on a page whose
						    entire job is writing a message. The floor is set here. */}
					<Textarea
						className="min-h-40 resize-y"
						aria-invalid={fieldError?.field === "message"}
						aria-describedby={fieldError?.field === "message" ? "message-error" : undefined}
						id="message"
						name="message"
						onChange={(e) => handleChange("message", e.target.value)}
						onKeyDown={(e) => {
							if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
								e.currentTarget.form?.requestSubmit();
							}
						}}
						placeholder="I’d like to talk about a project…"
						required
						rows={8}
						value={formData.message}
					/>
					{fieldError?.field === "message" && (
						<p id="message-error" className="text-copy-13 text-destructive">
							{fieldError.reason}
						</p>
					)}
				</div>

				<div className="flex flex-wrap items-center gap-4">
					<Button className="gap-2" disabled={isSubmitting} type="submit">
						{isSubmitting ? icons.sending : icons.send}
						Send message
					</Button>

					{/* Persistent outcome, announced. The toast is the echo, not the record. */}
					<p
						aria-live="polite"
						className={
							status.kind === "failed"
								? "text-copy-14 text-destructive"
								: "text-copy-14 text-success-contrast"
						}
						role="status"
					>
						{status.kind === "sent" && "Sent. I’ll be in touch."}
						{isSubmitting && "Sending your message…"}
						{status.kind === "failed" &&
							(fieldError ? "Check the highlighted field." : status.reason)}
					</p>
				</div>
			</form>

			{/* The fallback, not a second column. */}
			<p className="text-copy-14 text-muted-foreground">
				Prefer email? <ObfuscatedEmail className="text-foreground" variant="link" />
				{" · "}
				Jasper, GA
			</p>
			{/* Last, so the toaster's empty region never pushes the page down. */}
			{status.kind === "sent" ? <ContactSentToast /> : null}
		</SiteShell>
	);
}
