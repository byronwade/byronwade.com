"use client";

import Link from "next/link";
import { useState } from "react";
import { InlineContact } from "@/components/home/inline-contact";
import { Button } from "@/components/ui/button";
import { useRevealedEmail } from "@/hooks/use-revealed-email";
import { ArrowRight } from "@/lib/icons";

// Existing contact flow retained within the Thorbis Showcase opening.
export function HomeActions() {
	const [contactOpen, setContactOpen] = useState(false);
	const email = useRevealedEmail();

	return (
		<>
			<InlineContact email={email} onClose={() => setContactOpen(false)} open={contactOpen} />

			{!contactOpen && (
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
					<Button
						className="gap-2"
						onClick={() => setContactOpen(true)}
						size="lg"
						type="button"
						variant="brand"
					>
						Start a conversation
						<ArrowRight aria-hidden="true" className="size-4" />
					</Button>
					<Link className="link-underline text-sm" href="/projects">
						See selected work
					</Link>
					<noscript>
						<Link className="link-underline text-sm" href="/contact">
							Contact Byron
						</Link>
					</noscript>
				</div>
			)}
		</>
	);
}
