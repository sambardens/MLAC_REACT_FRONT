export const getDaysInCurrentYear = () => {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0;
	return isLeapYear ? 366 : 365;
};
