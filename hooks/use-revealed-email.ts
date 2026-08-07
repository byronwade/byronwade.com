"use client";

import { useEffect, useState } from "react";
import { CONTACT_ENCODED, decodeContact } from "@/lib/contact";

/**
 * Client-only accessor for the real contact address.
 *
 * Returns "" until the component has mounted, so the decoded value never
 * reaches prerendered HTML — a crawler that does not execute JavaScript sees
 * nothing. Use this anywhere the address is rendered as text; see
 * docs/SPAM_PROTECTION.md.
 */
export function useRevealedEmail(): string {
	const [email, setEmail] = useState("");

	useEffect(() => {
		setEmail(decodeContact(CONTACT_ENCODED.email));
	}, []);

	return email;
}
