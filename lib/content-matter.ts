import matter from "gray-matter";
import yaml from "js-yaml";

type YamlType = InstanceType<typeof yaml.Type>;
type YamlSchema = InstanceType<typeof yaml.Schema>;

/**
 * js-yaml accepts `2026-02-30` as a timestamp and then constructs 2 March.
 * `Schema.create` cannot replace that implicit type: it only adds explicit
 * `!!timestamp` tags. Plain dates stay strings when this resolve returns false,
 * and `parseContentDate` rejects the original text. Valid dates still become
 * Date objects through js-yaml's own constructor.
 */
const CALENDAR_PREFIX = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|[Tt\s])/;

function stockTimestamp(): YamlType {
	const timestamp = yaml.DEFAULT_SAFE_SCHEMA.compiledImplicit.find(
		(type) => type.tag === "tag:yaml.org,2002:timestamp"
	);
	if (!timestamp) {
		throw new Error("js-yaml's safe schema has no timestamp type to tighten");
	}
	return timestamp;
}

function isRealUtcCalendarDay(year: number, month: number, day: number): boolean {
	const probe = new Date(Date.UTC(year, month - 1, day));
	return (
		probe.getUTCFullYear() === year &&
		probe.getUTCMonth() === month - 1 &&
		probe.getUTCDate() === day
	);
}

function acceptsCalendarDay(data: unknown, timestamp: YamlType): boolean {
	if (typeof data !== "string" || !timestamp.resolve(data)) {
		return false;
	}
	const match = CALENDAR_PREFIX.exec(data);
	if (!match) {
		return true;
	}
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	if (!(Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day))) {
		return false;
	}
	return isRealUtcCalendarDay(year, month, day);
}

function contentSchema(): YamlSchema {
	const timestamp = stockTimestamp();
	const strictTimestamp = new yaml.Type("tag:yaml.org,2002:timestamp", {
		kind: "scalar",
		resolve: (data) => acceptsCalendarDay(data, timestamp),
		construct: timestamp.construct,
		instanceOf: Date,
		represent: timestamp.represent,
	});
	const merge = yaml.DEFAULT_SAFE_SCHEMA.compiledImplicit.find(
		(type) => type.tag === "tag:yaml.org,2002:merge"
	);
	return new yaml.Schema({
		include: [yaml.CORE_SCHEMA],
		implicit: merge ? [strictTimestamp, merge] : [strictTimestamp],
	});
}

const schema = contentSchema();

function parseFrontMatter(source: string): object {
	const parsed = yaml.safeLoad(source, { schema });
	if (parsed === null || parsed === undefined) {
		return {};
	}
	if (typeof parsed !== "object" || Array.isArray(parsed)) {
		throw new TypeError("Content front matter must be a YAML mapping");
	}
	return parsed;
}

/** gray-matter types every value as `any`; this keeps each field `unknown` until it is read. */
type FrontMatter = Readonly<Record<string, unknown>>;

/** Read Markdown front matter with strict calendar dates. */
export function readContentMatter(source: string): { data: FrontMatter; content: string } {
	const { data, content } = matter(source, {
		engines: {
			yaml: {
				parse: parseFrontMatter,
			},
		},
	});
	return { data, content };
}

/**
 * Typed access to one file's front matter. A wrongly typed value is reported
 * with the file and field, then read as absent, so one typo drops one field
 * instead of crashing the page or hiding the whole file. Absent and `null`
 * values are simply absent.
 */
export function frontMatterFields(data: FrontMatter, file: string) {
	function report(key: string, expected: string): undefined {
		console.error(`Ignoring front matter "${key}" in ${file}: expected ${expected}`);
	}

	function read<T>(key: string, expected: string, accept: (value: unknown) => value is T) {
		const value = data[key];
		if (value === undefined || value === null) {
			return;
		}
		return accept(value) ? value : report(key, expected);
	}

	return {
		report,
		text: (key: string) => read(key, "text", isText),
		flag: (key: string) =>
			read(key, "true or false", (value): value is boolean => typeof value === "boolean"),
		number: (key: string) =>
			read(key, "a number", (value): value is number => Number.isFinite(value)),
		list: (key: string) => read(key, "a list", (value): value is unknown[] => Array.isArray(value)),
	};
}

export type FrontMatterFields = ReturnType<typeof frontMatterFields>;

export function isText(value: unknown): value is string {
	return typeof value === "string";
}
