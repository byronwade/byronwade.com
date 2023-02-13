import Link from "next/link";
import { useEffect, useState } from "react";
import { getRepos } from "src/lib/metrics";

export default function GetRepo() {
	const [repos, setRepos] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const repoData = await getRepos();
				setRepos(repoData.getRepo);
			} catch (error) {
				setError(error);
			}
		})();
	}, []);

	console.log(repos);

	return (
		<>
			{error && (
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
							An error occurred while fetching repository data,
							please try again later.
						</span>
					</div>
				</div>
			)}
			{repos &&
				repos.map((repo, index) => (
					<Link
						key={index}
						href={repo.url}
						className="mb-6 hover:scale-105 no-underline card card-compact bg-zinc-900 shadow-xl"
					>
						<figure className="m-0">
							<img
								src={`https://via.placeholder.com/650x350/ffffff/808080%20?text=${repo.name}`}
								alt={repo.name}
							/>
						</figure>
						<div className="card-body">
							<h2 className="card-title m-0">{repo.name}</h2>
							<p>{repo.description}</p>
							<span>Stars: {repo.stars}</span>
							<span>Watchers: {repo.watchers}</span>
						</div>
					</Link>
				))}
		</>
	);
}
