"use client";

import { Github, Linkedin, Loader2, Mail, MapPin, Send, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sendEmail } from "@/app/actions/send-email";
import { BreadcrumbNav } from "@/components/common";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { Textarea } from "@/components/ui/textarea";

const socials = [
	{ name: "GitHub", href: "https://github.com/byronwade", icon: Github },
	{ name: "LinkedIn", href: "https://linkedin.com/in/byronwade", icon: Linkedin },
	{ name: "Twitter", href: "https://twitter.com/byron_c_wade", icon: Twitter },
];

export default function ContactClient() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({ name: "", email: "", message: "" });

	const handleChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			const result = await sendEmail(formData);
			if (result.success) {
				toast.success("Message sent!", {
					description: "Thanks for reaching out — I'll get back to you soon.",
				});
				setFormData({ name: "", email: "", message: "" });
			} else {
				toast.error("Couldn't send message", {
					description: result.error || "Please try again, or email me directly.",
				});
			}
		} catch {
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
				<div className="animate-in w-full">
					<BreadcrumbNav
						items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
						className="mb-4"
					/>
					<h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
						Get in touch
					</h1>
					<p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
						Have a project in mind, a question, or just want to say hello? Send a note below and
						I'll reply as soon as I can.
					</p>
				</div>

				<div className="grid animate-in animate-delay-1 gap-10 md:grid-cols-[minmax(0,1fr)_18rem]">
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
							<Label htmlFor="message">Message</Label>
							<Textarea
								id="message"
								value={formData.message}
								onChange={(e) => handleChange("message", e.target.value)}
								placeholder="Tell me a little about what you're working on…"
								required
								rows={7}
								className="resize-y"
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

					<aside className="flex flex-col gap-6 rounded-xl border border-border/60 bg-card/50 p-6">
						<div className="flex flex-col gap-1.5">
							<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Email
							</span>
							<ObfuscatedEmail
								className="text-sm text-foreground hover:text-accent"
								showIcon={false}
								variant="link"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Location
							</span>
							<span className="inline-flex items-center gap-2 text-sm text-foreground">
								<MapPin className="size-4 text-accent" />
								Jasper, GA
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Elsewhere
							</span>
							<div className="flex gap-2">
								{socials.map((social) => (
									<a
										key={social.name}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={social.name}
										className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring"
									>
										<social.icon className="size-[1.1rem]" />
									</a>
								))}
							</div>
						</div>
						<div className="flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
							<Mail className="size-3.5" />
							Usually replies within a day or two.
						</div>
					</aside>
				</div>
			</div>
		</SiteShell>
	);
}
