"use server";

import { createClient } from "../../supabase/server";
import { AuthResponse } from "../../types/auth";

export async function signinWithPassword(formData: FormData): Promise<AuthResponse> {
	const supabase = createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { data: authData, error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		console.log(error);
		return { error: error.message };
	}

	return { user: authData.user };
}
