"use client";
import { useEffect, useState } from "react";
import { signup, signinWithPassword, signout, signinWithGithub, signinWithGoogle, getUser } from "@/actions/auth";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { AuthResponse } from "@/types/auth";

const supabase = createClient();

export default function LoginPage() {
	const [user, setUser] = useState<User | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				setUser(session?.user ?? null);
			} else if (event === "SIGNED_OUT") {
				setUser(null);
			}
		});

		const fetchUser = async () => {
			const response: AuthResponse = await getUser();
			if (response.error) {
				console.log("Get User: ", response.error);
				setError(response.error);
			} else if (response.user) {
				setUser(response.user);
			}
		};

		fetchUser();

		// Cleanup the subscription on component unmount
		return () => {
			data?.subscription.unsubscribe();
		};
	}, []);

	console.log(user);

	const handleLogin: React.FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		setError(null);
		const formData = new FormData(event.currentTarget);
		const response: AuthResponse = await signinWithPassword(formData);
		if (response.error) {
			setError(response.error);
		} else if (response.user) {
			setUser(response.user);
		}
	};

	const handleSignup: React.FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		setError(null);
		const formData = new FormData(event.currentTarget);
		const response: AuthResponse = await signup(formData);
		if (response.error) {
			setError(response.error);
		} else if (response.user) {
			setUser(response.user);
		}
	};

	const handleSignout = async () => {
		await signout();
		setUser(null);
	};

	const handleGithubLogin = async () => {
		const response: AuthResponse = await signinWithGithub();
		if (response.error) {
			setError(response.error);
		} else if (response.url) {
			window.location.href = response.url;
		}
	};

	const handleGoogleLogin = async () => {
		const response: AuthResponse = await signinWithGoogle();
		if (response.error) {
			setError(response.error);
		} else if (response.url) {
			window.location.href = response.url;
		}
	};

	return (
		<div>
			{error?.includes("Email not confirmed") && <p>Please confirm your email address.</p>}
			<h1>{user?.email}</h1>
			{!user ? (
				<>
					<form onSubmit={handleLogin}>
						<label htmlFor="email">Email:</label>
						<input id="email" name="email" type="email" required />
						<label htmlFor="password">Password:</label>
						<input id="password" name="password" type="password" required />
						<button type="submit">Log in</button>
					</form>
					<form onSubmit={handleSignup}>
						<label htmlFor="email">Email:</label>
						<input id="email" name="email" type="email" required />
						<label htmlFor="password">Password:</label>
						<input id="password" name="password" type="password" required />
						<button type="submit">Sign up</button>
					</form>
					<button onClick={handleGithubLogin}>Sign in with Github</button>
					<button onClick={handleGoogleLogin}>Sign in with Google</button>
				</>
			) : (
				<button onClick={handleSignout}>Signout</button>
			)}
		</div>
	);
}
