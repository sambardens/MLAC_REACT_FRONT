import prepareAllTimeDataForChart from '../periods/prepareAllTimeDataForChart';
import prepareMonthDataForChart from '../periods/prepareMonthDataForChart';
import prepareThisDayDataForChart from '../periods/prepareThisDayDataForChart';
import prepareWeekDataForChart from '../periods/prepareWeekDataForChart';
import prepareYearDataForChart from '../periods/prepareYearDataForChart';

function getTotalProfit(purchases, selectedDateType) {
	console.log('getTotalProfit');
	if (selectedDateType === 'Today') {
		const chartData = prepareThisDayDataForChart(purchases, selectedDateType, 'Total profit');

		return chartData;
	}

	if (selectedDateType === 'This week') {
		const chartData = prepareWeekDataForChart(purchases, selectedDateType, 'Total profit');

		return chartData;
	}

	if (selectedDateType === 'This month') {
		const chartData = prepareMonthDataForChart(purchases, selectedDateType, 'Total profit');

		return chartData;
	}

	if (selectedDateType === 'This year') {
		const chartData = prepareYearDataForChart(purchases, selectedDateType, 'Total profit');

		return chartData;
	}

	if (selectedDateType === 'All time') {
		const chartData = prepareAllTimeDataForChart(purchases, null, 'Total profit');

		return chartData;
	}
}

export default getTotalProfit;
