/**
 * Renders a JSON-LD structured-data script.
 *
 * `<` is escaped to `<` so a value containing `</script>` cannot close the
 * tag and inject markup. Content here comes from Markdown front-matter today,
 * but escaping keeps that from becoming a breakout the moment any of it is
 * sourced from somewhere less trusted.
 */
export function JsonLd({ data }: { data: object }) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inline; the payload is serialized and escaped above.
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
		/>
	);
}
