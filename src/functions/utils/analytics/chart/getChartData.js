import getTotalProfit from './types/getTotalProfit';
import getTotalPurchases from './types/getTotalPurchases';

function getChartData(analytics) {
	const selectedDateType = analytics.filters.dateFilter.selectedDateType;
	const chart = analytics.chart;
	const filteredPurchases = analytics.purchases.filteredPurchases;

	if (chart.chartType === 'Total profit') {
		const preparedData = getTotalProfit(filteredPurchases, selectedDateType);

		return preparedData;
	}

	if (chart.chartType === 'Total purchases') {
		const preparedData = getTotalPurchases(filteredPurchases, selectedDateType);
		return preparedData;
	}

	return [];
}

export default getChartData;
