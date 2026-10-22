// The action tests cannot deliver email or read a real service credential.
export const delivery = {
	requests: [],
	options: [],
	results: [],
	reset() {
		this.requests.length = 0;
		this.options.length = 0;
		this.results.length = 0;
	},
};

export class Resend {
	emails = {
		send(request, options) {
			delivery.requests.push(request);
			delivery.options.push(options);
			const result = delivery.results.shift();
			if (result instanceof Error) {
				return Promise.reject(result);
			}
			return Promise.resolve(result ?? { data: { id: "local-fixture" }, error: null });
		},
	};
}
