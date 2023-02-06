import Link from "next/link";

export const metadata = {
	title: "Portfolio",
	description: "My Projects",
};

import { getDribbble, getRepos } from "lib/metrics";

export default async function Portfolio() {
	const [getRepo, getDribbbles] = await Promise.all([
		getRepos(),
		getDribbble(),
	]);

	return (
		<section>
			<h1 className='font-bold text-3xl'>Portfolio</h1>
			<div className='prose prose-neutral dark:prose-invert text-neutral-800 dark:text-neutral-200'>
				<div className='tabs tabs-boxed inline-block'>
					<a className='tab no-underline'>Github</a>
					<a className='tab tab-active !bg-yellow-500 !text-black no-underline'>
						Dribble
					</a>
				</div>
				{getDribbbles.map((repo, index) => {
					return (
						<Link
							key={index}
							href={repo.html_url}
							className='mb-6 hover:scale-105 no-underline card card-compact bg-zinc-900 shadow-xl'>
							<figure className='m-0'>
								<img src={repo.images.hidpi} alt={repo.title} />
							</figure>
							<div className='card-body'>
								<h2 className='card-title m-0'>{repo.title}</h2>
								<p>{repo.description.replace(/<[^>]*>/g, "")}</p>
							</div>
						</Link>
					);
				})}
				{getRepo.getRepo.map((repo, index) => {
					return (
						<Link
							key={index}
							href={repo.url}
							className='mb-6 hover:scale-105 no-underline card card-compact bg-zinc-900 shadow-xl'>
							<figure className='m-0'>
								<img
									src='https://via.placeholder.com/600x300'
									alt={repo.name}
								/>
							</figure>
							<div className='card-body'>
								<h2 className='card-title m-0'>{repo.name}</h2>
								<span className='block'>
									Stars: {repo.stars} - Watchers: {repo.watchers} - Forks{" "}
									{repo.forks}
								</span>
								<span className='block'>{repo.language}</span>
								<span className='block'>
									{new Date(repo.created_at).toLocaleString()}
								</span>
								<span className='block'>
									{new Date(repo.updated_at).toLocaleString()}
								</span>
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
