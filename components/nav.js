//Nav
import Link from "next/link";
import { useRouter } from "next/router";
import DarkMode from './darkMode'

export default function Nav() {
	const router = useRouter();
	return (
		<div className="navSidebar">
			<div className="menuItems">
				<DarkMode />
				<Link href='/' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Home</Link>
				<Link href='/projects' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Projects</Link>
				<Link href='/learning' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Learning</Link>
				<Link href='/ideas' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Ideas</Link>
				<Link href='/playground' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Playground</Link>
				<Link href='/companies' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Companies</Link>
				<Link href='/blog' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Blog</Link>
			</div>
		</div>
	);
}





