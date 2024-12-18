function addOneYearToDate(dateString) {
	// Разбиваем строку на компоненты (день, месяц и год)
	const parts = dateString.split('-');
	const newYear = Number(parts[2]) + 1;

	// Формируем новую дату с увеличенным годом
	const newDate = `${parts[0]}-${parts[1]}-${newYear}`;

	return newDate;
}

export default addOneYearToDate;
