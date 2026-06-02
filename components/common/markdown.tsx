import type React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { childrenToText, createSlugger } from "@/lib/markdown-utils";
import { cn } from "@/lib/utils";

interface MarkdownProps {
	content: string;
	className?: string;
}

/**
 * Shared markdown renderer used by blog posts and project case studies.
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
				"relative flex min-w-full shrink-0 flex-col gap-5 text-base font-normal text-[var(--foreground)]",
				className
			)}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
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
								className="font-medium text-[var(--foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-[3px] transition-colors duration-200 hover:decoration-[var(--foreground)]"
								{...props}
							>
								{children}
							</a>
						);
					},
					strong: ({ children, ...props }) => (
						<strong className="font-semibold text-[var(--foreground)]" {...props}>
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
									className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-sm text-brand"
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
							className="my-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm"
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
						<li className="pl-1 text-base leading-relaxed" {...props}>
							{children}
						</li>
					),
					h1: ({ children, ...props }) => (
						<h1
							id={headingId(children)}
							className="mt-8 mb-4 scroll-mt-24 text-2xl font-semibold text-[var(--foreground)]"
							{...props}
						>
							{children}
						</h1>
					),
					h2: ({ children, ...props }) => (
						<h2
							id={headingId(children)}
							className="mt-8 mb-4 scroll-mt-24 text-xl font-semibold text-[var(--foreground)]"
							{...props}
						>
							{children}
						</h2>
					),
					h3: ({ children, ...props }) => (
						<h3
							id={headingId(children)}
							className="mt-6 mb-3 scroll-mt-24 text-lg font-semibold text-[var(--foreground)]"
							{...props}
						>
							{children}
						</h3>
					),
					h4: ({ children, ...props }) => (
						<h4
							id={headingId(children)}
							className="mt-6 mb-3 scroll-mt-24 text-base font-semibold text-[var(--foreground)]"
							{...props}
						>
							{children}
						</h4>
					),
					blockquote: ({ children, ...props }) => (
						<blockquote
							className="my-4 border-l-2 border-brand py-1 pl-4 italic text-[var(--muted-foreground)]"
							{...props}
						>
							{children}
						</blockquote>
					),
					hr: ({ ...props }) => <hr className="my-6 border-[var(--border)]" {...props} />,
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
