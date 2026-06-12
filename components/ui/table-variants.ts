import { cva } from "class-variance-authority";

const tableContainerVariants = cva("relative w-full overflow-x-auto", {
	variants: {
		layout: {
			default: "",
			"sticky-header": "",
			card: "rounded-lg edge bg-card text-card-foreground",
		},
	},
	defaultVariants: {
		layout: "default",
	},
});

const tableHeaderVariants = cva("[&_tr]:border-b", {
	variants: {
		layout: {
			default: "",
			"sticky-header": "sticky top-0 z-10 bg-background",
			card: "sticky top-0 z-10 bg-card",
		},
	},
	defaultVariants: {
		layout: "default",
	},
});

const tableHeadVariants = cva(
	"text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
	{
		variants: {
			density: {
				comfortable: "h-10 px-2",
				condensed: "h-8 px-2 text-xs",
				spacious: "h-12 px-3",
			},
		},
		defaultVariants: {
			density: "comfortable",
		},
	}
);

const tableCellVariants = cva("align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", {
	variants: {
		density: {
			comfortable: "p-2",
			condensed: "px-2 py-1.5 text-xs",
			spacious: "px-3 py-4",
		},
	},
	defaultVariants: {
		density: "comfortable",
	},
});

export { tableCellVariants, tableContainerVariants, tableHeaderVariants, tableHeadVariants };
