"use client";

import { headers } from "next/headers";

export function EnvScript() {
	const headersList = headers();
	const envVars = headersList.get("x-env");

	return (
		<script
			dangerouslySetInnerHTML={{
				__html: `window.__ENV = ${envVars || "{}"};`,
			}}
		/>
	);
}
