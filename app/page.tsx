import { HomeBlog, HomeHero, HomeProjects } from "@/components/home";
import { SiteShell } from "@/components/layout/site-shell";

export default function HomePage() {
	return (
		<SiteShell width="wide">
			{/* Wide spacing between scenes so the page reads as cuts rather than as a
			    stack of blocks. The sections carry their own hairlines, so the gap is
			    the divider. Adding rules here as well would double them. */}
			<div className="flex flex-col gap-28 sm:gap-40">
				<HomeHero />
				{/* Each section arrives as it is reached. See .scene-enter in globals.css. */}
				<div className="scene-enter">
					<HomeProjects />
				</div>
				<div className="scene-enter">
					<HomeBlog />
				</div>
			</div>
		</SiteShell>
	);
}
