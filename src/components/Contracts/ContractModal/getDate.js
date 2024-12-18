export const getDate = () => {
    const date = new Date();
	const day = date.getUTCDate().toString().padStart(2, '0');
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	const monthIndex = date.getUTCMonth();
	const month = months[monthIndex];
	const year = date.getUTCFullYear().toString();
	return `${day} ${month} ${year}`;
}