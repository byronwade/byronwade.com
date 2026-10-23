import fileSystem from "node:fs/promises";
import { syncBuiltinESMExports } from "node:module";
import { resolve } from "node:path";

// Only this test's child server sees a transient missing font. Keep the real
// asset untouched so concurrent checks and subsequent requests remain safe.
const font = resolve("assets/og/inter-og-regular.ttf");
const readFile = fileSystem.readFile;
let failed = false;
fileSystem.readFile = function readWithOneFontFailure(path, ...options) {
	if (!failed && typeof path === "string" && resolve(path) === font) {
		failed = true;
		return Promise.reject(new Error("Synthetic missing OG font"));
	}
	return readFile.call(this, path, ...options);
};
syncBuiltinESMExports();
