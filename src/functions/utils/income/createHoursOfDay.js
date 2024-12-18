export const createHoursOfDay = () => {
	const currentDate = new Date();
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const currentDay = daysOfWeek[currentDate.getDay()];

	const arrayOfObjects = [];

	for (let i = 1; i <= 24; i++) {
		const obj = {
			name: i,
			currentDay: currentDay,
			gross: 0,
			fees: 0,
			net: 0,
			tips: 0,
			price: 0,
		};

		arrayOfObjects.push(obj);
	}

	return arrayOfObjects;
};
