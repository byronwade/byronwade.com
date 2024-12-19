import { getAnalyticsData, getTechnicalData, getClientData, getInvestmentData, calculateImprovement } from "../utils";
import AnalysisContent from "../components/analysis-content";

export default async function PerformanceCaseStudy() {
	// Fetch all data in parallel
	const [analyticsData, technicalData, clientData, investmentData] = await Promise.all([getAnalyticsData(), getTechnicalData(), getClientData(), getInvestmentData()]);

	const { benchmarks, performanceData, conversionData } = analyticsData;
	const seo = `${calculateImprovement(benchmarks.seoScore.industry, benchmarks.seoScore.optimized)} increase in SEO score`;

	const seoMetrics = {
		keyOptimizations: [{ title: "Strategic optimization of meta titles and descriptions", improvement: "25% CTR" }, { title: "Implementation of semantic HTML structure", improvement: "40% clarity" }, { title: "Enhancement of internal linking architecture" }, { title: "Mobile responsiveness optimization" }, { title: "Implementation of schema markup for rich snippets" }, { title: "URL structure refinement for maximum SEO impact" }],
	};

	// Transform the data
	const transformedPerformanceData = performanceData
		.map((point) => ({
			date: point.month,
			value: point.optimized,
			category: "Optimized",
		}))
		.concat(
			performanceData.map((point) => ({
				date: point.month,
				value: point.industry,
				category: "Industry",
			}))
		);

	const transformedConversionData = conversionData
		.map((point) => ({
			date: point.category,
			value: point.optimized,
			type: "Optimized",
		}))
		.concat(
			conversionData.map((point) => ({
				date: point.category,
				value: point.industry,
				type: "Industry",
			}))
		);

	return <AnalysisContent analyticsData={analyticsData} technicalData={technicalData} clientData={clientData} investmentData={investmentData} seo={seo} seoMetrics={seoMetrics} transformedPerformanceData={transformedPerformanceData} transformedConversionData={transformedConversionData} />;
}
