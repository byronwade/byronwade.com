import { notFound } from "next/navigation";

export default function Page({ params }: { params: { code: string } }) {
	// This page should never be rendered directly
	notFound();
}
