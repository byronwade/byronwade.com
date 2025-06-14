import { FigmaFile } from "@/types/figma";
import Image from "next/image";
import { ClientImage } from "@/components/ui/client-image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Figma, Calendar, Eye, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FigmaCardProps {
	file: FigmaFile;
}

export function FigmaCard({ file }: FigmaCardProps) {
	const thumbnailUrl = file.thumbnail_url;
	const formattedDate = new Date(file.last_modified).getFullYear();

	const handleCardClick = () => {
		window.location.href = `/portfolio/figma/${file.key}`;
	};

	return (
		<div className="group">
			<Card className="overflow-hidden border-0 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 hover:-translate-y-1 relative cursor-pointer" onClick={handleCardClick}>
				{/* Gradient Border Effect */}
				<div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>

				{/* Image Container */}
				<div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-50">
					<ClientImage
						src={thumbnailUrl}
						alt={file.name}
						fill
						className="object-cover transition-all duration-700 group-hover:scale-110"
						loading="lazy"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						onError={(e) => {
							const img = e.target as HTMLImageElement;
							img.style.display = "none";
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

					{/* Floating Action Icons */}
					<div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
						<div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
							<Figma className="w-4 h-4 text-gray-700" />
						</div>
						<div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
							<ExternalLink className="w-4 h-4 text-gray-700" />
						</div>
					</div>

					{/* Bottom Overlay */}
					<div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-0 font-medium px-3 py-1">
									<Figma className="w-3 h-3 mr-1" />
									Figma
								</Badge>
							</div>
							<div className="flex items-center gap-3 text-white/90">
								<div className="flex items-center gap-1">
									<Users className="w-4 h-4" />
									<span className="text-sm font-medium">Design</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
				<CardContent className="p-8">
					<div className="space-y-6">
						<div className="space-y-3">
							<div className="flex items-start justify-between">
								<h3 className="text-2xl font-bold leading-tight group-hover:text-yellow-600 transition-colors duration-300">{file.name}</h3>
								<div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300">
									<ArrowUpRight className="h-4 w-4 text-black" />
								</div>
							</div>
							<p className="text-gray-600 leading-relaxed line-clamp-2 text-base">Professional design file showcasing user interface design and prototyping excellence</p>
						</div>

						{/* Design System Tags */}
						<div className="flex flex-wrap gap-2">
							<Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition-colors">
								UI Design
							</Badge>
							<Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition-colors">
								Prototyping
							</Badge>
							<Badge variant="outline" className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 text-yellow-700">
								Design System
							</Badge>
						</div>

						{/* Meta Information */}
						<div className="flex items-center justify-between pt-4 border-t border-gray-100">
							<div className="flex items-center gap-4 text-sm text-gray-500">
								<span className="flex items-center gap-1.5">
									<Calendar className="w-3.5 h-3.5" />
									{formattedDate}
								</span>
								<span className="flex items-center gap-1.5">
									<Eye className="w-3.5 h-3.5" />
									Design
								</span>
							</div>
							<button
								onClick={(e) => {
									e.stopPropagation();
									window.open(`https://www.figma.com/file/${file.key}`, "_blank", "noopener,noreferrer");
								}}
								className="flex items-center gap-1.5 text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors duration-300 z-20 relative"
							>
								<Figma className="w-3.5 h-3.5" />
								<span>Open File</span>
							</button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
