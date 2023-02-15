import {
	ArrowIcon,
	GitHubIcon,
	TwitterIcon,
	ViewsIcon,
	YoutubeIcon,
} from "src/components/icons";
import { getBlogViews, getRepos, getTweetCount } from "src/lib/metrics";
import Image from "next/image";

export default async function HomePage() {
	const [starCount, views, tweetCount] = await Promise.all([
		getRepos(),
		getBlogViews(),
		getTweetCount(),
	]);

	return (
		<section className="">
			<h1 className="font-bold text-5xl">Byron Wade</h1>
			<p className="my-5 max-w-[460px] text-neutral-800 dark:text-neutral-200">
				Im a pretty cool guy with some cool stuff
			</p>
			<div className="flex items-start md:items-center my-8 flex-col md:flex-row">
				<div className="avatar">
					<div className="w-24 rounded-full ring ring-warning ring-offset-base-100 ring-offset-2">
						<Image
							alt="Byron Wade"
							className="rounded-full grayscale"
							src="./avatar.jpg"
							placeholder="blur"
							width={100}
							priority
						/>
					</div>
				</div>
				<div className="mt-8 md:mt-0 ml-0 md:ml-6 space-y-2 text-neutral-500 dark:text-neutral-400">
					<p className="flex items-center gap-2">
						<TwitterIcon />
						{`${tweetCount.toLocaleString()} tweets all time`}
					</p>
					<p className="flex items-center gap-2">
						<GitHubIcon />
						{`${starCount.totalStars.toLocaleString()} stars all time`}
					</p>
					<p className="flex items-center">
						<ViewsIcon />
						{`${views.toLocaleString()} blog views all time`}
					</p>
				</div>
			</div>
			<div>
				<button
					type="button"
					className="inline-flex items-center rounded-md border border-transparent bg-yellow-300 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
				>
					buy my coffee
				</button>
			</div>
			<div className="mb-[10em] prose prose-neutral dark:prose-invert text-neutral-800 dark:text-neutral-200">
				<p className="my-5 max-w-[600px] text-neutral-800 dark:text-neutral-200">
					Stuff about me thats kinda cool
				</p>
				<p>
					I'm currently the{" "}
					<b>VP of Developer Experience at Vercel</b>, where I lead
					our Developer Relations and Documentation teams. I focus on{" "}
					<b>educating and growing</b> the Vercel and Next.js
					communities.
				</p>
				<div className="divider"></div>
				<p>
					I'm passionate about many creative pursuits, including
					music, photography, videography, and of course, coding. This
					combination of interests is what ultimately led me to my
					current role in building developer communities.
				</p>
				<p>
					I <b>love</b> building for the web. From something as simple
					as a single HTML file – all the way to large Next.js
					applications. The web is incredible. Anyone can become a
					developer, writer, or creator – and no one has to ask for
					permission. You can just build.
				</p>
				<p className="mb-8">
					Outside of Vercel, I <b>angel invest</b> in developer tools
					companies and <b>advise early-stage startups</b>. I also do
					Developer Relations consulting work, helping companies take
					their DevRel function from 0 to 1, or provide guidance on
					growing communities, content creation, and developer
					marketing.
				</p>
				<div className="flex flex-col gap-2 md:flex-row md:gap-2">
					<a
						rel="noopener noreferrer"
						target="_blank"
						href="https://twitter.com/leeerob"
						className="flex w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 no-underline items-center text-neutral-800 dark:text-neutral-200 hover:dark:bg-neutral-900 hover:bg-neutral-100 transition-all justify-between"
					>
						<div className="flex items-center">
							<TwitterIcon />
							<div className="ml-3">Twitter</div>
						</div>
						<ArrowIcon />
					</a>
					<a
						rel="noopener noreferrer"
						target="_blank"
						href="https://github.com/leerob"
						className="flex w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 no-underline items-center text-neutral-800 dark:text-neutral-200 hover:dark:bg-neutral-900 hover:bg-neutral-100 transition-all justify-between"
					>
						<div className="flex items-center">
							<GitHubIcon />
							<div className="ml-3">GitHub</div>
						</div>
						<ArrowIcon />
					</a>
					<a
						rel="noopener noreferrer"
						target="_blank"
						href="https://www.youtube.com/@leerob"
						className="flex w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 no-underline items-center text-neutral-800 dark:text-neutral-200 hover:dark:bg-neutral-900 hover:bg-neutral-100 transition-all justify-between"
					>
						<div className="flex items-center">
							<YoutubeIcon />
							<div className="ml-3">YouTube</div>
						</div>
						<ArrowIcon />
					</a>
				</div>
			</div>
		</section>
	);
}
