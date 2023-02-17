export async function graphqlQuery(query, variables) {
	const response = await fetch("https://byronw34.sg-host.com/graphql", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query, variables }),
	});

	const { data, errors } = await response.json();

	if (errors) {
		throw new Error(errors[0].message);
	}

	return data;
}
