import isDayMathToFilter from '../purchases/isDayMathToFilter';
import isMonthMatchToFilter from '../purchases/isMonthMatchToFilter';

function getFilteredItemsByPeriod(purchases, dateFilter) {
  if (dateFilter?.selectedDateType === 'Today') {
    const filteredPurchases = purchases.filter((p) => {
      return isDayMathToFilter(p.preparedDate, dateFilter.days[0]);
    });

    return filteredPurchases;
  }

  if (dateFilter?.selectedDateType === 'This week') {
    const isInSelectedWeek = (checkedDay) => {
      const isDayMatch = dateFilter.days.some((dayFromFilter) => isDayMathToFilter(checkedDay, dayFromFilter));

      return isDayMatch;
    };

    const filteredPurchases = purchases.filter((p) => {
      const isDayInSelectedWeek = isInSelectedWeek(p.preparedDate);

      return isDayInSelectedWeek;
    });

    return filteredPurchases;
  }

  if (dateFilter.selectedDateType === 'This month') {
    const filteredPurchases = purchases.filter((p) => {
      return isMonthMatchToFilter(p.preparedDate, dateFilter);
    });

    return filteredPurchases;
  }

  if (dateFilter.selectedDateType === 'This year') {
    const filteredPurchases = purchases.filter((p) => {
      return p.preparedDate.year === dateFilter.year;
    });

    return filteredPurchases;
  }

  if (dateFilter.selectedDateType === 'All time') {
    return purchases;
  }

  return [];
}

export default getFilteredItemsByPeriod;
