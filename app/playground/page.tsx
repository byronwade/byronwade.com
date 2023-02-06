"use client";
import Link from "next/link";
export const metadata = {
	title: "Playground",
	description: "Playground",
};

const people = [
	{
		id: 1,
		name: "Integrating Stripe",
		description:
			"Trying to learn how to integrate stripe into this website so I know how to do it in the future.",
		link: "/playground/stripe",
		imageUrl:
			"https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg?q=80&w=1082",
	},
	{
		id: 2,
		name: "Integrating Stripe",
		description:
			"Trying to learn how to integrate stripe into this website so I know how to do it in the future.",
		link: "/playground/stripe",
		imageUrl:
			"https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg?q=80&w=1082",
	},
];

export default function Playground() {
	return (
		<section>
			<h1 className='font-bold text-3xl font-serif'>Playground</h1>
			<p className='my-5 text-neutral-800 dark:text-neutral-200'>
				This is all the stuff ive been trying to figure out for fun.
			</p>
			<div className='prose prose-neutral dark:prose-invert text-neutral-800 dark:text-neutral-200'>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-1'>
					{people.map((person) => (
						<Link
							href={person.link}
							key={person.id}
							className='no-underline relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400'>
							<div className='flex-shrink-0'>
								<img
									className='h-10 w-10 rounded-full'
									src={person.imageUrl}
									alt=''
								/>
							</div>
							<div className='min-w-0 flex-1'>
								<span className='text-sm font-medium text-gray-900 block no-underline'>
									{person.name}
								</span>
								<span className='truncate text-sm text-gray-500 block no-underline'>
									{person.description}
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
