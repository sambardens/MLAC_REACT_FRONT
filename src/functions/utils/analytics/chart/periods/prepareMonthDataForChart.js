import addZeroToDate from '../../addZeroToDate';
import getProfitSum from '../../purchases/getProfitSum';

const prepareMonthDataForChart = (items, dateFilter, type) => {
	const preparedChartData = [];

	for (let i = 1; i <= dateFilter.numberDaysInMonth; i++) {
		const itemsFromThisDay = items.filter(item => item.preparedDate.day === i);

		const day = i;
		let value;

		if (type === 'Total profit') {
			value = getProfitSum(itemsFromThisDay);
		}

		if (type === 'Total purchases') {
			value = itemsFromThisDay.length;
		}

		const tpDate = `${addZeroToDate(day)}.${addZeroToDate(dateFilter.selectedMonth)}.${
			dateFilter.selectedYear
		}`;

		const dayWithData = { day, value, tpDate };

		preparedChartData.push(dayWithData);
	}

	return preparedChartData;
};

export default prepareMonthDataForChart;
