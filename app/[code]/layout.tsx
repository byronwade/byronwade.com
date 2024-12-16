import { ReactNode } from "react";
import { pageFlags } from "@/lib/feature-flags";
import { unstable_generatePermutations as generatePermutations } from "@vercel/flags/next";
import { unstable_deserialize as deserialize } from "@vercel/flags/next";
import { encrypt } from "@vercel/flags";
import { FlagValues } from "@vercel/flags/react";
import { Suspense } from "react";

export async function generateStaticParams() {
	const codes = await generatePermutations(pageFlags);
	return codes.map((code) => ({ code }));
}

export default async function Layout({ children, params }: { children: ReactNode; params: { code: string } }) {
	const values = await deserialize(pageFlags, params.code);

	return (
		<>
			{children}
			<Suspense fallback={null}>
				<FlagValues values={await encrypt(values)} />
			</Suspense>
		</>
	);
}
