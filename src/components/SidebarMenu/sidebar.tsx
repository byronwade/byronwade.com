"use client";

import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import graphQLClient from "../../lib/graphql-client";
import { GET_MENU_ITEMS } from "./GET_MENU_ITEMS";

export default function Navbar() {
	const [menuItems, setMenuItems] = useState([]);

	useEffect(() => {
		graphQLClient
			.request(GET_MENU_ITEMS)
			.then((data) => {
				setMenuItems(data.menu.menuItems.nodes);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const menuItemsSorted = menuItems.sort((a, b) => a.order - b.order);
	console.log(menuItemsSorted);

	let pathname = usePathname();
	const secondSlashIndex = pathname.indexOf("/", 1); // Finds the index of the second slash
	const pathnameAutomated =
		secondSlashIndex === -1
			? pathname
			: pathname.substring(0, secondSlashIndex); // If there's no second slash, use the whole pathname, otherwise extract the substring as before

	return (
		<aside className="md:w-[150px] md:flex-shrink-0 -mx-4 md:mx-0 md:px-0">
			<div className="lg:sticky lg:top-20">
				<div className="ml-2 md:ml-[12px] mb-2 px-4 md:px-0 md:mb-8 space-y-10 flex flex-col md:flex-row items-start ">
					<Link aria-label="Byron Wade" href="/">
						<Image
							width="60"
							height="60"
							src="/logo.png"
							alt="Byron Wade's Personal Logo"
						/>
					</Link>
				</div>
				<nav
					className="flex flex-row md:flex-col items-start relative overflow-scroll px-4 md:px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
					id="nav"
				>
					<div className="flex flex-row md:flex-col space-x-0 pr-10 mb-2 mt-2 md:mt-0">
						<Suspense fallback={<SidebarSkeleton />}>
							{menuItems.map((item) => (
								<Link
									key={item.path}
									href={item.path}
									className={clsx(
										"transition-all hover:text-neutral-800 dark:hover:text-neutral-200 py-[5px] px-[10px]",
										{
											"text-neutral-500":
												item.path === pathnameAutomated
													? false
													: true,
											"font-bold":
												item.path === pathnameAutomated
													? true
													: false,
										}
									)}
								>
									{item.label}
								</Link>
							))}
						</Suspense>
					</div>
				</nav>
			</div>
		</aside>
	);
}

function SidebarSkeleton() {
	return (
		<div role="status" className="max-w-sm animate-pulse">
			<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
			<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
			<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
			<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
			<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
			<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
			<span className="sr-only">Loading...</span>
		</div>
	);
}
