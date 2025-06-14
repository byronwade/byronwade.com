"use client";

import { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";

// Base64 encoded contact info (additional layer of obfuscation)
const ENCODED_EMAIL = "YmN3MTk5NUBnbWFpbC5jb20="; // bcw1995@gmail.com
const ENCODED_PHONE = "KzE4MzE0MzA2MDEx"; // +18314306011
const ENCODED_PHONE_DISPLAY = "KzEgKDgzMSkgNDMwLTYwMTE="; // +1 (831) 430-6011

// Decode function
const decode = (encoded: string): string => {
	try {
		return atob(encoded);
	} catch {
		return "";
	}
};

// Additional obfuscation: split and reverse parts
const obfuscateEmail = (email: string): { user: string; domain: string } => {
	const [user, domain] = email.split("@");
	return {
		user: user.split("").reverse().join(""),
		domain: domain.split("").reverse().join(""),
	};
};

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

export const ObfuscatedEmail = ({ className = "", showIcon = false, variant = "link" }: ObfuscatedEmailProps) => {
	const [revealed, setRevealed] = useState(false);
	const [email, setEmail] = useState("");

	useEffect(() => {
		if (revealed) {
			const decoded = decode(ENCODED_EMAIL);
			setEmail(decoded);
		}
	}, [revealed]);

	const handleReveal = () => {
		setRevealed(true);
	};

	if (variant === "text") {
		return (
			<ClientOnlyContact>
				<span className={className}>
					{showIcon && <Mail className="inline w-4 h-4 mr-2" />}
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
				{showIcon && <Mail className="inline w-4 h-4 mr-2" />}
				{revealed ? (
					<a
						href={`mailto:${email}`}
						className="hover:text-primary transition-colors"
						// Additional protection: use JavaScript to build the href
						onClick={(e) => {
							e.preventDefault();
							window.location.href = `mailto:${email}`;
						}}
					>
						{email}
					</a>
				) : (
					<button onClick={handleReveal} className="text-primary hover:text-primary/80 transition-colors underline hover:no-underline" type="button">
						Click to reveal email
					</button>
				)}
			</span>
		</ClientOnlyContact>
	);
};

interface ObfuscatedPhoneProps {
	className?: string;
	showIcon?: boolean;
	variant?: "link" | "text";
	displayFormat?: boolean;
}

export const ObfuscatedPhone = ({ className = "", showIcon = false, variant = "link", displayFormat = true }: ObfuscatedPhoneProps) => {
	const [revealed, setRevealed] = useState(false);
	const [phone, setPhone] = useState("");
	const [displayPhone, setDisplayPhone] = useState("");

	useEffect(() => {
		if (revealed) {
			const decodedPhone = decode(ENCODED_PHONE);
			const decodedDisplay = decode(ENCODED_PHONE_DISPLAY);
			setPhone(decodedPhone);
			setDisplayPhone(displayFormat ? decodedDisplay : decodedPhone);
		}
	}, [revealed, displayFormat]);

	const handleReveal = () => {
		setRevealed(true);
	};

	if (variant === "text") {
		return (
			<ClientOnlyContact>
				<span className={className}>
					{showIcon && <Phone className="inline w-4 h-4 mr-2" />}
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
				{showIcon && <Phone className="inline w-4 h-4 mr-2" />}
				{revealed ? (
					<a
						href={`tel:${phone}`}
						className="hover:text-primary transition-colors"
						onClick={(e) => {
							e.preventDefault();
							window.location.href = `tel:${phone}`;
						}}
					>
						{displayPhone}
					</a>
				) : (
					<button onClick={handleReveal} className="text-primary hover:text-primary/80 transition-colors underline hover:no-underline" type="button">
						Click to reveal phone
					</button>
				)}
			</span>
		</ClientOnlyContact>
	);
};

// Component for structured data - returns obfuscated values for bots
export const getObfuscatedContactForSchema = () => {
	// Return partially obfuscated data for structured data
	return {
		email: "contact" + String.fromCharCode(64) + "byronwade" + ".com", // Use a business email format
		telephone: "+1-8xx-xxx-xxxx", // Partially obfuscated
	};
};

// Hook to get real contact info only on client-side interaction
export const useContactInfo = () => {
	const [contactInfo, setContactInfo] = useState<{
		email: string;
		phone: string;
		phoneDisplay: string;
	} | null>(null);

	const revealContactInfo = () => {
		if (!contactInfo) {
			setContactInfo({
				email: decode(ENCODED_EMAIL),
				phone: decode(ENCODED_PHONE),
				phoneDisplay: decode(ENCODED_PHONE_DISPLAY),
			});
		}
		return contactInfo;
	};

	return { contactInfo, revealContactInfo };
};
