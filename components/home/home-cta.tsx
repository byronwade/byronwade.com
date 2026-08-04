"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InlineContact } from "@/components/home/inline-contact";
import { Button } from "@/components/ui/button";

export function HomeCta() {
	const [contactOpen, setContactOpen] = useState(false);

	return (
		<section className="reveal reveal-delay-8 flex w-full flex-col gap-5 border-t border-border pt-10 sm:pt-12">
			<div className="flex flex-col gap-2">
				<h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
					Let’s talk
				</h2>
				<p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
					Available for product engineering conversations, service-business software, and design
					systems that have to ship. Or just say hello.
				</p>
			</div>

			<InlineContact open={contactOpen} onClose={() => setContactOpen(false)} />

			{!contactOpen && (
				<div className="flex flex-wrap items-center gap-2">
					<Button type="button" onClick={() => setContactOpen(true)} className="gap-2">
						Open contact
						<ArrowRight className="size-4" aria-hidden="true" />
					</Button>
					<Button variant="outline" render={<Link href="/resume">View resume</Link>} />
					<Button variant="ghost" render={<Link href="/contact">Full contact page</Link>} />
				</div>
			)}
		</section>
	);
}
