function todayFilter(selectedDateType) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const currentPreparedDate = {
    currentYear, currentMonth, currentDay,
  };

  const days = [currentPreparedDate];
  const month = null;
  const year = null;
  const preparedFilter = {
    selectedDateType, days, month, year, timeItem: 'hour',
  };

  return preparedFilter;
}

export default todayFilter;
