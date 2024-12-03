"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import * as React from "react";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
				refetchOnWindowFocus: false,
				refetchOnReconnect: false,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (typeof window === "undefined") {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = React.useState(() => getQueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
		</QueryClientProvider>
	);
}
