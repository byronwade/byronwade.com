import { ViewsIcon } from "src/components/icons";
import { getAllViews } from "../lib/queries/getAllViews";

export default async function TotalViews() {
	const allViews = getAllViews();
	const [views] = await Promise.all([allViews]);

	return (
		<>
			<p className="flex items-center">
				<ViewsIcon />
				{`${views} blog views all time`}
			</p>
		</>
	);
}
