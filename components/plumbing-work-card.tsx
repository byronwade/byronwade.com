import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export interface PlumbingProject {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	category: "Plumbing" | "Septic";
	date: string;
	type: "plumbing_septic";
}

export const PlumbingWorkCard = ({ project }: { project: PlumbingProject }) => {
	return (
		<Card className="h-full flex flex-col overflow-hidden border-2">
			<CardHeader>
				<CardTitle className="flex items-center text-xl font-bold">
					<Wrench className="mr-2 h-5 w-5" />
					{project.title}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow">
				<div className="aspect-video relative mb-4">
					<Image src={project.imageUrl} alt={project.title} fill className="rounded-md object-cover" />
				</div>
				<p className="text-muted-foreground mb-4 text-sm">{project.description}</p>
				<span className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">{project.category}</span>
			</CardContent>
			<CardFooter className="flex justify-end items-center bg-muted/50 py-3 px-4 text-sm">
				<span className="text-muted-foreground">{new Date(project.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</span>
			</CardFooter>
		</Card>
	);
};
