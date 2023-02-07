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
		name: "SpaceX",
		description: "Playing around with the SpaceX API",
		link: "/playground/spacex",
		imageUrl:
			"https://infosec-jobs.com/media/cache/bb/cc/bbccd9053fcace2a080d3d539e04079a.jpg",
	},
	{
		id: 3,
		name: "Twilio SMS",
		description: "I think twilios SMS is pretty cool",
		link: "/playground/twilioSMS",
		imageUrl:
			"https://www.twilio.com/assets/icons/twilio-icon-512_maskable.png",
	},
	{
		id: 4,
		name: "Guestbook",
		description: "A github authorization to allow chatting on the website!",
		link: "/playground/guestbook",
		imageUrl:
			"https://play-lh.googleusercontent.com/PCpXdqvUWfCW1mXhH1Y_98yBpgsWxuTSTofy3NGMo9yBTATDyzVkqU580bfSln50bFU",
	},
];

export default function Playground() {
	return (
		<section>
			<h1 className='font-bold text-3xl'>Playground</h1>
			<p className='my-5 text-neutral-800 dark:text-neutral-200'>
				This is all the stuff ive been trying to figure out for fun.
			</p>
			<div className='prose prose-neutral dark:prose-invert text-neutral-800 dark:text-neutral-200'>
				<div className='tabs tabs-boxed inline-block'>
					<a className='tab tab-active !bg-yellow-500 !text-black no-underline'>
						For Fun
					</a>
					<a className='tab  no-underline'>Future Projects</a>
				</div>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-1'>
					{people.map((person) => (
						<Link
							href={person.link}
							key={person.id}
							className='hover:scale-105 transform-gpu no-underline relative flex items-center space-x-3 rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400'>
							<div className='flex-shrink-0'>
								<img
									className='h-10 w-10 rounded-full'
									src={person.imageUrl}
									alt=''
								/>
							</div>
							<div className='min-w-0 flex-1'>
								<span className='text-sm font-medium text-white block no-underline'>
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
