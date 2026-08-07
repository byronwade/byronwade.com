"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InlineContact } from "@/components/home/inline-contact";
import { Button } from "@/components/ui/button";
import { useRevealedEmail } from "@/hooks/use-revealed-email";

/**
 * The only interactive island on the homepage opening.
 *
 * Reduced to one action. This previously carried a primary button, a secondary
 * button, and five social pills — seven controls stacked under the claim, which
 * is a toolbar, not an opening. DESIGN.md §5.1 allows one earned primary action
 * per region, and §13 rejects making every control a pill; the social links now
 * live only in the footer, where a visitor looks for them anyway, and the email
 * copy affordance lives inside the contact sheet that already owns it.
 *
 * The secondary route to the work is a text link rather than a second button, so
 * the primary action stays the only weighted thing in the region.
 */
export function HomeActions() {
	const [contactOpen, setContactOpen] = useState(false);
	const email = useRevealedEmail();

	return (
		<>
			<InlineContact email={email} onClose={() => setContactOpen(false)} open={contactOpen} />

			{!contactOpen && (
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
					<Button className="gap-2" onClick={() => setContactOpen(true)} size="lg" type="button">
						Start a conversation
						<ArrowRight aria-hidden="true" className="size-4" />
					</Button>
					<Link className="link-underline text-sm" href="/projects">
						See selected work
					</Link>
				</div>
			)}
		</>
	);
}
