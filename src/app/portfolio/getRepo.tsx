import Link from "next/link";
import { getRepos } from "src/lib/metrics";

export default async function GetRepo() {
	const [getRepo] = await Promise.all([getRepos()]);

	return (
		<>
			{getRepo ? (
				getRepo.getRepo.map((repo, index) => {
					return (
						<Link
							key={index}
							href={repo.url}
							className="mb-6 hover:scale-105 no-underline card card-compact bg-zinc-900 shadow-xl"
						>
							<figure className="m-0">
								<img
									src="https://via.placeholder.com/600x300"
									alt={repo.name}
								/>
							</figure>
							<div className="card-body">
								<h2 className="card-title m-0">{repo.name}</h2>
								<span className="block">
									Stars: {repo.stars} - Watchers:{" "}
									{repo.watchers} - Forks {repo.forks}
								</span>
								<span className="block">{repo.language}</span>
								<span className="block">
									{new Date(repo.created_at).toLocaleString()}
								</span>
								<span className="block">
									{new Date(repo.updated_at).toLocaleString()}
								</span>
							</div>
						</Link>
					);
				})
			) : (
				<div className="alert alert-error shadow-lg mb-4">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current flex-shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>
							This is an error alert for my github feed, ive
							probably hit my API limit
						</span>
					</div>
				</div>
			)}
		</>
	);
}
