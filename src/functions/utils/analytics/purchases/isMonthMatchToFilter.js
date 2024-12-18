function isMonthMatchToFilter(purchaseDate, selectedDateByFilter) {
  const { month, year } = purchaseDate;
  const { selectedMonth, selectedYear } = selectedDateByFilter;
  const isMatch = month === selectedMonth && year === selectedYear;

  return isMatch;
}

export default isMonthMatchToFilter;
