import { useRouter } from 'next/router';

import { Box, Flex, Icon, Text, useToast } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import sortByDate from 'src/functions/utils/sort/sortByDate';
import { setFilteredData } from 'store/income/income-slice';

import CustomSelect from '@/components/CustomInputs/CustomSelect';

import CalendarIcon from '@/assets/icons/base/calendar.svg';

import DistributeBalance from './DistirbuteBalance';
import MajorLablBalance from './MajorLablBalance';

const IncomeHeader = ({
	dateOptions,
	sortOptions,
	dateType,
	sortType,
	setDateType,
	setSortType,
	currentIncomeList,
	setCurrentIncomeList,
}) => {
	const { pathname } = useRouter();
	const { incomes } = useSelector(state => state.income);
	const dispatch = useDispatch();

	const sortTransactions = useCallback(
		(preparedSortType, incomesList) => {
			if (preparedSortType === 'Date') {
				const sortedDealsByType = sortByDate(incomesList);
				dispatch(setFilteredData([...sortedDealsByType]));
				setCurrentIncomeList([...sortedDealsByType]);
			} else if (preparedSortType === 'Gross') {
				const sortedDealsByType = [...incomesList].sort((a, b) => b.gross - a.gross);
				dispatch(setFilteredData([...sortedDealsByType]));
				setCurrentIncomeList([...sortedDealsByType]);
			} else if (preparedSortType === 'Reverse') {
				const sortedDealsReversed = [...incomesList].reverse();
				dispatch(setFilteredData([...sortedDealsReversed]));
				setCurrentIncomeList([...sortedDealsReversed]);
			}
		},
		[dispatch, setCurrentIncomeList],
	);

	const handleFilterByPeriod = useCallback(
		selectedDateType => {
			setDateType(selectedDateType);
			const currentDate = new Date();
			const currentYear = currentDate.getFullYear();
			const currentMonth = currentDate.getMonth();
			const currentDay = currentDate.getDate();
			const currentWeekStart = new Date(currentYear, currentMonth, currentDay - currentDate.getDay());
			const currentWeekEnd = new Date(
				currentYear,
				currentMonth,
				currentDay + (6 - currentDate.getDay()),
			);
			let filteredIncomes = [];
			if (selectedDateType === 'All time') {
				filteredIncomes = incomes;
			} else if (selectedDateType === 'This year') {
				filteredIncomes = incomes.filter(el => {
					const incomeDate = new Date(el.createdAt);
					return incomeDate.getFullYear() === currentYear;
				});
			} else if (selectedDateType === 'This month') {
				filteredIncomes = incomes.filter(el => {
					const incomeDate = new Date(el.createdAt);
					return incomeDate.getFullYear() === currentYear && incomeDate.getMonth() === currentMonth;
				});
			} else if (selectedDateType === 'This week') {
				filteredIncomes = incomes.filter(el => {
					const incomeDate = new Date(el.createdAt);
					return incomeDate >= currentWeekStart && incomeDate <= currentWeekEnd;
				});
			} else if (selectedDateType === 'Today') {
				filteredIncomes = incomes.filter(el => {
					const incomeDate = new Date(el.createdAt);
					return (
						incomeDate.getFullYear() === currentYear &&
						incomeDate.getMonth() === currentMonth &&
						incomeDate.getDate() === currentDay
					);
				});
			}
			sortTransactions(sortType, filteredIncomes);
		},
		[setDateType, incomes, sortTransactions, sortType],
	);

	const handleSort = selectedSortType => {
		if (selectedSortType === sortType) {
			sortTransactions('Reverse', currentIncomeList);
			return;
		}
		setSortType(selectedSortType);
		sortTransactions(selectedSortType, currentIncomeList);
	};

	useEffect(() => {
		handleFilterByPeriod('This month');
	}, [handleFilterByPeriod]);

	const isMyIncomePage = pathname === '/my-income';
	return (
		<Box mb='16px'>
			{incomes?.length > 0 && (
				<Flex justifyContent='space-between'>
					<Flex gap='24px'>
						<Box pos='relative' w='100%' maxW='420px'>
							<Icon
								as={CalendarIcon}
								color='stroke'
								boxSize='24px'
								pos='absolute'
								top='50%'
								left='12px'
								transform='translateY(-50%)'
								zIndex={2}
							/>
							<CustomSelect
								name='dateType'
								onChange={e => handleFilterByPeriod(e.value)}
								value={dateType}
								options={dateOptions}
								plValueContainer='48px'
								isSearchable={false}
								w='100%'
								minW='200px'
							/>
						</Box>
						<Flex align='center'>
							<Text fontSize='16px' fontWeight='400' color='secondary' whiteSpace='nowrap'>
								Sort by:
							</Text>
							<CustomSelect
								name='sortType'
								onChange={e => handleSort(e.value)}
								value={sortType}
								bgColor={'none'}
								borderSelect={'none'}
								phColor={'secondary'}
								isInput={false}
								options={sortOptions}
								pxDropdownIcon={'12px'}
								isSearchable={false}
								w='110px'
							/>
						</Flex>
					</Flex>

					{isMyIncomePage && <MajorLablBalance />}
				</Flex>
			)}

			{isMyIncomePage && <DistributeBalance />}
		</Box>
	);
};

export default IncomeHeader;
