import {
	ArrowIcon,
	GitHubIcon,
	TwitterIcon,
	ViewsIcon,
	YoutubeIcon,
} from "src/components/icons";
import { getRepos, getTweetCount } from "src/lib/metrics";
import Image from "next/image";
import Link from "next/link";
import JSONLD from "./JSONLD";
import { getAllViews } from "../lib/queries/getAllViews";

export default async function HomePage() {
	const [views, starCount, tweetCount] = await Promise.all([
		getAllViews(),
		getRepos(),
		getTweetCount(),
	]);

	return (
		<>
			<JSONLD />
			<section className="">
				<h1 className="font-bold text-5xl">Byron Wade</h1>
				<p className="my-5 max-w-[460px] text-neutral-800 dark:text-neutral-200">
					Hello, I'm Byron, the <b>CEO and Co-Owner of Wade's Inc</b>.
					As an entrepreneur, I always seek new opportunities to
					expand my company and create innovative solutions. I'm
					excited to share my story and vision with you.
				</p>
				<div className="flex items-start md:items-center my-8 flex-col md:flex-row">
					<div className="avatar">
						<div className="w-24 rounded-full ring ring-warning ring-offset-base-100 ring-offset-2">
							<Image
								alt="Byron Wade"
								className="rounded-full grayscale"
								src="/avatar.jpg"
								//placeholder="blur"
								height={100}
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
							{`${views} blog views all time`}
						</p>
					</div>
				</div>
				<div>
					{/* <button
					type="button"
					className="inline-flex items-center rounded-md border border-transparent bg-yellow-300 px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
				>
					buy my coffee
				</button> */}
				</div>
				<div className="mb-[10em] max-w-[460px] prose prose-neutral dark:prose-invert text-neutral-800 dark:text-neutral-200">
					<p>
						<b>Wade's Inc.</b> comprises two companies:{" "}
						<Link href="https://wadesplumbingandseptic.com/">
							Wade's Plumbing and Septic
						</Link>{" "}
						and{" "}
						<Link href="https://clogmonsterssepticpumping.com/">
							Clog Monsters Septic Pumping
						</Link>
						. In our first year, Wade's Plumbing and Septic
						generated an impressive revenue of{" "}
						<b className="text-green-700">$1.2 million</b>, and
						we're projected to reach{" "}
						<b className="text-green-700">$2.3 million</b> next year
						with ten employees.
					</p>
					<p>
						I'm studying Computer Science at Cabrillo College and
						plan to transfer to San Jose State to acquire my degree.
						Additionally, I'm considering pursuing degrees in Civil
						Engineering, Aerospace Engineering, and Criminal Justice
						to broaden my knowledge and expertise further.
					</p>
					<p>
						I'm always open to collaborations and new opportunities
						to contribute to website technology projects. I'm
						currently working on three innovative technology
						websites, including
						<Link href="https://github.com/byronwade/wadesacademy.com">
							{" "}
							Wade's Academy
						</Link>
						, which has the potential to revolutionize online
						learning in the construction industry.
					</p>
					<p className="mb-8">
						I'm a driven and passionate entrepreneur, continuously
						seeking new and innovative ways to expand my company and
						revolutionize the industry. I'm open to exploring
						collaboration and investment opportunities and would be
						honored to hear from you. Please don't hesitate to{" "}
						<Link href="/contact">reach out </Link>
						if you'd like to learn more about me and my vision.
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
		</>
	);
}
