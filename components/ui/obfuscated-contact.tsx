"use client";

import { Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { CONTACT_ENCODED, decodeContact } from "@/lib/contact";

// Component that only renders after client-side hydration
const ClientOnlyContact = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Add small delay to make it harder for bots
		const timer = setTimeout(() => setMounted(true), 100);
		return () => clearTimeout(timer);
	}, []);

	if (!mounted) {
		return null;
	}

	return <>{children}</>;
};

interface ObfuscatedEmailProps {
	className?: string;
	showIcon?: boolean;
	variant?: "link" | "text";
}

export const ObfuscatedEmail = ({
	className = "",
	showIcon = false,
	variant = "link",
}: ObfuscatedEmailProps) => {
	// The decoded value is derived from `revealed`, so it does not need its own
	// state or an effect to keep the two in sync. Rendering happens inside
	// ClientOnlyContact, so `atob` always has a browser to run in.
	const [revealed, setRevealed] = useState(false);
	const email = revealed ? decodeContact(CONTACT_ENCODED.email) : "";

	const handleReveal = () => {
		setRevealed(true);
	};

	if (variant === "text") {
		return (
			<ClientOnlyContact>
				<span className={className}>
					{showIcon && <Mail className="mr-2 inline h-4 w-4" />}
					{revealed ? (
						email
					) : (
						<button onClick={handleReveal} className="underline hover:no-underline" type="button">
							Click to reveal email
						</button>
					)}
				</span>
			</ClientOnlyContact>
		);
	}

	return (
		<ClientOnlyContact>
			<span className={className}>
				{showIcon && <Mail className="mr-2 inline h-4 w-4" />}
				{revealed ? (
					<a
						href={`mailto:${email}`}
						className="transition-colors hover:text-primary"
						// Additional protection: use JavaScript to build the href
						onClick={(e) => {
							e.preventDefault();
							window.location.href = `mailto:${email}`;
						}}
					>
						{email}
					</a>
				) : (
					<button
						onClick={handleReveal}
						className="text-primary underline transition-colors hover:text-primary/80 hover:no-underline"
						type="button"
					>
						Click to reveal email
					</button>
				)}
			</span>
		</ClientOnlyContact>
	);
};

interface ObfuscatedPhoneProps {
	className?: string;
	displayFormat?: boolean;
	showIcon?: boolean;
	variant?: "link" | "text";
}

/** @public Documented in docs/SPAM_PROTECTION.md. */
export const ObfuscatedPhone = ({
	className = "",
	showIcon = false,
	variant = "link",
	displayFormat = true,
}: ObfuscatedPhoneProps) => {
	const [revealed, setRevealed] = useState(false);
	const phone = revealed ? decodeContact(CONTACT_ENCODED.phone) : "";
	const displayPhone = revealed
		? displayFormat
			? decodeContact(CONTACT_ENCODED.phoneDisplay)
			: phone
		: "";

	const handleReveal = () => {
		setRevealed(true);
	};

	if (variant === "text") {
		return (
			<ClientOnlyContact>
				<span className={className}>
					{showIcon && <Phone className="mr-2 inline h-4 w-4" />}
					{revealed ? (
						displayPhone
					) : (
						<button onClick={handleReveal} className="underline hover:no-underline" type="button">
							Click to reveal phone
						</button>
					)}
				</span>
			</ClientOnlyContact>
		);
	}

	return (
		<ClientOnlyContact>
			<span className={className}>
				{showIcon && <Phone className="mr-2 inline h-4 w-4" />}
				{revealed ? (
					<a
						href={`tel:${phone}`}
						className="transition-colors hover:text-primary"
						onClick={(e) => {
							e.preventDefault();
							window.location.href = `tel:${phone}`;
						}}
					>
						{displayPhone}
					</a>
				) : (
					<button
						onClick={handleReveal}
						className="text-primary underline transition-colors hover:text-primary/80 hover:no-underline"
						type="button"
					>
						Click to reveal phone
					</button>
				)}
			</span>
		</ClientOnlyContact>
	);
};
