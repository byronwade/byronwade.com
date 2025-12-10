/**
 * URL State Management Hooks using nuqs
 *
 * AGENTS.md: MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels)
 *
 * Usage examples:
 *
 * // Simple string state
 * const [tab, setTab] = useQueryState('tab')
 *
 * // With default value
 * const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
 *
 * // Multiple states at once
 * const [{ q, page, sort }, setParams] = useQueryStates({
 *   q: parseAsString,
 *   page: parseAsInteger.withDefault(1),
 *   sort: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('asc')
 * })
 */

// Re-export all nuqs utilities for convenience
export {
	useQueryState,
	useQueryStates,
	parseAsString,
	parseAsInteger,
	parseAsFloat,
	parseAsBoolean,
	parseAsArrayOf,
	parseAsJson,
	parseAsStringLiteral,
	parseAsNumberLiteral,
	parseAsIsoDateTime,
	parseAsTimestamp,
	createParser,
	createSerializer,
} from "nuqs";

// Common parsers for typical use cases
export { parseAsInteger as parseAsPage } from "nuqs";
