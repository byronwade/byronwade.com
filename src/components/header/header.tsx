"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu } from "react-feather";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export function Header() {
	const { setTheme } = useTheme();

	return (
		<div className="p-4 flex justify-between">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon">
						<Menu className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<div className="py-4 space-y-4">
						<div className="flex flex-row px-4">
							<Avatar>
								<AvatarImage src="/avatar.avif" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col ml-2">
								<h1>Byron Wade</h1>
								<p className="text-sm">Solo Entrepreneur</p>
							</div>
						</div>
						<DropdownMenuSeparator />
						<div className="flex flex-col px-4 space-y-2">
							<Link href="/">Home</Link>
							<Link href="/bits">Bits</Link>
							<Link href="/projects">Projects</Link>
							<Link href="/themes">Themes</Link>
						</div>
						<DropdownMenuSeparator />
						<div className="flex flex-col px-4 space-y-2">
							<Link href="/">Twitter</Link>
							<Link href="/">Instagram</Link>
							<Link href="/">Product Hunt</Link>
							<Link href="/">Buy Me Coffee</Link>
						</div>
						<DropdownMenuSeparator />
						<div className="flex flex-col px-4 space-y-2">
							<Link href="/signup">Signup</Link>
							<Link href="/login">Login</Link>
						</div>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
			<div className="space-x-2 flex flex-row">
				<Button variant="outline">Signup</Button>
				<Button>Login</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary" size="icon">
							<SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
							<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
							<span className="sr-only">Toggle theme</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
