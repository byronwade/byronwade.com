"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRevealedEmail } from "@/hooks/use-revealed-email";
import { ArrowRight } from "@/lib/icons";

const InlineContact = dynamic(
	() => import("@/components/home/inline-contact").then((module) => module.InlineContact),
	{ loading: () => <p role="status">Opening contact form…</p> }
);

// Existing contact flow retained within the Thorbis Showcase opening.
export function HomeActions() {
	const [contactState, setContactState] = useState<"idle" | "open" | "closed">("idle");
	const contactOpen = contactState === "open";
	const email = useRevealedEmail();
	const triggerRef = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		if (contactState === "closed") {
			triggerRef.current?.focus();
		}
	}, [contactState]);

	return (
		<>
			{contactState !== "idle" && (
				<InlineContact email={email} onClose={() => setContactState("closed")} open={contactOpen} />
			)}

			{!contactOpen && (
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
					<Button
						ref={triggerRef}
						className="gap-2"
						onClick={() => setContactState("open")}
						size="lg"
						type="button"
						variant="brand"
					>
						Start a conversation
						<ArrowRight aria-hidden="true" className="size-4" />
					</Button>
					<Link
						prefetch={false}
						className="link-underline inline-flex min-h-11 items-center text-sm"
						href="/projects"
					>
						See selected work
					</Link>
					<noscript>
						<Link
							prefetch={false}
							className="link-underline inline-flex min-h-11 items-center text-sm"
							href="/contact"
						>
							Contact Byron
						</Link>
					</noscript>
				</div>
			)}
		</>
	);
}
