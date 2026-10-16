import { HomeBlog, HomeHero, HomeProjects } from "@/components/home";
import { SiteShell } from "@/components/layout/site-shell";

export default function HomePage() {
	return (
		<SiteShell width="wide">
			<div className="flex flex-col gap-14 sm:gap-16">
				<HomeHero />
				<HomeProjects />
				<HomeBlog />
			</div>
		</SiteShell>
	);
}
