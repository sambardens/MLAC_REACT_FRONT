const isLeapYear = year => {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getDaysInCurrentMonth = () => {
	const today = new Date();
	const currentDayOfMonth = today.getDate();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth();

	let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

	if (currentMonth === 1 && isLeapYear(currentYear)) {
		daysInMonth++;
	}

	const pastDaysInMonth = currentDayOfMonth - 1;

	return pastDaysInMonth + 1;
};
