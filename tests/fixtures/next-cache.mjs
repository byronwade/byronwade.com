export const invalidations = {
	requests: [],
	error: undefined,
	reset() {
		this.requests.length = 0;
		this.error = undefined;
	},
};

export function revalidateTag(tag, profile) {
	if (invalidations.error) {
		throw invalidations.error;
	}
	invalidations.requests.push({ tag, profile });
}
