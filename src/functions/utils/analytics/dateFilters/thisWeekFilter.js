function thisWeekFilter(selectedDateType) {
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek + 1);

  const datesOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const dateString = new Date(startOfWeek);
    dateString.setDate(startOfWeek.getDate() + i);
    const datePreparedString = dateString.toLocaleDateString();
    const weekday = dateString.toLocaleString('Eng', { weekday: 'short' });

    const dateData = datePreparedString.split('.');
    const currentYear = Number(dateData[2]);
    const currentMonth = Number(dateData[1]);
    const currentDay = Number(dateData[0]);
    const preparedDayObj = {
      currentYear, currentMonth, currentDay, weekday,
    };

    datesOfWeek.push(preparedDayObj);
  }

  const days = datesOfWeek;
  const month = null;
  const year = null;
  const preparedFilter = {
    selectedDateType, days, month, year, timeItem: 'day',
  };

  return preparedFilter;
}

export default thisWeekFilter;
