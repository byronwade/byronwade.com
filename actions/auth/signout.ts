"use server";

import { createClient } from "../../supabase/server";
import { SignoutResponse } from "../../types/auth";

export async function signout(): Promise<SignoutResponse> {
	const supabase = createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		console.log(error);
		return { error: error.message };
	}

	console.log("User signed out");
	return { error: undefined };
}
