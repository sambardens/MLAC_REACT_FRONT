const monthNames = [
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

function getTime(date, formattedDate) {
	const now = new Date();
	const differenceMin = Math.round((now - date) / 1000 / 60);

	if (differenceMin < 6) {
		return `${differenceMin} min ago`;
	}

	const hour = date.getUTCHours();
	const minute = date.getUTCMinutes();

	return `${hour}:${minute}, ${formattedDate}`;
}

function getFormattedDate(currentDate, isWithTime = false, isDistibuteMenu = false) {
	if (isDistibuteMenu) {
		return currentDate.slice(0, 10);
	}
	if (currentDate) {
		const date = new Date(currentDate);
		const day = date.getUTCDate().toString().padStart(2, '0');
		const monthNumber = (date.getUTCMonth() + 1).toString().padStart(2, '0');
		const monthName = monthNames[parseInt(monthNumber, 10) - 1];
		const year = date.getUTCFullYear().toString();
		const formattedDate = `${day} ${monthName} ${year}`;

		if (!isWithTime) {
			return formattedDate;
		}

		return getTime(date, formattedDate);
	}
}

export default getFormattedDate;
