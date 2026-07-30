export type NavLink = {
	href: string;
	label: string;
	description?: string;
};

export type MegaNavItem = NavLink & {
	icon:
		| "folder"
		| "layout"
		| "pen"
		| "file"
		| "mail"
		| "github"
		| "globe"
		| "spark"
		| "code"
		| "users";
};

/** Primary mid-nav destinations (always visible on desktop). */
export const midNavLinks: NavLink[] = [
	{ href: "/", label: "Home" },
	{ href: "/projects", label: "Projects" },
	{ href: "/blog", label: "Writing" },
];

/** Work mega-menu — projects, portfolio, case studies. */
export const workNavLinks: MegaNavItem[] = [
	{
		href: "/projects",
		label: "Case Studies",
		description: "Client work, products, and builds with real-world problem solving.",
		icon: "folder",
	},
	{
		href: "/portfolio",
		label: "Open Source",
		description: "Live GitHub repositories, languages, and contribution activity.",
		icon: "github",
	},
	{
		href: "/blog",
		label: "Writing",
		description: "Notes on Next.js, React, performance, and service software.",
		icon: "pen",
	},
	{
		href: "/resume",
		label: "Resume",
		description: "Experience, skills, licenses, and downloadable PDF.",
		icon: "file",
	},
];

export const workMegaHighlights = [
	{
		href: "/projects/thorbis",
		label: "Thorbis",
		description: "Field management software for service professionals.",
	},
	{
		href: "/projects/wades-plumbing-and-septic",
		label: "Wade's Plumbing",
		description: "Marketing site for a multi-million dollar plumbing company.",
	},
	{
		href: "/projects/byronwade-ui",
		label: "byronwade/ui",
		description: "Design system and morphing chrome primitives.",
	},
] as const;

/** About mega-menu — who I am and how to reach me. */
export const aboutNavLinks: MegaNavItem[] = [
	{
		href: "/resume",
		label: "About & Resume",
		description: "Builder, developer, and operator based in Jasper, GA.",
		icon: "users",
	},
	{
		href: "/contact",
		label: "Contact",
		description: "Say hello about development, design, or collaborations.",
		icon: "mail",
	},
	{
		href: "https://thorbis.com",
		label: "Thorbis",
		description: "The field management product I'm building now.",
		icon: "spark",
	},
	{
		href: "https://github.com/byronwade",
		label: "GitHub",
		description: "Open source, experiments, and public work.",
		icon: "code",
	},
	{
		href: "https://wadesplumbingandseptic.com",
		label: "Wade's Plumbing",
		description: "The plumbing company I grew to $2.4M in revenue.",
		icon: "globe",
	},
];
