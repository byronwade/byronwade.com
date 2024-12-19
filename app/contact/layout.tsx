import { metadata as contactMetadata } from "./metadata";

export const metadata = contactMetadata;

export default function ContactLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
