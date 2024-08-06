"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AuthResponse } from "@/types/auth";

export async function signinWithGoogle(): Promise<AuthResponse> {
	const supabase = createClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: "http://localhost:3000/api/auth/callback",
		},
	});

	if (error) {
		console.log(error);
		return { error: error.message };
	}

	if (data && data.url) {
		redirect(data.url);
	}

	return { url: data?.url };
}
