export const siteConfig = {
	name: "Byron Wade",
	tagline: "Builder · Developer · Operator",
	description:
		"Full-stack developer and designer building fast, thoughtful web applications with Next.js, React, and TypeScript — and field software for service businesses.",
	url: process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com",
	location: "Jasper, Georgia",
	emailDisplay: "byron@byronwade.com",
	availability: "Available for conversations",
	social: {
		github: "https://github.com/byronwade",
		linkedin: "https://linkedin.com/in/byronwade",
		twitter: "https://twitter.com/byron_c_wade",
		x: "https://x.com/byron_c_wade",
		thorbis: "https://thorbis.com",
		sponsors: "https://github.com/sponsors/byronwade",
	},
} as const;

export const footerWorkLinks = [
	{ href: "/projects", label: "Projects" },
	{ href: "/portfolio", label: "Portfolio" },
	{ href: "/blog", label: "Writing" },
	{ href: "/resume", label: "Resume" },
] as const;

export const footerCompanyLinks = [
	{ href: "/contact", label: "Contact" },
	{ href: "/privacy", label: "Privacy" },
	{ href: "/terms", label: "Terms" },
] as const;

export const footerProductLinks = [
	{ href: "https://thorbis.com", label: "Thorbis", external: true },
	{ href: "https://wadesplumbingandseptic.com", label: "Wade's Plumbing", external: true },
	{ href: "https://github.com/byronwade", label: "Open Source", external: true },
] as const;
