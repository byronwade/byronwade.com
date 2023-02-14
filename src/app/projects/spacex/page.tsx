"use client";
import { useEffect, useState } from "react";

export default function SpaceX() {
	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		fetch("https://api.spacexdata.com/latest/launches")
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setData(data);
				setLoading(false);
			});
	}, []);
	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No profile data</p>;
	return (
		<section>
			<h1 className='font-bold text-3xl'>SpaceX</h1>
			<p className='my-5 text-neutral-800 dark:text-neutral-200'>
				All new Launches
			</p>
			<div className='prose prose-neutral dark:prose-invert text-neutral-800 dark:text-neutral-200'>
				{JSON.stringify(data)}
			</div>
		</section>
	);
}
