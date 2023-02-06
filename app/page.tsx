import {
	ArrowIcon,
	GitHubIcon,
	TwitterIcon,
	ViewsIcon,
} from "components/icons";
import { about, avatar, bio, name } from "lib/info";
import { getBlogViews, getRepos, getTweetCount } from "lib/metrics";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
	description:
		"Developer, writer, creator, plumber, entrepreneur and jack of all trades.",
	openGraph: {
		title: "Byron Wade",
		description:
			"Developer, writer, creator, plumber, entrepreneur and jack of all trades.",
		url: "https://byronwade.com",
		siteName: "Byron Wade",
		images: [
			{
				url: "https://byronwade.com/og.jpg",
				width: 1920,
				height: 1080,
			},
		],
		locale: "en-US",
		type: "website",
	},
};

export default async function HomePage() {
	const [starCount, views, tweetCount] = await Promise.all([
		getRepos(),
		getBlogViews(),
		getTweetCount(),
	]);

	return (
		<section className=''>
			<h1 className='font-bold text-5xl'>{name}</h1>
			<p className='my-5 max-w-[460px] text-neutral-800 dark:text-neutral-200'>
				{about()}
			</p>
			<div className='flex items-start md:items-center my-8 flex-col md:flex-row'>
				<div className='avatar'>
					<div className='w-24 rounded-full ring ring-warning ring-offset-base-100 ring-offset-2'>
						<Image
							alt={name}
							className='rounded-full grayscale'
							src={avatar}
							placeholder='blur'
							width={100}
							priority
						/>
					</div>
				</div>
				<div className='mt-8 md:mt-0 ml-0 md:ml-6 space-y-2 text-neutral-500 dark:text-neutral-400'>
					<p className='flex items-center gap-2'>
						<TwitterIcon />
						{`${tweetCount.toLocaleString()} tweets all time`}
					</p>
					<p className='flex items-center gap-2'>
						<GitHubIcon />
						{`${starCount.totalStars.toLocaleString()} stars all time`}
					</p>
					<p className='flex items-center'>
						<ViewsIcon />
						{`${views.toLocaleString()} blog views all time`}
					</p>
				</div>
			</div>
			<p className='my-5 max-w-[600px] text-neutral-800 dark:text-neutral-200'>
				{bio()}
			</p>
			<div>
				<button
					type='button'
					className='inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'>
					buy my coffee
				</button>
			</div>
			<ul className='flex flex-col md:flex-row mt-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0 font-sm text-neutral-500 dark:text-neutral-400'>
				<li>
					<a
						className='flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-all'
						rel='noopener noreferrer'
						target='_blank'
						href='https://twitter.com/byron_c_wade'>
						<ArrowIcon />
						<p className='h-7'>follow me on twitter</p>
					</a>
				</li>
				<li>
					<a
						className='flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-all'
						rel='noopener noreferrer'
						target='_blank'
						href='https://twitter.com/byron_c_wade'>
						<ArrowIcon />
						<p className='h-7'>follow me on twitter</p>
					</a>
				</li>
			</ul>
		</section>
	);
}
