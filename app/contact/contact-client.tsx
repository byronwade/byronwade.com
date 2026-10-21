"use client";

import dynamic from "next/dynamic";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/use-contact-form";
import { CONTACT_TOPICS } from "@/lib/contact-form";
import { Loader2, Send } from "@/lib/icons";

const ContactSentToast = dynamic(
	() => import("@/components/common/contact-sent-toast").then((module) => module.ContactSentToast),
	{ ssr: false }
);

// Guided profile: one focused task, with persistent feedback and recoverable drafts.
export default function ContactClient() {
	const { formData, isSubmitting, status, fieldError, handleChange, handleSubmit } =
		useContactForm();

	return (
		// Narrow, not wide. A single form has no business spanning a five-column
		// shell; the measure is the point on a page with one task.
		<SiteShell>
			{status.kind === "sent" ? <ContactSentToast /> : null}
			<div className="flex flex-col gap-10">
				<PageHeader
					lede="Product engineering, software for service businesses, and design systems that have to ship. Tell me what you're working on and I usually reply within a day or two."
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
								className="h-11 sm:h-11"
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
								<p id="name-error" className="text-destructive text-sm">
									{fieldError.reason}
								</p>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								className="h-11 sm:h-11"
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
								<p id="email-error" className="text-destructive text-sm">
									{fieldError.reason}
								</p>
							)}
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="topic">What is this about?</Label>
						{/* Matches Input's height, radius, and focus treatment exactly. A
						    native select styled as a peer rather than as its own control. */}
						<select
							className="h-11 w-full rounded-lg border border-muted-foreground bg-field px-3 text-base shadow-(--shadow-field) outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40"
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
						</select>
						{fieldError?.field === "topic" && (
							<p id="topic-error" className="text-destructive text-sm">
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
							<p id="message-error" className="text-destructive text-sm">
								{fieldError.reason}
							</p>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-4">
						<Button className="h-11 gap-2" disabled={isSubmitting} type="submit">
							{isSubmitting ? (
								<Loader2 aria-hidden="true" className="size-4 animate-spin" />
							) : (
								<Send aria-hidden="true" className="size-4" />
							)}
							Send message
						</Button>

						{/* Persistent outcome, announced. The toast is the echo, not the record. */}
						<p
							aria-live="polite"
							className={
								status.kind === "failed" ? "text-destructive text-sm" : "text-sm text-success"
							}
							role="status"
						>
							{status.kind === "sent" && "Sent. I'll be in touch."}
							{isSubmitting && "Sending your message…"}
							{status.kind === "failed" &&
								(fieldError ? "Check the highlighted field." : status.reason)}
						</p>
					</div>
				</form>

				{/* The fallback, not a second column. */}
				<p className="text-muted-foreground text-sm">
					Prefer email?{" "}
					<ObfuscatedEmail
						className="text-foreground hover:text-brand [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_button]:min-h-11"
						showIcon={false}
						variant="link"
					/>
					{" · "}
					Jasper, GA
				</p>
			</div>
		</SiteShell>
	);
}
