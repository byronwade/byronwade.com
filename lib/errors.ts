export class ShopifyError extends Error {
	constructor(message: string, public code: string, public status?: number, public cause?: unknown) {
		super(message);
		this.name = "ShopifyError";
	}

	static invalidInput(message: string) {
		return new ShopifyError(message, "INVALID_INPUT", 400);
	}

	static notFound(message: string) {
		return new ShopifyError(message, "NOT_FOUND", 404);
	}

	static fetchError(message: string, cause?: unknown) {
		return new ShopifyError(message, "FETCH_ERROR", 500, cause);
	}
}

export class BlogError extends Error {
	constructor(message: string, public code: string, public status?: number, public cause?: unknown) {
		super(message);
		this.name = "BlogError";
	}

	static invalidInput(message: string) {
		return new BlogError(message, "INVALID_INPUT", 400);
	}

	static notFound(message: string) {
		return new BlogError(message, "NOT_FOUND", 404);
	}

	static fetchError(message: string, cause?: unknown) {
		return new BlogError(message, "FETCH_ERROR", 500, cause);
	}
}
