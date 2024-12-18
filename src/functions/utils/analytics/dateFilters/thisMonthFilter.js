function thisMonthFilter(selectedDateType) {
  const currentDate = new Date();
  const selectedYear = currentDate.getFullYear();
  const selectedMonth = currentDate.getMonth();
  const nextMonth = new Date(selectedYear, selectedMonth + 1, 1);
  const lastDayOfMonth = new Date(nextMonth - 1);
  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

  const numberDaysInMonth = lastDayOfMonth.getDate();
  const formattedMonth = selectedMonth + 1;
  const selectedDays = null;
  const preparedFilter = {
    selectedDateType, selectedDays, selectedMonth: formattedMonth, selectedYear, numberDaysInMonth, timeItem: 'day', monthName,
  };

  return preparedFilter;
}

export default thisMonthFilter;
