import { HomeBlog, HomeCta, HomeInteractive, HomeProjects } from "@/components/home";
import { SiteShell } from "@/components/layout/site-shell";

export default function HomePage() {
	return (
		<SiteShell>
			<div className="flex flex-col gap-16 sm:gap-20">
				<HomeInteractive />
				<HomeProjects />
				<HomeBlog />
				<HomeCta />
			</div>
		</SiteShell>
	);
}
