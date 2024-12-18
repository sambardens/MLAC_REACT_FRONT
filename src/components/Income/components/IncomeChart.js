import { Box, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { createDaysOfMonthArray } from 'src/functions/utils/income/createDaysOfMonthArray';
import { createHoursOfDay } from 'src/functions/utils/income/createHoursOfDay';
import { createMonthOfYear } from 'src/functions/utils/income/createMonthOfYear';
import incomeSelectors from 'store/income/income-selectors';

import { CustomIncomeTooltip } from './CustomIncomeTooltip';
import { daysOfWeek } from './mock/mockData';

export const IncomeChart = ({ dateType, activeChart, currentIncomeList, data, setData }) => {
	const filteredData = useSelector(incomeSelectors.getFilteredData);

	useEffect(() => {
		if (filteredData) {
			if (dateType === 'This week') {
				setData(updateDaysArray(filteredData));
			}
			if (dateType === 'This month') {
				setData(updateDaysInMonthArray(filteredData));
			}
			if (dateType === 'Today') {
				setData(updateHoursInDayArray(filteredData));
			}
			if (dateType === 'This year') {
				setData(updateMonthInYearArray(filteredData));
			}
			if (dateType === 'All time') {
				setData(updateAllTimeArray(filteredData));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dateType, filteredData]);

	const updateDaysArray = objects => {
		let days = [...daysOfWeek];

		days = days.map(day => ({
			...day,
			gross: 0,
			fees: 0,
			net: 0,
		}));

		for (const obj of objects) {
			const createdAt = new Date(obj.createdAt);
			const dayIndex = createdAt.getDay();

			const dayObj = days[dayIndex];
			dayObj.gross += obj.gross || 0;
			dayObj.fees += obj.fees || 0;
			dayObj.net += obj.net || 0;
		}
		const res = days.map(el => ({
			...el,
			gross: Math.round(el.gross * 100) / 100,
			fees: Math.round(el.fees * 100) / 100,
			net: Math.round(el.net * 100) / 100,
		}));
		return res;
	};

	const updateDaysInMonthArray = data => {
		const secondArray = createDaysOfMonthArray();
		data.forEach(obj => {
			const createdAt = new Date(obj.createdAt);
			const dayOfMonth = createdAt.getDate();
			secondArray[dayOfMonth - 1].gross += obj.gross;
			secondArray[dayOfMonth - 1].fees += obj.fees;
			secondArray[dayOfMonth - 1].net += obj.net;
		});
		const res = secondArray.map(el => ({
			...el,
			gross: Math.round(el.gross * 100) / 100,
			fees: Math.round(el.fees * 100) / 100,
			net: Math.round(el.net * 100) / 100,
		}));
		return res;
	};

	const updateHoursInDayArray = data => {
		const secondArray = createHoursOfDay();

		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			const createdAt = new Date(item.createdAt);
			const hourWithoutMinutes = createdAt.getHours();

			const correspondingObject = secondArray.find(item => item.name === hourWithoutMinutes);
			if (correspondingObject) {
				correspondingObject.gross += item.gross || 0;
				correspondingObject.fees += item.fees || 0;
				correspondingObject.net += item.net || 0;
			}
		}

		return secondArray;
	};

	const updateMonthInYearArray = data => {
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
			}
		});

		const res = mergedArray.map(el => ({
			...el,
			gross: Math.round(el.gross * 100) / 100,
			fees: Math.round(el.fees * 100) / 100,
			net: Math.round(el.net * 100) / 100,
		}));
		return res;
	};

	const updateAllTimeArray = data => {
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
			} else {
				existingObject = {
					name: year.toString(),
					year,
					gross: item.gross || 0,
					fees: item.fees || 0,
					net: item.net || 0,
				};
				allTimeArray.push(existingObject);
			}
		}

		const previousYear3Object = {
			name: (minYear - 3).toString(),
			year: minYear - 3,
			gross: 0,
			fees: 0,
			net: 0,
		};
		allTimeArray.unshift(previousYear3Object);

		const previousYear2Object = {
			name: (minYear - 2).toString(),
			year: minYear - 2,
			gross: 0,
			fees: 0,
			net: 0,
		};
		allTimeArray.unshift(previousYear2Object);

		const previousYear1Object = {
			name: (minYear - 1).toString(),
			year: minYear - 1,
			gross: 0,
			fees: 0,
			net: 0,
		};
		allTimeArray.unshift(previousYear1Object);

		const nextYearObject = {
			name: (maxYear + 1).toString(),
			year: maxYear + 1,
			gross: 0,
			fees: 0,
			net: 0,
		};
		allTimeArray.push(nextYearObject);

		const res = allTimeArray.map(el => ({
			...el,
			gross: Math.round(el.gross * 100) / 100,
			fees: Math.round(el.fees * 100) / 100,
			net: Math.round(el.net * 100) / 100,
		}));
		return res;
	};

	return (
		<Box
			borderRadius={'10px'}
			w={'100%'}
			p={'65px 20px 20px 0px'}
			bg={'bg.main'}
			mb={'16px'}
			h={'500px'}
			position={'relative'}
		>
			{currentIncomeList?.length !== 0 && (
				<>
					<Text position={'absolute'} top={'23px'} left={'38px'} color={'textColor.secondary'}>
						£
					</Text>
					<ResponsiveContainer width='100%' height={400}>
						<AreaChart data={data} margin={{ left: 30 }}>
							<defs>
								<linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='0%'
										stopColor={
											activeChart === 'Gross'
												? '#FF0151'
												: activeChart === 'Fees'
												? '#2F84F3'
												: activeChart === 'Net'
												? '#1ED760'
												: null
										}
										stopOpacity={1}
									/>
									<stop
										offset='75%'
										stopColor={
											activeChart === 'Gross'
												? '#FF0151'
												: activeChart === 'Fees'
												? '#2F84F3'
												: activeChart === 'Net'
												? '#1ED760'
												: null
										}
										stopOpacity={0.08}
									/>
								</linearGradient>
							</defs>

							<Area
								dataKey={
									activeChart === 'Gross'
										? 'gross'
										: activeChart === 'Fees'
										? 'fees'
										: activeChart === 'Net'
										? 'net'
										: null
								}
								type='monotone'
								stroke={
									activeChart === 'Gross'
										? '#FF0151'
										: activeChart === 'Fees'
										? '#2F84F3'
										: activeChart === 'Net'
										? '#1ED760'
										: null
								}
								strokeWidth='2'
								fill='url(#color)'
							/>
							<XAxis dataKey='name' axisLine={true} stroke='#909090' tickLine={false} dy={11} />

							<YAxis
								datakey={
									activeChart === 'Gross'
										? 'gross'
										: activeChart === 'Fees'
										? 'fees'
										: activeChart === 'Net'
										? 'net'
										: null
								}
								axisLine={true}
								tickLine={false}
								tickCount={9}
								dx={-30}
								stroke='#909090'
							/>

							<Tooltip content={<CustomIncomeTooltip activeChart={activeChart} />} />
							<CartesianGrid opacity={0.1} vertical={false} stroke='#909090' strokeWidth={2} />
						</AreaChart>
					</ResponsiveContainer>
				</>
			)}
		</Box>
	);
};
