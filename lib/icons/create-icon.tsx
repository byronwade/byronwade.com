import type { Icon, IconProps, IconWeight } from "@phosphor-icons/react/dist/lib/types";

/** Keep the site weight overridable and give every wrapper a useful component name. */
export function createIcon(Base: Icon, weight: IconWeight, name: string) {
	const Wrapped = (props: IconProps) => <Base weight={weight} {...props} />;
	Wrapped.displayName = name;
	return Wrapped;
}
