export const CONTACT_TOPICS = [
	{ value: "product", label: "Product / engineering help" },
	{ value: "service-software", label: "Software for a service business" },
	{ value: "design-system", label: "Design system / UI" },
	{ value: "conversation", label: "Just a conversation" },
] as const;

type ContactTopicValue = (typeof CONTACT_TOPICS)[number]["value"];
export type ContactField = "name" | "email" | "message" | "topic";

export const DEFAULT_CONTACT_TOPIC: ContactTopicValue = "conversation";

const CONTACT_LIMITS = { name: 120, email: 254, message: 10_000 } as const;

// Match the browser's email input syntax, including plus-addressing and subdomains.
const EMAIL_PATTERN =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
const SINGLE_LINE_BREAK_PATTERN = /[\p{Cc}\p{Zl}\p{Zp}]/u;

function trimContactText(value: unknown): string {
	return typeof value === "string" ? value.trim() : "";
}

export function validateContactSubmission(input: unknown) {
	if (!input || typeof input !== "object" || Array.isArray(input)) {
		return { success: false, error: "Please fill in the contact form." } as const;
	}
	const name = trimContactText("name" in input ? input.name : undefined);
	const email = trimContactText("email" in input ? input.email : undefined);
	const message = trimContactText("message" in input ? input.message : undefined);
	const topic = CONTACT_TOPICS.find((item) => "topic" in input && item.value === input.topic);

	if (!name || name.length > CONTACT_LIMITS.name || SINGLE_LINE_BREAK_PATTERN.test(name)) {
		return {
			success: false,
			field: "name",
			error: `Enter a name of 1–${CONTACT_LIMITS.name} characters on one line.`,
		} as const;
	}
	if (email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(email)) {
		return {
			success: false,
			field: "email",
			error: `Enter a valid email address of up to ${CONTACT_LIMITS.email} characters.`,
		} as const;
	}
	if (!topic) {
		return { success: false, field: "topic", error: "Choose one of the contact topics." } as const;
	}
	if (!message || message.length > CONTACT_LIMITS.message) {
		return {
			success: false,
			field: "message",
			error: `Enter a message of 1–${CONTACT_LIMITS.message.toLocaleString("en-US")} characters.`,
		} as const;
	}
	// Pick supported fields explicitly. Legacy attachment and recipient fields never reach delivery.
	return { success: true, data: { name, email, message, topicLabel: topic.label } } as const;
}
