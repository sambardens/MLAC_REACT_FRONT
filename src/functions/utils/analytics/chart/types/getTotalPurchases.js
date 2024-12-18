import prepareAllTimeDataForChart from '../periods/prepareAllTimeDataForChart';
import prepareMonthDataForChart from '../periods/prepareMonthDataForChart';
import prepareThisDayDataForChart from '../periods/prepareThisDayDataForChart';
import prepareWeekDataForChart from '../periods/prepareWeekDataForChart';
import prepareYearDataForChart from '../periods/prepareYearDataForChart';

function getTotalPurchases(purchases, selectedDateType) {
	if (selectedDateType === 'Today') {
		const chartData = prepareThisDayDataForChart(purchases, selectedDateType, 'Total purchases');

		return chartData;
	}

	if (selectedDateType === 'This week') {
		const chartData = prepareWeekDataForChart(purchases, selectedDateType, 'Total purchases');

		return chartData;
	}
	if (selectedDateType === 'This month') {
		const chartData = prepareMonthDataForChart(purchases, selectedDateType, 'Total purchases');

		return chartData;
	}

	if (selectedDateType === 'This year') {
		const chartData = prepareYearDataForChart(purchases, selectedDateType, 'Total purchases');

		return chartData;
	}

	if (selectedDateType === 'All time') {
		const chartData = prepareAllTimeDataForChart(purchases, selectedDateType, 'Total purchases');

		return chartData;
	}
}

export default getTotalPurchases;
