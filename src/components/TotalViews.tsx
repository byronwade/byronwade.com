"use client";
import { ViewsIcon } from "src/components/icons";
import graphQLClient from "../lib/graphql-client";
import { useEffect, useState } from "react";
import { GET_ALL_POST_VIEWS } from "../lib/queries/GET_ALL_POST_VIEWS";

export default function TotalViews() {
	const [views, setViews] = useState([]);

	useEffect(() => {
		graphQLClient
			.request(GET_ALL_POST_VIEWS)
			.then((data) => {
				setViews(data.totalPostViews);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);
	return (
		<>
			<p className="flex items-center">
				<ViewsIcon />
				{`${views} blog views all time`}
			</p>
		</>
	);
}
