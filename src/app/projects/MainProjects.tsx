"use client";
import Link from "next/link";
import { projects } from "./listOfProjects";

export default function MainProjects() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
			{projects?.map((person) => (
				<Link
					href={person.link}
					key={person.id}
					className="hover:scale-105 transform-gpu no-underline relative flex items-center space-x-3 rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
				>
					<div className="flex-shrink-0">
						<img
							className="h-10 w-10 rounded-full"
							src={person.imageUrl}
							alt=""
						/>
					</div>
					<div className="min-w-0 flex-1">
						<span className="text-sm font-medium text-white block no-underline">
							{person.name}
						</span>
						<span className="truncate text-sm text-gray-500 block no-underline">
							{person.description}
						</span>
					</div>
				</Link>
			))}
		</div>
	);
}
