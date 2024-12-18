import addZeroToDate from '../../addZeroToDate';
import getProfitSum from '../../purchases/getProfitSum';

function prepareThisDayDataForChart(items, dateFilter, type) {
  console.log('prepareThisDayDataForChart');
  const preparedChartData = [];

  for (let i = 0; i <= 23; i++) {
    const itemsFromThisHour = items.filter((item) => item.preparedDate.hour === i);

    const hour = i;
    let value = 0;

    if (type === 'Total profit') {
      value = getProfitSum(itemsFromThisHour);
    }

    if (type === 'Total purchases') {
      value = itemsFromThisHour.length;
    }

    const tpDate = `${addZeroToDate(dateFilter.days[0].currentDay)}.${addZeroToDate(dateFilter.days[0].currentMonth)}.${dateFilter.days[0].currentYear}, ${hour}:00`;

    const objWithData = { hour: `${hour}:00`, value, tpDate };

    preparedChartData.push(objWithData);
  }

  console.log(preparedChartData, 'preparedChartData');

  return preparedChartData;
}

export default prepareThisDayDataForChart;
