export const countPastWeekdays = () => {
	const today = new Date();
	const currentDay = today.getDay();
	const pastWeekdays = currentDay === 0 ? 6 : currentDay - 1;

	return pastWeekdays + 1; //
};


