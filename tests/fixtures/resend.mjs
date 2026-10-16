// The action tests cannot deliver email or read a real service credential.
export const delivery = {
	requests: [],
	results: [],
	reset() {
		this.requests.length = 0;
		this.results.length = 0;
	},
};

export class Resend {
	emails = {
		send(request) {
			delivery.requests.push(request);
			const result = delivery.results.shift();
			if (result instanceof Error) {
				return Promise.reject(result);
			}
			return Promise.resolve(result ?? { data: { id: "local-fixture" }, error: null });
		},
	};
}
