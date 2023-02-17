export function formatDate(date) {
	const formattedDate = new Date(date);
	const options = {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	} as Intl.DateTimeFormatOptions;
	return formattedDate.toLocaleDateString("en-US", options);
}
