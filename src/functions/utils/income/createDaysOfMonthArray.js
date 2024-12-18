const getDaysInCurrentMonth = () => {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const nextMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0);
	const daysInMonth = nextMonth.getDate();
	return daysInMonth;
};

export const createDaysOfMonthArray = () => {
	const daysInMonth = getDaysInCurrentMonth();
	const daysOfMonth = [];

	const currentDate = new Date();
	const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });

	for (let i = 1; i <= daysInMonth; i++) {
		const day = {
			name: i,
			currentMonth,
			gross: 0,
			fees: 0,
			net: 0,
			tips: 0,
			price: 0,
		};
		daysOfMonth.push(day);
	}

	return daysOfMonth;
};
