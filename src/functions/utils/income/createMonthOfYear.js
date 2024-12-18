export const createMonthOfYear = () => {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const monthAbbreviations = [
		'Jan.',
		'Feb.',
		'Mar.',
		'Apr.',
		'May',
		'June',
		'July',
		'Aug.',
		'Sept.',
		'Oct.',
		'Nov.',
		'Dec.',
	];

	const arrayOfObjects = [];

	for (let i = 0; i < 12; i++) {
		const obj = {
			name: monthAbbreviations[i],
			monthOfYear: months[i],
			gross: 0,
			fees: 0,
			net: 0,
			tips: 0,
			price: 0,
		};

		arrayOfObjects.push(obj);
	}

	return [...arrayOfObjects];
};
