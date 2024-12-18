function isDayMathToFilter(purchaseDay, selectedDayByFilter) {
  const { year, month, day } = purchaseDay;
  const { currentYear, currentMonth, currentDay } = selectedDayByFilter;
  const isAccurate = year === currentYear && month === currentMonth && day === currentDay;

  return isAccurate;
}

export default isDayMathToFilter;
