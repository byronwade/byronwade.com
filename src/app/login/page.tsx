"use client";
import { useEffect, useState } from "react";
import { signup, signinWithPassword, signout, signinWithGithub, signinWithGoogle, getUser } from "@/actions/auth";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export default function LoginPage() {
	const [user, setUser] = useState<null | User>(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				setUser(session?.user ?? null);
			} else if (event === "SIGNED_OUT") {
				setUser(null);
			}
		});

		const fetchUser = async () => {
			const { user, error } = await getUser();
			if (error) {
				console.log("Get User: ", error);
			} else {
				setUser(user);
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
		const formData = new FormData(event.target);
		const { user, error } = await signinWithPassword(formData);
		if (error) {
			setError(error);
		} else {
			setUser(user);
		}
	};

	const handleSignup: React.FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		setError(null);
		const formData = new FormData(event.target);
		const { user, error } = await signup(formData);
		if (error) {
			setError(error);
		} else {
			setUser(user);
		}
	};

	const handleSignout = async () => {
		await signout();
		setUser(null);
	};

	const handleGithubLogin = async () => {
		const { url, error } = await signinWithGithub();
		if (error) {
			setError(error);
		} else if (url) {
			window.location.href = url;
		}
	};

	const handleGoogleLogin = async () => {
		const { url, error } = await signinWithGoogle();
		if (error) {
			setError(error);
		} else if (url) {
			window.location.href = url;
		}
	};

	return (
		<div>
			{(error as string)?.includes("Email not confirmed") && <p>Please confirm your email address.</p>}
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
