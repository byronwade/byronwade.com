"use client";

import { Check, Copy, Loader2, Mail, Send, X } from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pillLinkClass } from "@/components/ui/pill";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/lib/actions/send-email";
import {
	buildContactMessage,
	CONTACT_TOPICS,
	type ContactTopicValue,
	DEFAULT_CONTACT_TOPIC,
} from "@/lib/contact-form";

interface InlineContactProps {
	email?: string;
	onClose: () => void;
	open: boolean;
}

export function InlineContact({
	open,
	onClose,
	email = "byron@byronwade.com",
}: InlineContactProps) {
	const [copied, setCopied] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		topic: DEFAULT_CONTACT_TOPIC,
		message: "",
	});
	const formId = useId();
	const nameFieldId = `${formId}-name`;

	if (!open) {
		return null;
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

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (isSubmitting) {
			return;
		}
		setIsSubmitting(true);

		const payload = buildContactMessage(formData.topic, formData.message);

		try {
			const result = await sendEmail({
				name: formData.name.trim(),
				email: formData.email.trim(),
				message: payload.message,
				projectType: payload.projectType,
			});
			if (result.success) {
				toast.success("Message sent!", {
					description: "Thanks for reaching out — I’ll get back to you soon.",
				});
				setFormData({
					name: "",
					email: "",
					topic: DEFAULT_CONTACT_TOPIC,
					message: "",
				});
				onClose();
			} else {
				toast.error("Couldn't send message", {
					description: result.error || "Please try again, or email me directly.",
				});
			}
		} catch (error) {
			console.error("Inline contact submit failed", error);
			toast.error("Something went wrong", {
				description: "Please try again, or email me directly.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section
			className="reveal w-full overflow-hidden rounded-2xl border border-border bg-card shadow-card"
			aria-label="Contact"
		>
			<div className="flex items-center justify-between border-border border-b px-4 py-3">
				<div className="flex flex-col">
					<span className="font-medium text-sm">Start a conversation</span>
					<span className="text-muted-foreground text-xs">
						Product builds, service software, or an intro — brief is fine.
					</span>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					aria-label="Close"
				>
					<X className="h-4 w-4" />
				</button>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor={`${formId}-name`}>Name</Label>
						<Input
							id={nameFieldId}
							name="name"
							autoComplete="name"
							autoFocus
							value={formData.name}
							onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
							placeholder="Your name…"
							required
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor={`${formId}-email`}>Email</Label>
						<Input
							id={`${formId}-email`}
							name="email"
							type="email"
							inputMode="email"
							autoComplete="email"
							spellCheck={false}
							value={formData.email}
							onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
							placeholder="you@company.com…"
							required
						/>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor={`${formId}-topic`}>What is this about?</Label>
					<select
						id={`${formId}-topic`}
						name="topic"
						value={formData.topic}
						onChange={(event) =>
							setFormData((prev) => ({
								...prev,
								topic: event.target.value as ContactTopicValue,
							}))
						}
						className="h-9 rounded-full border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						{CONTACT_TOPICS.map((topic) => (
							<option key={topic.value} value={topic.value}>
								{topic.label}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor={`${formId}-message`}>Brief</Label>
					<Textarea
						id={`${formId}-message`}
						name="message"
						value={formData.message}
						onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
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
				</div>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-wrap items-center gap-2">
						<a
							href={`mailto:${email}`}
							className="inline-flex items-center gap-2 font-medium text-brand text-sm hover:underline"
						>
							<Mail className="h-4 w-4" />
							{email}
						</a>
						<button type="button" onClick={copyEmail} className={pillLinkClass}>
							{copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
							{copied ? "Copied" : "Copy"}
						</button>
					</div>
					<Button type="submit" disabled={isSubmitting} className="gap-2">
						{isSubmitting ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Sending…
							</>
						) : (
							<>
								<Send className="h-4 w-4" />
								Send message
							</>
						)}
					</Button>
				</div>
			</form>
		</section>
	);
}
