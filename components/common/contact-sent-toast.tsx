"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

/**
 * Loads after a successful send. The toaster subscribes in its own effect, and
 * this effect runs after that child effect, so the success toast is not lost.
 */
export function ContactSentToast() {
	useEffect(() => {
		toast.success("Message sent", {
			description: "Thanks for reaching out. I'll get back to you soon.",
		});
	}, []);

	return <Toaster />;
}
