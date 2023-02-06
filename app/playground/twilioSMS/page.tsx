"use client";
import { BaseSyntheticEvent, useState } from "react";

export const metadata = {
	title: "Text Me",
	description: "Text me",
};

export default function TextMe() {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	const sendMessage = async (e: BaseSyntheticEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(false);
		setSuccess(false);
		const res = await fetch("/api/sendMessage", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: name, phone: phone, message: message }),
		});
		const apiResponse = await res.json();

		if (apiResponse.success) {
			setSuccess(true);
		} else {
			setError(true);
		}
		setLoading(false);
	};

	return (
		<section>
			<h1 className='font-bold text-3xl'>Text Me</h1>
			<p className='my-5 text-neutral-800 dark:text-neutral-200'>
				Send me a text!
			</p>
			<div className='prose prose-neutral dark:prose-invert text-neutral-800 dark:text-neutral-200'>
				<div>
					<form onSubmit={sendMessage}>
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
									className='border-zinc-800 bg-zinc-900 block w-full rounded-md sm:text-sm text-gray-700'
									placeholder='Byron Wade'
									aria-describedby='name-optional'
								/>
							</div>
						</div>
						<div className='mb-4'>
							<div className='flex justify-between'>
								<label htmlFor='phone' className='block text-sm font-medium'>
									Phone Number
								</label>
							</div>
							<div className='mt-1'>
								<input
									type='number'
									name='phone'
									id='phone'
									onChange={(e) => {
										setPhone(e.target.value);
									}}
									className='border-zinc-800 bg-zinc-900 block w-full rounded-md sm:text-sm text-gray-700'
									placeholder='8412244345'
									aria-describedby='phone-optional'
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
									className='border-zinc-800 bg-zinc-900 block w-full rounded-md sm:text-sm text-gray-700'
									defaultValue={""}
								/>
							</div>
						</div>
						<div>
							<button
								type='submit'
								disabled={loading}
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
