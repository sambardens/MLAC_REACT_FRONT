import { Flex, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useCallback } from 'react';
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
import getSelectedReleaseFilter from 'src/functions/utils/analytics/getSelectedReleaseFilter';
import {
	updateAllTimeArray,
	updateDaysArray,
	updateDaysInMonthArray,
	updateHoursInDayArray,
	updateMonthInYearArray,
} from 'src/functions/utils/chart/chartFunctions';
import analyticsSelectors from 'store/analytics/analytics-selectors';
import incomeSelectors from 'store/income/income-selectors';

import FullPageLoader from '@/components/Loaders/FullPageLoader';

import CustomTooltip from './CustomTooltip';

const Chart = ({ isLoading }) => {
	const [data, setData] = useState([]);
	const [sortTransactions, setSortTransactions] = useState([]);
	const analytics = useSelector(state => state.analytics);
	const { filters, purchases, chart, analyticsData } = analytics;

	const { dateFilter } = useSelector(analyticsSelectors.getFilters);
	const transactions = useSelector(incomeSelectors.getIncomes);

	useEffect(() => {
		const updateDataBasedOnFilter = dataToUpdate => {
			if (dateFilter.selectedDateType === 'This week') {
				setData(updateDaysArray(dataToUpdate));
			} else if (dateFilter.selectedDateType === 'This month') {
				setData(updateDaysInMonthArray(dataToUpdate));
			} else if (dateFilter.selectedDateType === 'Today') {
				setData(updateHoursInDayArray(dataToUpdate));
			} else if (dateFilter.selectedDateType === 'This year') {
				setData(updateMonthInYearArray(dataToUpdate));
			} else if (dateFilter.selectedDateType === 'All time') {
				setData(updateAllTimeArray(dataToUpdate));
			}
		};

		if (analyticsData?.incomes) {
			updateDataBasedOnFilter(analyticsData?.incomes);
		}
		// else {
		// 	updateDataBasedOnFilter(sortTransactions);
		// }
	}, [
		analyticsData?.incomes,
		dateFilter.selectedDateType,
		sortTransactions,
		sortTransactions.length,
	]);

	// useEffect(() => {
	// 	const handleFilterByPeriod = () => {
	// 		const currentDate = new Date();
	// 		const currentYear = currentDate.getFullYear();
	// 		const currentMonth = currentDate.getMonth();
	// 		const currentDay = currentDate.getDate();

	// 		let filteredIncomes = [];

	// 		if (dateFilter.selectedDateType === 'All time') {
	// 			filteredIncomes = transactions;
	// 		} else if (dateFilter.selectedDateType === 'This year') {
	// 			filteredIncomes = transactions.filter(el => {
	// 				const incomeDate = new Date(el.createdAt);
	// 				return incomeDate.getFullYear() === currentYear;
	// 			});
	// 		} else if (dateFilter.selectedDateType === 'This month') {
	// 			filteredIncomes = transactions.filter(el => {
	// 				const incomeDate = new Date(el.createdAt);

	// 				return incomeDate.getFullYear() === currentYear && incomeDate.getMonth() === currentMonth;
	// 			});
	// 		} else if (dateFilter.selectedDateType === 'This week') {
	// 			const currentWeekStart = new Date(currentYear, currentMonth, currentDay - currentDate.getDay());
	// 			const currentWeekEnd = new Date(
	// 				currentYear,
	// 				currentMonth,
	// 				currentDay + (6 - currentDate.getDay()),
	// 			);
	// 			filteredIncomes = transactions.filter(el => {
	// 				const incomeDate = new Date(el.createdAt);
	// 				return incomeDate >= currentWeekStart && incomeDate <= currentWeekEnd;
	// 			});
	// 		} else if (dateFilter.selectedDateType === 'Today') {
	// 			filteredIncomes = transactions.filter(el => {
	// 				const incomeDate = new Date(el.createdAt);
	// 				return (
	// 					incomeDate.getFullYear() === currentYear &&
	// 					incomeDate.getMonth() === currentMonth &&
	// 					incomeDate.getDate() === currentDay
	// 				);
	// 			});
	// 		}
	// 		console.log('filteredIncomes: ', filteredIncomes);
	// 		setSortTransactions(filteredIncomes);
	// 	};

	// 	if (transactions.length) {
	// 		handleFilterByPeriod();
	// 	}
	// }, [dateFilter.selectedDateType, transactions]);

	return (
		<Flex
			position={'relative'}
			flexDir={'column'}
			p={'24px 24px 24px 0px'}
			borderRadius={'10px'}
			bg={'bg.main'}
			h='491px'
		>
			{isLoading ? (
				<FullPageLoader position={'absolute'} w='150' h='491px' />
			) : (
				<>
					<Text position={'absolute'} top={'23px'} left={'38px'} color={'#909090'}>
						£
					</Text>
					<Flex justifyContent={'end'} mb='16px'>
						<Text color={'accent'} fontWeight={'600'} fontSize={'18px'}>
							{getSelectedReleaseFilter(filters)}
						</Text>
					</Flex>

					<ResponsiveContainer width='100%' height={400}>
						<AreaChart data={data} margin={{ left: 30 }}>
							<defs>
								<linearGradient id='color' x1='0' y1='0.5' x2='0' y2='1.5'>
									<stop offset='0%' stopColor={'#FF0151'} stopOpacity={1} />
									<stop offset='75%' stopColor={'#FF0151'} stopOpacity={0.08} />
								</linearGradient>
							</defs>

							<Area
								dataKey={analyticsData ? 'price' : 'gross'}
								type='bump'
								stroke={'#FF0151'}
								strokeWidth='2'
								fill='url(#color)'
							/>
							<XAxis dataKey={'name'} axisLine={true} stroke='#909090' tickLine={false} dy={7} />

							<YAxis
								datakey='Gross'
								axisLine={true}
								tickLine={false}
								tickCount={9}
								dx={-30}
								stroke='#909090'
								// domain={getDomain()}
								// tickFormatter={value => getValueForYAxis(value)}
							/>

							<Tooltip content={<CustomTooltip analyticsData={analyticsData} />} />
							<CartesianGrid opacity={0.1} vertical={false} stroke='#909090' strokeWidth={2} />
						</AreaChart>
					</ResponsiveContainer>

					{!analyticsData?.incomes?.length && !sortTransactions?.length && (
						<Text
							position={'absolute'}
							top='45%'
							right='45%'
							transform='translate(50%, -50%)'
							fontWeight={'600'}
						>
							No data for selected filters
						</Text>
					)}
				</>
			)}
		</Flex>
	);
};

export default Chart;
