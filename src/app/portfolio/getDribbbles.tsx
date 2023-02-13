import Link from "next/link";
import { useEffect, useState } from "react";
import { getDribbble } from "src/lib/metrics";

export default function GetDribble() {
	const [dribbbles, setDribbbles] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const dribbbles = await getDribbble();
				setDribbbles(dribbbles);
			} catch (error) {
				setError(error);
			}
		})();
	}, []);

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
							This is an error alert for my dribble feed, ive
							probably hit my API limit
						</span>
					</div>
				</div>
			)}
			{dribbbles &&
				dribbbles.map((repo, index) => (
					<div>{repo}</div>
					// <Link
					// 	key={index}
					// 	href={repo.html_url}
					// 	className="mb-6 hover:scale-105 no-underline card card-compact bg-zinc-900 shadow-xl"
					// >
					// 	<figure className="m-0">
					// 		<img src={repo.images.hidpi} alt={repo.title} />
					// 	</figure>
					// 	<div className="card-body">
					// 		<h2 className="card-title m-0">{repo.title}</h2>
					// 		<p>{repo.description.replace(/<[^>]*>/g, "")}</p>
					// 	</div>
					// </Link>
				))}
		</>
	);
}
