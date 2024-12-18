function thisYearFilter(selectedDateType) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const days = null;
  const month = null;
  const year = currentYear;
  const preparedFilter = {
    selectedDateType, days, month, year, timeItem: 'month',
  };

  return preparedFilter;
}

export default thisYearFilter;
