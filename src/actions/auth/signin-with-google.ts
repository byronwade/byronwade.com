"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signinWithGoogle() {
	const supabase = createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: "http://localhost:3000/api/auth/callback",
		},
	});

	if (error) {
		console.log(error);
		//redirect("/error");
	}

	if (data && data.url) {
		redirect(data.url);
	}
}
