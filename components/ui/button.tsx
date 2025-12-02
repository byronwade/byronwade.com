import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-button text-base sm:text-sm font-medium transition-all duration-normal ease-out focus-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98]",
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:scale-[0.98]",
				outline:
					"border border-input bg-background text-foreground shadow-sm hover:bg-accent/10 hover:text-accent hover:border-accent/50 active:scale-[0.98]",
				secondary:
					"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md active:scale-[0.98]",
				ghost: "text-foreground hover:bg-accent/10 hover:text-accent active:scale-[0.98]",
				link: "text-primary underline-offset-4 hover:underline active:opacity-80",
				success:
					"bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:shadow-md active:scale-[0.98]",
				warning:
					"bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 hover:shadow-md active:scale-[0.98]",
				info: "bg-info text-info-foreground shadow-sm hover:bg-info/90 hover:shadow-md active:scale-[0.98]",
			},
			size: {
				default: "min-h-[44px] sm:h-9 px-4 sm:px-4 py-3 sm:py-2",
				sm: "min-h-[40px] sm:h-8 rounded-md px-3 text-sm sm:text-xs",
				lg: "min-h-[48px] sm:h-10 rounded-md px-8 py-3 sm:py-2",
				icon: "min-h-[44px] min-w-[44px] sm:h-9 sm:w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
