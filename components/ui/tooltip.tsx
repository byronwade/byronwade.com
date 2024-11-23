"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = TooltipPrimitive.Content;

const TooltipWrapper = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>((props, ref) => <TooltipContent ref={ref} {...props} />);

TooltipWrapper.displayName = "TooltipWrapper";

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipWrapper as TooltipContent };
