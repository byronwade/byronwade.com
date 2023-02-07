import AnalyticsWrapper from "../components/analytics";
import Sidebar from "../components/sidebar";
import "./global.css";
import globalMetadata from "./metadata";

export const metadata = globalMetadata;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang='en'
			className='h-full text-black bg-white dark:text-white dark:bg-[#111010]'>
			<head />
			<body className='h-full antialiased max-w-4xl mb-40 flex flex-col md:flex-row mx-4 mt-8 md:mt-20 lg:mt-32 lg:mx-auto'>
				<Sidebar />
				<main className='flex-auto min-w-0 mt-6 md:mt-0 flex flex-col px-2 md:px-0'>
					{children}
					<AnalyticsWrapper />
				</main>
			</body>
		</html>
	);
}
