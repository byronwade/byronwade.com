import Link from "next/link";

export default function Analysis() {
	return (
		<div>
			<Link prefetch={true} href="/analysis/impactmarinegroup">
				Impact Maring Group
			</Link>
		</div>
	);
}
