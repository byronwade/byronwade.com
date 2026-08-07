"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/lib/actions/send-email";
import {
	buildContactMessage,
	CONTACT_TOPICS,
	type ContactTopicValue,
	DEFAULT_CONTACT_TOPIC,
} from "@/lib/contact-form";
import { Loader2, Send } from "@/lib/icons";

/**
 * `/contact`: Guided profile.
 *
 * §7.1 gives this route exactly one organizing move: one task, nothing else on
 * the page competing. It was not honouring that. A bordered card sat beside the
 * form holding an email address, a location, and three icon-only social circles
 * It was a second destination on a page whose whole job is the first one. That card
 * is gone. The address survives as a fallback line beneath the form, where it
 * reads as "or do this instead" rather than as a competing column.
 *
 * Also removed: three all-caps eyebrows (§13), icon-only social circles with no
 * visible label (§5.6), and a pill-shaped `select` that matched no other input
 * on the site (§5.4 makes a pill a semantic shape, not a default).
 *
 * §3.3 requires explicit submitting, failed, and succeeded states. Toasts alone
 * did not satisfy that: they vanish, and a visitor who looks away misses the
 * only confirmation the page ever gave. There is now a persistent status line
 * in a live region, and the toast is the transient echo of it. What the visitor
 * typed is preserved on failure and cleared only on success.
 */

type Status = { kind: "idle" } | { kind: "sent" } | { kind: "failed"; reason: string };

const EMPTY_FORM = {
	name: "",
	email: "",
	topic: DEFAULT_CONTACT_TOPIC,
	message: "",
};

export default function ContactClient() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [status, setStatus] = useState<Status>({ kind: "idle" });
	const [formData, setFormData] = useState(EMPTY_FORM);

	const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (isSubmitting) {
			return;
		}
		setIsSubmitting(true);
		setStatus({ kind: "idle" });

		try {
			const payload = buildContactMessage(formData.topic, formData.message);
			const result = await sendEmail({
				name: formData.name.trim(),
				email: formData.email.trim(),
				message: payload.message,
				projectType: payload.projectType,
			});
			if (result.success) {
				setStatus({ kind: "sent" });
				// Cleared only here. §3.3: never discard what the visitor typed unless
				// it has actually been delivered.
				setFormData(EMPTY_FORM);
				toast.success("Message sent", {
					description: "Thanks for reaching out. I'll get back to you soon.",
				});
			} else {
				const reason = result.error || "Please try again, or email me directly.";
				setStatus({ kind: "failed", reason });
				toast.error("Couldn't send message", { description: reason });
			}
		} catch (error) {
			console.error("Contact form submit failed", error);
			const reason =
				"Something went wrong on the way out. Your message is still here, so try again.";
			setStatus({ kind: "failed", reason });
			toast.error("Something went wrong", { description: reason });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		// Narrow, not wide. A single form has no business spanning a five-column
		// shell; the measure is the point on a page with one task.
		<SiteShell>
			<div className="flex flex-col gap-10">
				<PageHeader
					lede="Product engineering, software for service businesses, and design systems that have to ship. Tell me what you're working on and I usually reply within a day or two."
					title="Get in touch"
				/>

				<form className="reveal reveal-delay-1 flex flex-col gap-5" onSubmit={handleSubmit}>
					<div className="grid gap-5 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								autoComplete="name"
								id="name"
								onChange={(e) => handleChange("name", e.target.value)}
								placeholder="Your name"
								required
								value={formData.name}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								autoComplete="email"
								id="email"
								onChange={(e) => handleChange("email", e.target.value)}
								placeholder="you@example.com"
								required
								type="email"
								value={formData.email}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="topic">What is this about?</Label>
						{/* Matches Input's height, radius, and focus treatment exactly. A
						    native select styled as a peer rather than as its own control. */}
						<select
							className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
							id="topic"
							name="topic"
							onChange={(e) => handleChange("topic", e.target.value as ContactTopicValue)}
							value={formData.topic}
						>
							{CONTACT_TOPICS.map((topic) => (
								<option key={topic.value} value={topic.value}>
									{topic.label}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="message">Message</Label>
						{/* `field-sizing-content` on the primitive overrides `rows`, so the
						    empty field collapsed to 64px, which was the smallest thing on a page whose
						    entire job is writing a message. The floor is set here. */}
						<Textarea
							className="min-h-40 resize-y"
							id="message"
							name="message"
							onChange={(e) => handleChange("message", e.target.value)}
							onKeyDown={(e) => {
								if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
									e.currentTarget.form?.requestSubmit();
								}
							}}
							placeholder="Tell me a little about what you're working on…"
							required
							rows={8}
							value={formData.message}
						/>
					</div>

					<div className="flex flex-wrap items-center gap-4">
						<Button className="gap-2" disabled={isSubmitting} type="submit">
							{isSubmitting ? (
								<>
									<Loader2 aria-hidden="true" className="size-4 animate-spin" />
									Sending…
								</>
							) : (
								<>
									<Send aria-hidden="true" className="size-4" />
									Send message
								</>
							)}
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
							{status.kind === "failed" && status.reason}
						</p>
					</div>
				</form>

				{/* The fallback, not a second column. */}
				<p className="reveal reveal-delay-2 border-border border-t pt-6 text-muted-foreground text-sm">
					Prefer email?{" "}
					<ObfuscatedEmail
						className="text-foreground hover:text-brand"
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
