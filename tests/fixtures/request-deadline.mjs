import assert from "node:assert/strict";
import { once } from "node:events";

const realTimeout = AbortSignal.timeout.bind(AbortSignal);
const realJson = Response.prototype.json;

// Hold only the stalled request's clock until its transport reaches the phase
// under test. Retries keep the real production deadline, even on a busy worker.
export function holdFirstDeadline(context) {
	const controller = new AbortController();
	const deadlines = [];
	const bodyStarted = Promise.withResolvers();
	context.mock.method(AbortSignal, "timeout", (duration) => {
		deadlines.push(duration);
		return deadlines.length === 1 ? controller.signal : realTimeout(duration);
	});
	context.mock.method(Response.prototype, "json", function json() {
		const reading = realJson.call(this);
		bodyStarted.resolve();
		return reading;
	});
	return {
		deadlines,
		bodyStarted: bodyStarted.promise,
		async expire() {
			assert.equal(deadlines.length, 1, "Only the initial request's deadline is held");
			assert.equal(controller.signal.aborted, false, "The deadline expires once");
			// Use Node's native timeout reason and real fetch cancellation, without
			// racing a short timer against connection setup or a successful retry.
			const expired = realTimeout(0);
			await once(expired, "abort");
			controller.abort(expired.reason);
		},
	};
}
