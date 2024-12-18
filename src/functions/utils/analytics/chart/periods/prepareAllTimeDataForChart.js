import getProfitSum from '../../purchases/getProfitSum';

function prepareYearsArray(years) {
  const uniqueYears = [...new Set(years)].sort();

  if (uniqueYears.length === 1) {
    const initialYear = uniqueYears[0];
    uniqueYears.unshift(initialYear - 1);
    uniqueYears.push(initialYear + 1);
  }

  return uniqueYears;
}

function prepareAllTimeDataForChart(items, daysNumber, type) {
  const years = items.map((item) => item.preparedDate.year);
  const uniqueYears = prepareYearsArray(years);

  const preparedChartData = [];

  uniqueYears.forEach((uYear) => {
    const itemsFromThisYear = items.filter((item) => item.preparedDate.year === uYear);

    const year = uYear;
    let value;

    if (type === 'Total profit') {
      value = getProfitSum(itemsFromThisYear);
    }

    if (type === 'Total purchases') {
      value = itemsFromThisYear.length;
    }

    const objWithData = { year, value, tpDate: year };

    preparedChartData.push(objWithData);
  });

  return preparedChartData;
}

export default prepareAllTimeDataForChart;
