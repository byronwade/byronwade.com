//Nav
import Link from "next/link";
import { useRouter } from "next/router";

export default function Nav(props) {
	const router = useRouter();
	console.log(props)
	return (
		<div className={props.className + " navSidebar"}>
			<a href="#" className="p-4 group block flex-shrink-0">
				<div className="flex items-center">
					<div>
						<img className="inline-block h-14 w-14 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
					</div>
					<div className="ml-3">
						<div>Byron Wade</div>
					</div>
				</div>
			</a>
			<div className="menuItems">
				<Link href='/' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Home</Link>
				<Link href='/projects' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Projects</Link>
				<Link href='/ideas' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Ideas</Link>
				<Link href='/playground' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Playground</Link>
				<Link href='/companies' className={router.pathname == "/" ? "navSidebarItems" : "navSidebarItems"}>Companies</Link>
			</div>
		</div>
	);
}





