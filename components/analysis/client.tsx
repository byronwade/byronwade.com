import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";

interface ClientProps {
	clientData?: {
		name: string;
		industry: string;
		duration: string;
		completionDate: string;
		goals: string[];
	};
}

export default function Client({ clientData }: ClientProps) {
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
							<p className="text-sm text-muted-foreground">{clientData?.name}</p>
							<p className="text-sm text-muted-foreground">{clientData?.industry}</p>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold">Timeline</h3>
							<p className="text-sm text-muted-foreground">Project Duration: {clientData?.duration}</p>
							<p className="text-sm text-muted-foreground">Completed: {clientData?.completionDate}</p>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold">Goals</h3>
							<ul className="text-sm text-muted-foreground space-y-1">
								{clientData?.goals.map((goal, index) => (
									<li key={index}>{goal}</li>
								))}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
