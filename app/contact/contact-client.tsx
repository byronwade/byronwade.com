"use client";

import { Github, Linkedin, Loader2, Mail, MapPin, Send, Twitter } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
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

const socials = [
	{ name: "GitHub", href: "https://github.com/byronwade", icon: Github },
	{ name: "LinkedIn", href: "https://linkedin.com/in/byronwade", icon: Linkedin },
	{ name: "Twitter", href: "https://twitter.com/byron_c_wade", icon: Twitter },
];

export default function ContactClient() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		topic: DEFAULT_CONTACT_TOPIC,
		message: "",
	});

	const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (isSubmitting) {
			return;
		}
		setIsSubmitting(true);

		try {
			const payload = buildContactMessage(formData.topic, formData.message);
			const result = await sendEmail({
				name: formData.name.trim(),
				email: formData.email.trim(),
				message: payload.message,
				projectType: payload.projectType,
			});
			if (result.success) {
				toast.success("Message sent!", {
					description: "Thanks for reaching out — I'll get back to you soon.",
				});
				setFormData({
					name: "",
					email: "",
					topic: DEFAULT_CONTACT_TOPIC,
					message: "",
				});
			} else {
				toast.error("Couldn't send message", {
					description: result.error || "Please try again, or email me directly.",
				});
			}
		} catch (error) {
			console.error("Contact form submit failed", error);
			toast.error("Something went wrong", {
				description: "Please try again, or email me directly.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<SiteShell width="wide">
			<div className="flex flex-col gap-10 sm:gap-12">
				<header className="reveal flex w-full flex-col gap-3">
					<h1 className="font-heading font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
						Get in touch
					</h1>
					<p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
						Available for product engineering, software for service businesses, and design systems
						that have to ship. Have a project in mind, a question, or just want to say hello? Send a
						note below — I usually reply within a day or two.
					</p>
				</header>

				<div className="reveal reveal-delay-1 grid gap-10 md:grid-cols-[minmax(0,1fr)_18rem]">
					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						<div className="grid gap-5 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) => handleChange("name", e.target.value)}
									placeholder="Your name"
									required
									autoComplete="name"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) => handleChange("email", e.target.value)}
									placeholder="you@example.com"
									required
									autoComplete="email"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="topic">What is this about?</Label>
							<select
								id="topic"
								name="topic"
								value={formData.topic}
								onChange={(e) => handleChange("topic", e.target.value as ContactTopicValue)}
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
							<Label htmlFor="message">Message</Label>
							<Textarea
								id="message"
								name="message"
								value={formData.message}
								onChange={(e) => handleChange("message", e.target.value)}
								placeholder="Tell me a little about what you're working on…"
								required
								rows={7}
								className="resize-y"
								onKeyDown={(e) => {
									if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
										e.currentTarget.form?.requestSubmit();
									}
								}}
							/>
						</div>
						<div>
							<Button type="submit" disabled={isSubmitting} className="gap-2">
								{isSubmitting ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Sending…
									</>
								) : (
									<>
										<Send className="size-4" />
										Send message
									</>
								)}
							</Button>
						</div>
					</form>

					<aside className="flex h-fit flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-card">
						<div className="flex flex-col gap-1.5">
							<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
								Email
							</span>
							<ObfuscatedEmail
								className="text-foreground text-sm hover:text-brand"
								showIcon={false}
								variant="link"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
								Location
							</span>
							<span className="inline-flex items-center gap-2 text-foreground text-sm">
								<MapPin className="size-4 text-brand" />
								Jasper, GA
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
								Elsewhere
							</span>
							<div className="flex gap-1.5">
								{socials.map((social) => (
									<a
										key={social.name}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={social.name}
										className="focus-ring inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-foreground"
									>
										<social.icon className="size-[1.05rem]" />
									</a>
								))}
							</div>
						</div>
						<div className="flex items-center gap-2 border-border border-t pt-4 text-muted-foreground text-xs">
							<Mail className="size-3.5" />
							Usually replies within a day or two.
						</div>
					</aside>
				</div>
			</div>
		</SiteShell>
	);
}
