"use server";
import { createClient } from "../../supabase/server";
import { AuthResponse } from "../../types/auth";

export async function getUser(): Promise<AuthResponse> {
	const supabase = createClient();

	// Check if there is an active session
	const {
		data: { session },
		error: sessionError,
	} = await supabase.auth.getSession();

	if (sessionError || !session) {
		console.log(sessionError || "No active session found.");
		return { user: undefined, error: sessionError ? sessionError.message : "No active session found." };
	}

	// Fetch the user information
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.log(userError);
		return { user: undefined, error: userError.message };
	}

	return { user: user || undefined, error: undefined };
}
