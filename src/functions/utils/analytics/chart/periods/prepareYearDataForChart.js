import getProfitSum from '../../purchases/getProfitSum';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function prepareYearDataForChart(items, dateFilter, type) {
  console.log('prepareYearDataForChart:', items, dateFilter, type);
  const preparedChartData = [];

  for (let i = 1; i <= 12; i++) {
    const itemsFromThisDay = items.filter((item) => item.preparedDate.month === i);

    const month = months[i - 1];
    let value;

    if (type === 'Total profit') {
      value = getProfitSum(itemsFromThisDay);
    }

    if (type === 'Total purchases') {
      value = itemsFromThisDay.length;
    }

    const tpDate = `${month} ${dateFilter.year}`;

    const objWithData = { month, value, tpDate };

    preparedChartData.push(objWithData);
  }

  return preparedChartData;
}

export default prepareYearDataForChart;
