import { DribbbleShot } from "@/types/dribbble";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Palette, Calendar, Heart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ShotCardProps {
	shot: DribbbleShot;
}

export function ShotCard({ shot }: ShotCardProps) {
	const imageUrl = shot.images.four_x || shot.images.hidpi || shot.images.two_x || shot.images.normal || shot.images.teaser;
	const formattedDate = new Date(shot.published_at).getFullYear();

	const handleCardClick = () => {
		window.location.href = `/portfolio/dribbble/${shot.id}`;
	};

	return (
		<div className="group">
			<Card className="overflow-hidden border-0 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 hover:-translate-y-1 relative cursor-pointer" onClick={handleCardClick}>
				{/* Gradient Border Effect */}
				<div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-violet-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>

				{/* Image Container */}
				<div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
					<Image src={imageUrl} alt={shot.title} fill className="object-cover transition-all duration-700 group-hover:scale-110" loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

					{/* Floating Action Icons */}
					<div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
						<div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
							<Palette className="w-4 h-4 text-gray-700" />
						</div>
						<div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
							<ExternalLink className="w-4 h-4 text-gray-700" />
						</div>
					</div>

					{/* Bottom Overlay */}
					<div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 font-medium px-3 py-1">
									<Palette className="w-3 h-3 mr-1" />
									Design
								</Badge>
							</div>
							<div className="flex items-center gap-3 text-white/90">
								<div className="flex items-center gap-1">
									<Heart className="w-4 h-4" />
									<span className="text-sm font-medium">Dribbble</span>
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
								<h3 className="text-2xl font-bold leading-tight group-hover:text-pink-600 transition-colors duration-300">{shot.title}</h3>
								<div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300">
									<ArrowUpRight className="h-4 w-4 text-white" />
								</div>
							</div>
							<p className="text-gray-600 leading-relaxed line-clamp-2 text-base">Creative design showcase featuring modern UI/UX principles and visual storytelling</p>
						</div>

						{/* Tags */}
						{shot.tags && shot.tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{shot.tags.slice(0, 4).map((tag) => (
									<Badge key={tag} variant="outline" className="text-xs px-2 py-1 bg-gray-50 border-gray-200 text-gray-600 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-700 transition-colors">
										{tag}
									</Badge>
								))}
								{shot.tags.length > 4 && (
									<Badge variant="outline" className="text-xs px-2 py-1 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 text-pink-700">
										+{shot.tags.length - 4} more
									</Badge>
								)}
							</div>
						)}

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
									window.open(shot.html_url, "_blank", "noopener,noreferrer");
								}}
								className="flex items-center gap-1.5 text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors duration-300 z-20 relative"
							>
								<ExternalLink className="w-3.5 h-3.5" />
								<span>View Shot</span>
							</button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
