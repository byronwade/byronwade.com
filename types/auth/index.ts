import { User } from "@supabase/supabase-js";

export interface AuthResponse {
	user?: User;
	url?: string;
	error?: string;
}

export interface SignoutResponse {
	error?: string;
}
