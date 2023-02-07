"use client";
import { useState } from "react";

export const metadata = {
	title: "Contact",
	description: "Contact me",
};

export default function Contact() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		let data = {
			name,
			email,
			message,
		};
		fetch("/api/contact", {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}).then((res) => {
			if (res.status === 200) {
				setSuccess(true);
				setName("");
				setEmail("");
				setMessage("");
			} else {
				setError(true);
			}
		});
	};

	return (
		<section>
			<h1 className='font-bold text-3xl'>Contact</h1>
			<p className='my-5 text-neutral-800 dark:text-neutral-200'>
				Get in contact with me, im always looking for friends and connections.
			</p>
			<div className='prose prose-neutral dark:prose-invert text-neutral-800 dark:text-neutral-200'>
				<div>
					<form>
						<div className='mb-4'>
							<div className='flex justify-between'>
								<label htmlFor='email' className='block text-sm font-medium'>
									Name
								</label>
							</div>
							<div className='mt-1'>
								<input
									type='text'
									name='name'
									id='name'
									onChange={(e) => {
										setName(e.target.value);
									}}
									className='border-zinc-800 bg-zinc-900 block w-full rounded-md sm:text-sm text-gray-300'
									placeholder='Byron Wade'
									aria-describedby='name-optional'
								/>
							</div>
						</div>
						<div className='mb-4'>
							<div className='flex justify-between'>
								<label htmlFor='email' className='block text-sm font-medium'>
									Email
								</label>
							</div>
							<div className='mt-1'>
								<input
									type='email'
									name='email'
									id='email'
									onChange={(e) => {
										setEmail(e.target.value);
									}}
									className='border-zinc-800 bg-zinc-900 block w-full rounded-md sm:text-sm text-gray-300'
									placeholder='you@example.com'
									aria-describedby='email-optional'
								/>
							</div>
						</div>
						<div className='mb-4'>
							<label htmlFor='comment' className='block text-sm font-medium'>
								What would you like to talk about?
							</label>
							<div className='mt-1'>
								<textarea
									rows={4}
									name='comment'
									id='comment'
									onChange={(e) => {
										setMessage(e.target.value);
									}}
									className='border-zinc-800 bg-zinc-900 block w-full rounded-md sm:text-sm text-gray-300'
									placeholder='Lets talk, it could be about anything'
									defaultValue={""}
								/>
							</div>
						</div>
						<div>
							<button
								type='submit'
								onClick={(e) => {
									handleSubmit(e);
								}}
								className='flex justify-center rounded-md border border-transparent bg-yellow-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'>
								Send
							</button>
						</div>
						<div>
							{success && (
								<div className='toast toast-end'>
									<div className='alert alert-success'>
										<div>
											<span>Message sent successfully.</span>
										</div>
									</div>
								</div>
							)}
							{error && (
								<div className='toast toast-end'>
									<div className='alert alert-error'>
										<div>
											<span>
												Something went wrong. Let me know at bw@wadesinc.io
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
