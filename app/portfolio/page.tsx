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
	console.log(getDribbbles);
	return (
		<section>
			<h1 className='font-bold text-3xl'>Portfolio</h1>
			<div className='prose prose-neutral dark:prose-invert text-neutral-800 dark:text-neutral-200'>
				{getDribbbles.map((repo, index) => {
					return (
						<div key={index}>
							<img src={repo.images.hidpi} />
							<Link href={repo.html_url}>{repo.title}</Link>
							<p>{repo.description.replace(/<[^>]*>/g, "")}</p>
						</div>
					);
				})}
				{getRepo.getRepo.map((repo, index) => {
					return (
						<div key={index}>
							<h2>{repo.name}</h2>
							<Link href={repo.url}>{repo.full_name}</Link>
							<p>
								Stars: {repo.stars} - Watchers: {repo.watchers} - Forks{" "}
								{repo.forks}
							</p>
							<p>{repo.language}</p>
							<p>{new Date(repo.created_at).toLocaleString()}</p>
							<p>{new Date(repo.updated_at).toLocaleString()}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
