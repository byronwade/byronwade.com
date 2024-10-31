"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import { AuthResponse } from "../../types/auth";

export async function signup(formData: FormData): Promise<AuthResponse> {
	const supabase = createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		console.log(error);
		return { error: error.message };
	}

	revalidatePath("/", "layout");
	redirect("/");
	return {};
}
