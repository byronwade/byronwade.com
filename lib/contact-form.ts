export const CONTACT_TOPICS = [
	{ value: "product", label: "Product / engineering help" },
	{ value: "service-software", label: "Software for a service business" },
	{ value: "design-system", label: "Design system / UI" },
	{ value: "conversation", label: "Just a conversation" },
] as const;

export type ContactTopicValue = (typeof CONTACT_TOPICS)[number]["value"];

export const DEFAULT_CONTACT_TOPIC: ContactTopicValue = "conversation";

function getContactTopicLabel(value: string): string {
	return CONTACT_TOPICS.find((topic) => topic.value === value)?.label ?? "Conversation";
}

export function buildContactMessage(
	topicValue: string,
	message: string
): {
	message: string;
	projectType: string[];
	topicLabel: string;
} {
	const topicLabel = getContactTopicLabel(topicValue);
	return {
		topicLabel,
		projectType: [topicLabel],
		message: `[${topicLabel}]\n\n${message.trim()}`,
	};
}
