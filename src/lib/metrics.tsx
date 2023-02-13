import { Octokit } from "@octokit/rest";
import { queryBuilder } from "./planetscale";
import { cache } from "react";

export const getBlogViews = cache(async () => {
	if (!process.env.TWITTER_API_TOKEN) {
		return 0;
	}

	const data = await queryBuilder
		.selectFrom("views")
		.select(["count"])
		.execute();

	return data.reduce((acc, curr) => acc + Number(curr.count), 0);
});

export async function getTweetCount() {
	if (!process.env.TWITTER_API_TOKEN) {
		return 0;
	}

	const response = await fetch(
		`https://api.twitter.com/2/users/by/username/byron_c_wade?user.fields=public_metrics`,
		{
			headers: {
				Authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
			},
		}
	);

	const { data } = await response.json();
	return Number(data.public_metrics.tweet_count);
}

export async function getDribbble() {
	const response = await fetch(
		"https://api.dribbble.com/v2/user/shots?access_token=3efebd272ebbd3f27426b0535456f1eade0d5238169654d47d9f797b31fcb08a&page=byronwade&per_page=50"
	);
	if (!response.ok) {
		throw new Error(
			`Unable to fetch data, status code: ${response.status}`
		);
	}
	const data = await response.json();
	return data;
}

export async function getDevAPI() {
	const response = await fetch(
		"https://dev.to/api/articles?username=byronwade"
	);
	if (!response.ok) {
		throw new Error(
			`Unable to fetch data, status code: ${response.status}`
		);
	}
	const data = await response.json();
	return data;
}

export const getRepos = cache(async () => {
	const octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN,
	});

	const req = await octokit.request("GET /users/{username}/repos", {
		username: "byronwade",
	});
	const getRepo = Object.keys(req.data).map(function (key) {
		return {
			name: req.data[key].name,
			url: req.data[key].html_url,
			stars: req.data[key].stargazers_count,
			watchers: req.data[key].watchers_count,
			forks: req.data[key].forks_count,
			full_name: req.data[key].full_name,
			description: req.data[key].description,
			language: req.data[key].language,
			created_at: req.data[key].created_at,
			updated_at: req.data[key].updated_at,
		};
	});
	let totalStars = 0;
	getRepo.forEach(function (repo) {
		totalStars += repo.stars;
	});
	return { getRepo, totalStars };
});
