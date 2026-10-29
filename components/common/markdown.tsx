import type React from "react";
import type { ElementType } from "react";
import ReactMarkdown, { type Components, type ExtraProps, type Options } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { sectionHeadingClass } from "@/components/layout/page";
import { markdownOptions } from "@/lib/markdown";
import { childrenToText, createSlugger } from "@/lib/markdown-utils";
import { cn } from "@/lib/utils";

/**
 * react-markdown hands every override below the hast `node` it is rendering. The
 * overrides spread their props onto DOM elements, so each tag printed
 * node="[object Object]" and the page payload repeated the element's whole
 * subtree, source positions included. This drops the prop before they run.
 */
function MarkdownWithoutNode({ components, ...options }: Options) {
	const overrides: Components = Object.fromEntries(
		Object.entries(components ?? {}).map(([tag, Override]) => {
			const Component = Override as ElementType;
			return [tag, ({ node: _node, ...props }: ExtraProps) => <Component {...props} />];
		})
	);
	return <ReactMarkdown {...options} components={overrides} />;
}

interface MarkdownProps {
	className?: string;
	content: string;
}

/**
 * Shared markdown renderer used by blog posts and project case studies.
 *
 * Thorbis reading roles: body colour at 16px for prose, foreground at weight
 * 500 for headings and emphasis, more space above a heading than below it,
 * code in the source code well. A quote is set off by indent and voice, never
 * by a coloured edge rule (Thorbis D-018).
 * Adds stable, deduplicated heading ids (with scroll offset) so tables of
 * contents and deep links work consistently across the site.
 */
export function Markdown({ content, className }: MarkdownProps) {
	// Fresh slugger per render; ReactMarkdown walks headings in document order,
	// matching the ids produced by `extractToc`.
	const slugger = createSlugger();

	const headingId = (children: React.ReactNode) => slugger(childrenToText(children));

	return (
		<div
			className={cn(
				// A body that opens on a heading starts at the page rhythm, not rhythm plus margin.
				"relative flex min-w-0 flex-col gap-5 font-normal text-body text-copy-16 [&>:first-child]:mt-0",
				className
			)}
		>
			<MarkdownWithoutNode
				{...markdownOptions}
				rehypePlugins={[rehypeHighlight]}
				components={{
					p: ({ children, ...props }) => (
						<p className="leading-relaxed" {...props}>
							{children}
						</p>
					),
					a: ({
						children,
						href,
						...props
					}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) => {
						const linkHref = href || "";
						const isExternal = linkHref.startsWith("http");
						return (
							<a
								href={linkHref}
								target={isExternal ? "_blank" : undefined}
								rel={isExternal ? "noopener noreferrer" : undefined}
								className="link-underline wrap-break-word font-medium"
								{...props}
							>
								{children}
							</a>
						);
					},
					strong: ({ children, ...props }) => (
						<strong className="font-medium text-foreground" {...props}>
							{children}
						</strong>
					),
					em: ({ children, ...props }) => (
						<em className="italic" {...props}>
							{children}
						</em>
					),
					code: ({
						children,
						className: codeClassName,
						...props
					}: React.HTMLAttributes<HTMLElement>) => {
						// A fenced block without a language has no class either, but its text always
						// ends in the newline mdast-util-to-hast appends; a code span's never does.
						// Without this check those blocks drew an inline chip inside the code well.
						const isInline = !(codeClassName || String(children).endsWith("\n"));
						if (isInline) {
							return (
								<code
									className="wrap-anywhere rounded-sm bg-(--thorbis-code-bg) px-1.5 py-0.5 font-mono text-(--thorbis-code-fg) text-copy-14"
									{...props}
								>
									{children}
								</code>
							);
						}
						return (
							<code className={codeClassName} {...props}>
								{children}
							</code>
						);
					},
					// Thorbis markdownPre: the code well wraps long lines instead of scrolling, so
					// it never becomes a scroll container that needs its own tab stop.
					pre: ({ children, ...props }) => (
						<pre
							className="wrap-anywhere my-2 whitespace-pre-wrap rounded-2xl border border-border bg-(--thorbis-code-bg) px-4 py-3.5 font-mono text-(--thorbis-code-fg) text-copy-14"
							{...props}
						>
							{children}
						</pre>
					),
					ul: ({ children, ...props }) => (
						<ul className="list-disc space-y-2 pl-5" {...props}>
							{children}
						</ul>
					),
					ol: ({ children, ...props }) => (
						<ol className="list-decimal space-y-2 pl-5" {...props}>
							{children}
						</ol>
					),
					li: ({ children, ...props }) => (
						<li className="pl-1" {...props}>
							{children}
						</li>
					),
					h1: ({ children, ...props }) => (
						<h1
							id={headingId(children)}
							className={cn(sectionHeadingClass, "mt-8 scroll-mt-24")}
							{...props}
						>
							{children}
						</h1>
					),
					h2: ({ children, ...props }) => (
						<h2
							id={headingId(children)}
							className={cn(sectionHeadingClass, "mt-8 scroll-mt-24")}
							{...props}
						>
							{children}
						</h2>
					),
					h3: ({ children, ...props }) => (
						<h3
							id={headingId(children)}
							className="mt-5 scroll-mt-24 text-balance font-medium text-foreground text-heading-16"
							{...props}
						>
							{children}
						</h3>
					),
					h4: ({ children, ...props }) => (
						<h4
							id={headingId(children)}
							className="mt-4 scroll-mt-24 font-medium text-copy-16 text-foreground"
							{...props}
						>
							{children}
						</h4>
					),
					// Thorbis markdown quote: upright body text set in from a 2px rule in the
					// neutral border colour (never an accent), on the body's own rhythm.
					blockquote: ({ children, ...props }) => (
						<blockquote
							className="flex flex-col gap-5 text-pretty border-border border-s-2 ps-4"
							{...props}
						>
							{children}
						</blockquote>
					),
					hr: ({ ...props }) => <hr className="my-4 border-border" {...props} />,
				}}
			>
				{content}
			</MarkdownWithoutNode>
		</div>
	);
}
