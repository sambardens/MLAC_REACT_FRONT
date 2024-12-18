import { Box, Flex } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDaysInCurrentYear } from 'src/functions/utils/analytics/getDayInYear';
import { getDaysInCurrentMonth } from 'src/functions/utils/analytics/getDaysInCurrentMonth';
import { countPastWeekdays } from 'src/functions/utils/analytics/getPastWeeksDays';
import getPreparedPurchases from 'src/functions/utils/analytics/purchases/getPreparedPurchases';
import { getAnalytics, getAnalyticsFromGoogle } from 'store/analytics/analitics-operations';
import analyticsSelectors from 'store/analytics/analytics-selectors';
import {
	resetAnalytics,
	resetAnalyticsData,
	setPreparedPurchases,
} from 'store/analytics/analytics-slice';
import { getIncomeByBapId } from 'store/income/income-operations';
import { resetSelectedRelease } from 'store/slice';

import FullPageLoader from '../Loaders/FullPageLoader';

import CardsSection from './components/CardsSection';
import Chart from './components/Chart';
import Header from './components/Header';
import { UserData } from './components/userData/UserData';

const Analytics = () => {
	const [isLoading, setIsLoading] = useState(false);
	const selectedRelease = useSelector(state => state.analytics.filters.releaseFilter?.release);
	const selectedTrack = useSelector(state => state.analytics.filters.releaseFilter?.track);
	const selectedBap = useSelector(state => state.user.selectedBap);
	const { dateFilter } = useSelector(analyticsSelectors.getFilters);
	const type = useSelector(analyticsSelectors.getTypeGoogleAnalytics);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(resetSelectedRelease());
		return () => {
			dispatch(resetAnalyticsData());
			dispatch(resetAnalytics());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// useEffect(() => {
	// 	if (selectedBap?.bapId) {
	// 		dispatch(getIncomeByBapId(selectedBap.bapId));
	// 		dispatch(resetSelectedRelease());
	// 	}
	// }, [dispatch, selectedBap?.bapId]);

	const handleGetAnalitics = async () => {
		const params = { type, bapId: selectedBap?.bapId };
		const options = { bapId: selectedBap?.bapId };
		if (dateFilter.selectedDateType === 'This year') {
			const date = getDaysInCurrentYear();
			options.date = date;
			params.date = date;
		} else if (dateFilter.selectedDateType === 'Today') {
			const date = 0;
			options.date = date;
			params.date = date;
		} else if (dateFilter.selectedDateType === 'This week') {
			const date = countPastWeekdays();
			options.date = date;
			params.date = date;
		} else if (dateFilter.selectedDateType === 'This month') {
			const date = getDaysInCurrentMonth();
			options.date = date;
			params.date = date;
		} else if (dateFilter.selectedDateType === 'All time') {
			const date = 1850;
			options.date = date;
			params.date = date;
		}
		if (selectedTrack?.id) {
			options.trackId = selectedTrack.id;
			options.releaseId = selectedRelease?.id;
		}
		console.log('params: ', params);
		setIsLoading(true);
		await dispatch(getAnalytics(options));
		await dispatch(getAnalyticsFromGoogle(params));
		setIsLoading(false);
	};

	useEffect(() => {
		if (!selectedBap?.bapId) return;
		handleGetAnalitics();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dateFilter.selectedDateType, dispatch, selectedTrack, type, selectedBap?.bapId]);

	// useEffect(() => {
	// 	const preparedPurchases = getPreparedPurchases(incomes);
	// 	dispatch(setPreparedPurchases(preparedPurchases));
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [incomes]);

	return (
		<>
			<Box position={'relative'} h='100%'>
				<Flex flexDir={'column'} gap='16px' minH='100%'>
					<Header />
					<CardsSection isLoading={isLoading} />
					<Chart isLoading={isLoading} />
					<UserData isLoading={isLoading} />
				</Flex>
			</Box>
		</>
	);
};

export default Analytics;
