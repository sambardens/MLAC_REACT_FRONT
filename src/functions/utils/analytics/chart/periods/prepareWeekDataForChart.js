import addZeroToDate from '../../addZeroToDate';
import getProfitSum from '../../purchases/getProfitSum';

function prepareWeekDataForChart(items, dateFilter, type) {
  const preparedChartData = [];

  const weekDays = dateFilter.days.map((day) => day.currentDay);
  let i = 0;

  weekDays.forEach((dayOfWeekNumber) => {
    const itemsFromThisDay = items.filter((item) => item.preparedDate.day === dayOfWeekNumber);

    const day = dateFilter.days[i].weekday;
    let value;

    if (type === 'Total profit') {
      value = getProfitSum(itemsFromThisDay);
    }

    if (type === 'Total purchases') {
      value = itemsFromThisDay.length;
    }

    const tpDate = `${addZeroToDate(dateFilter.days[i].currentDay)}.${addZeroToDate(dateFilter.days[i].currentMonth)}.${dateFilter.days[i].currentYear}`;
    const dayWithData = { day, value, tpDate };
    preparedChartData.push(dayWithData);
    i++;
  });

  return preparedChartData;
}

export default prepareWeekDataForChart;
