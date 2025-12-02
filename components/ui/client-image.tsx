"use client";

import Image from "next/image";
import type { ComponentProps } from "react";

interface ClientImageProps extends ComponentProps<typeof Image> {
	onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function ClientImage({ onError, ...props }: ClientImageProps) {
	return <Image {...props} onError={onError} />;
}
