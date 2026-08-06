export default function Background() {
	return (
		<>
			<div
				className="pointer-events-none fixed inset-0 bg-grid opacity-[0.35]"
				aria-hidden="true"
			/>
			<div
				className="glow-brand pointer-events-none fixed inset-x-0 top-0 h-[36vh] opacity-70"
				aria-hidden="true"
			/>
		</>
	);
}
