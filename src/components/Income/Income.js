import { useRouter } from 'next/router';

import { Box } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import { getParticipantsById } from 'store/eveara/eveara-operations';
import { getIncomeByBapId, getIncomeByUserId } from 'store/income/income-operations';
import { setFilteredData } from 'store/income/income-slice';
import { getUserInfo } from 'store/operations';
import { resetSelectedBap, resetSelectedBapUpdated, resetSelectedRelease } from 'store/slice';

import FullPageLoader from '../Loaders/FullPageLoader';

import { IncomeChart } from './components/IncomeChart';
import { IncomeChartHeader } from './components/IncomeChartHeader';
import IncomeHeader from './components/IncomeHeader';
import IncomeList from './components/IncomeList';

const dateOptions = [
	{ id: '1', value: 'Today', label: 'Today' },
	{ id: '2', value: 'This week', label: 'This week' },
	{ id: '3', value: 'This month', label: 'This month' },
	{ id: '4', value: 'This year', label: 'This year' },
	{ id: '5', value: 'All time', label: 'All time' },
];

const sortOptions = [
	{ id: '1', value: 'Date', label: 'Date' },
	{ id: '2', value: 'Gross', label: 'Gross' },
];

const Income = () => {
	const axiosPrivate = useAxiosPrivate();
	const initialDateType = dateOptions[3].value;
	const initialSortType = sortOptions[0].value;
	const { user, isLoading, selectedBap } = useSelector(state => state.user);
	const { incomes, isLoading: isLoadingIncome } = useSelector(state => state.income);
	const [currentIncomeList, setCurrentIncomeList] = useState([]);
	const [dateType, setDateType] = useState(initialDateType);
	const [sortType, setSortType] = useState(initialSortType);
	const [activeChart, setActiveChart] = useState('Gross');
	const { pathname } = useRouter();
	const isContractsAndSplitsPage = pathname.includes('/splits-contracts');
	const isMyIncomePage = pathname.includes('/my-income');
	const isIncomePage = pathname.includes('/income');
	const [data, setData] = useState([]);
	const dispatch = useDispatch();

	useEffect(() => {
		if (incomes?.length > 0) {
			setCurrentIncomeList(incomes);
		} else {
			setCurrentIncomeList([]);
		}
	}, [incomes]);

	useEffect(() => {
		if (isMyIncomePage && user?.id) {
			dispatch(getUserInfo());
			dispatch(getIncomeByUserId(user.id));
		}
	}, [dispatch, isMyIncomePage, user?.id]);

	useEffect(() => {
		if ((isContractsAndSplitsPage || isIncomePage) && selectedBap?.bapId) {
			dispatch(getIncomeByBapId(selectedBap.bapId));
		}
	}, [dispatch, isContractsAndSplitsPage, isIncomePage, selectedBap.bapId]);

	useEffect(() => {
		if (isMyIncomePage && user?.id) {
			dispatch(resetSelectedBap());
			dispatch(resetSelectedBapUpdated());
			dispatch(getParticipantsById({ id: user.id, type: 'userId', axiosPrivate }));
		}
	}, [axiosPrivate, dispatch, isMyIncomePage, user?.id]);

	useEffect(() => {
		dispatch(resetSelectedRelease());
		dispatch(setFilteredData([]));
	}, [dispatch]);

	return (
		<>
			<Box position={'relative'} h='100%'>
				{isLoading || isLoadingIncome ? (
					<FullPageLoader position={'absolute'} />
				) : (
					<Box minH='100%'>
						<IncomeHeader
							dateType={dateType}
							sortType={sortType}
							setDateType={setDateType}
							setSortType={setSortType}
							dateOptions={dateOptions}
							sortOptions={sortOptions}
							setCurrentIncomeList={setCurrentIncomeList}
							currentIncomeList={currentIncomeList}
						/>
						{incomes?.length !== 0 && (
							<>
								<IncomeChartHeader setActiveChart={setActiveChart} activeChart={activeChart} data={data} />
								<IncomeChart
									dateType={dateType}
									activeChart={activeChart}
									currentIncomeList={currentIncomeList}
									data={data}
									setData={setData}
								/>
							</>
						)}
						<IncomeList currentIncomeList={currentIncomeList} />
					</Box>
				)}
			</Box>
		</>
	);
};

export default Income;
