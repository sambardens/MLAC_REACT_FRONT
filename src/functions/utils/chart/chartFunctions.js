import { daysOfWeek } from '@/components/Income/components/mock/mockData';

import { createDaysOfMonthArray } from '../income/createDaysOfMonthArray';
import { createHoursOfDay } from '../income/createHoursOfDay';
import { createMonthOfYear } from '../income/createMonthOfYear';

export const updateDaysArray = objects => {
	let days = [...daysOfWeek];

	days = days.map(day => ({
		...day,
		gross: 0,
		fees: 0,
		net: 0,
		tips: 0,
		price: 0,
	}));

	for (const obj of objects) {
		const createdAt = new Date(obj.createdAt);
		const dayIndex = createdAt.getDay() - 1;

		const dayObj = days[dayIndex];
		dayObj.gross += obj.gross || 0;
		dayObj.fees += obj.fees || 0;
		dayObj.net += obj.net || 0;
		dayObj.tips += obj.tips || 0;
		dayObj.price += Number(obj.price) || 0;
	}

	// console.log(days, 'days');

	return days;
};

export const updateDaysInMonthArray = data => {
	const secondArray = createDaysOfMonthArray();
	data.forEach(obj => {
		const createdAt = new Date(obj.createdAt);
		const dayOfMonth = createdAt.getDate();
		secondArray[dayOfMonth - 1].gross += obj.gross;
		secondArray[dayOfMonth - 1].fees += obj.fees;
		secondArray[dayOfMonth - 1].net += obj.net;
		secondArray[dayOfMonth - 1].tips += obj.tips;
		secondArray[dayOfMonth - 1].price += Number(obj.price);
	});

	return secondArray;
};

export const updateHoursInDayArray = data => {
	const secondArray = createHoursOfDay();

	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		const parts = item.createdAt.split('T')[1].split(':');
		const hourWithoutMinutes = parseInt(parts[0]);

		const correspondingObject = secondArray.find(item => item.name === hourWithoutMinutes);
		if (correspondingObject) {
			correspondingObject.gross += item.gross || 0;
			correspondingObject.fees += item.fees || 0;
			correspondingObject.net += item.net || 0;
			correspondingObject.tips += item.tips || 0;
			correspondingObject.price += Number(item.price) || 0;
		}
	}

	return secondArray;
};

export const updateMonthInYearArray = data => {
	const secondArray = createMonthOfYear();
	const mergedArray = secondArray.map(month => ({ ...month }));

	data.forEach(item => {
		const createdAt = new Date(item.createdAt);
		const month = createdAt.toLocaleString('en-US', { month: 'long' });
		const monthIndex = mergedArray.findIndex(m => m.monthOfYear === month);

		if (monthIndex !== -1) {
			mergedArray[monthIndex].gross += item.gross || 0;
			mergedArray[monthIndex].fees += item.fees || 0;
			mergedArray[monthIndex].net += item.net || 0;
			mergedArray[monthIndex].tips += item.tips || 0;
			mergedArray[monthIndex].price += Number(item.price) || 0;
		}
	});

	return mergedArray;
};

export const updateAllTimeArray = data => {
	const allTimeArray = [];

	let minYear = Infinity;
	let maxYear = -Infinity;

	for (const item of data) {
		const createdAt = new Date(item.createdAt);
		const year = createdAt.getFullYear();
		minYear = Math.min(minYear, year);
		maxYear = Math.max(maxYear, year);

		let existingObject = allTimeArray.find(obj => obj.year === year);
		if (existingObject) {
			existingObject.gross += item.gross || 0;
			existingObject.fees += item.fees || 0;
			existingObject.net += item.net || 0;
			existingObject.tips += item.tips || 0;
			existingObject.price += Number(item.price) || 0;
		} else {
			existingObject = {
				name: year.toString(),
				year,
				gross: item.gross || 0,
				fees: item.fees || 0,
				net: item.net || 0,
				tips: item.tips || 0,
				price: Number(item.price) || 0,
			};
			allTimeArray.push(existingObject);
		}
	}

	const previousYear1Object = {
		name: (minYear - 1).toString(),
		year: minYear - 1,
		gross: 0,
		fees: 0,
		net: 0,
		tips: 0,
		price: 0,
	};
	allTimeArray.unshift(previousYear1Object);

	const previousYear2Object = {
		name: (minYear - 2).toString(),
		year: minYear - 2,
		gross: 0,
		fees: 0,
		net: 0,
		tips: 0,
		price: 0,
	};
	allTimeArray.unshift(previousYear2Object);

	const previousYear3Object = {
		name: (minYear - 3).toString(),
		year: minYear - 3,
		gross: 0,
		fees: 0,
		net: 0,
		tips: 0,
		price: 0,
	};
	allTimeArray.unshift(previousYear3Object);

	const nextYearObject = {
		name: (maxYear + 1).toString(),
		year: maxYear + 1,
		gross: 0,
		fees: 0,
		net: 0,
		tips: 0,
		price: 0,
	};
	allTimeArray.push(nextYearObject);

	return allTimeArray;
};
