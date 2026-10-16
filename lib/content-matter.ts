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

/** Read Markdown front matter with strict calendar dates. */
export function readContentMatter(source: string): matter.GrayMatterFile<string> {
	return matter(source, {
		engines: {
			yaml: {
				parse: parseFrontMatter,
			},
		},
	});
}
