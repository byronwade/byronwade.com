"use client";

import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import {
	tableCellVariants,
	tableContainerVariants,
	tableHeaderVariants,
	tableHeadVariants,
} from "@/components/ui/table-variants";
import { cn } from "@/lib/utils";

type TableDensity = NonNullable<VariantProps<typeof tableHeadVariants>["density"]>;
type TableLayout = NonNullable<VariantProps<typeof tableContainerVariants>["layout"]>;

type TableContextValue = {
	density: TableDensity;
	layout: TableLayout;
};

const TableContext = React.createContext<TableContextValue>({
	density: "comfortable",
	layout: "default",
});

function useTableContext() {
	return React.useContext(TableContext);
}

type TableProps = React.ComponentProps<"table"> & {
	density?: TableDensity;
	layout?: TableLayout;
};

function Table({ className, density = "comfortable", layout = "default", ...props }: TableProps) {
	return (
		<TableContext.Provider value={{ density, layout }}>
			<div
				data-slot="table-container"
				data-density={density}
				data-layout={layout}
				className={cn(tableContainerVariants({ layout }))}
			>
				<table
					data-slot="table"
					className={cn("w-full caption-bottom text-sm", className)}
					{...props}
				/>
			</div>
		</TableContext.Provider>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	const { layout } = useTableContext();
	return (
		<thead
			data-slot="table-header"
			className={cn(tableHeaderVariants({ layout }), className)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return (
		<tbody
			data-slot="table-body"
			className={cn("[&_tr:last-child]:border-0", className)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				"border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
				className
			)}
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	const { density } = useTableContext();
	return (
		<th
			data-slot="table-head"
			className={cn(tableHeadVariants({ density }), className)}
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
	const { density } = useTableContext();
	return (
		<td
			data-slot="table-cell"
			className={cn(tableCellVariants({ density }), className)}
			{...props}
		/>
	);
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
	return (
		<caption
			data-slot="table-caption"
			className={cn("mt-4 text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export type { TableDensity, TableLayout, TableProps };
export {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
	tableCellVariants,
	tableContainerVariants,
	tableHeaderVariants,
	tableHeadVariants,
};
