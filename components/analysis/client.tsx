import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";

export default function Client() {
	return (
		<section id="client" className="scroll-mt-28">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Client Overview</CardTitle>
					<CardDescription>Impact Marine Group&apos;s digital transformation journey</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid sm:grid-cols-3 gap-6">
						<div className="space-y-2">
							<h3 className="font-semibold">Client</h3>
							<p className="text-sm text-muted-foreground">Impact Marine Group</p>
							<p className="text-sm text-muted-foreground">Marine Industry</p>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold">Timeline</h3>
							<p className="text-sm text-muted-foreground">Project Duration: 8 weeks</p>
							<p className="text-sm text-muted-foreground">Completed: Q4 2023</p>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold">Goals</h3>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>Increase conversions</li>
								<li>Reduce bounce rates</li>
								<li>Improve user experience</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
