import type React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { markdownOptions } from "@/lib/markdown";
import { childrenToText, createSlugger } from "@/lib/markdown-utils";
import { cn } from "@/lib/utils";

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
				"relative flex min-w-full shrink-0 flex-col gap-5 font-normal text-body text-copy-16",
				className
			)}
		>
			<ReactMarkdown
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
								className="link-underline font-medium"
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
						const isInline = !codeClassName;
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
					pre: ({ children, ...props }) => (
						<pre
							className="my-2 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-copy-13"
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
							className="mt-8 scroll-mt-24 text-balance font-medium text-foreground text-heading-20 tracking-tight"
							{...props}
						>
							{children}
						</h1>
					),
					h2: ({ children, ...props }) => (
						<h2
							id={headingId(children)}
							className="mt-8 scroll-mt-24 text-balance font-medium text-foreground text-heading-20 tracking-tight"
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
					blockquote: ({ children, ...props }) => (
						<blockquote className="my-2 pl-5 text-foreground italic" {...props}>
							{children}
						</blockquote>
					),
					hr: ({ ...props }) => <hr className="my-4 border-border" {...props} />,
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
