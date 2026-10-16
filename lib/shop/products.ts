interface ShopProduct {
	currency: "usd";
	description: string;
	format: string;
	id: string;
	name: string;
	placeholderLabel: "Placeholder - pending Byron's choice";
	unitAmount: number;
}

export const shopPriceFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

// Placeholder - pending Byron's choice. These are preview concepts, not deliverable products.
export const shopProducts = [
	{
		id: "field-notes",
		name: "Builder's field notes",
		description:
			"A possible collection of notes on taking a software idea from first sketch to release.",
		format: "Digital reading",
		unitAmount: 1200,
		currency: "usd",
		placeholderLabel: "Placeholder - pending Byron's choice",
	},
	// Placeholder - pending Byron's choice. No files are sold or delivered.
	{
		id: "project-workbook",
		name: "Project planning workbook",
		description:
			"A possible workbook for shaping a brief, making tradeoffs, and defining a useful first version.",
		format: "Digital workbook",
		unitAmount: 2400,
		currency: "usd",
		placeholderLabel: "Placeholder - pending Byron's choice",
	},
	// Placeholder - pending Byron's choice. Pricing is illustrative and test-only.
	{
		id: "interface-studies",
		name: "Interface studies",
		description:
			"A possible set of annotated interface explorations, with the decisions behind each design.",
		format: "Digital collection",
		unitAmount: 3600,
		currency: "usd",
		placeholderLabel: "Placeholder - pending Byron's choice",
	},
] as const satisfies readonly ShopProduct[];
