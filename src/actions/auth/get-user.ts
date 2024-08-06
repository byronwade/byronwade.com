"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUser() {
	const supabase = createClient();

	// Check if there is an active session
	const {
		data: { session },
		error: sessionError,
	} = await supabase.auth.getSession();

	if (sessionError || !session) {
		console.log(sessionError || "No active session found.");
		return { user: null, error: sessionError ? sessionError.message : "No active session found." };
	}

	// Fetch the user information
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.log(userError);
		return { user: null, error: userError.message };
	}

	return { user, error: null };
}
