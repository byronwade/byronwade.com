import { HomeBlog, HomeHero, HomeProjects } from "@/components/home";
import { SiteShell } from "@/components/layout/site-shell";

export default function HomePage() {
	return (
		<SiteShell profile="showcase">
			<HomeHero />
			<HomeProjects />
			<HomeBlog />
		</SiteShell>
	);
}
