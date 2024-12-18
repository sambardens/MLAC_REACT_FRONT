import { Grid } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import analyticsSelectors from 'store/analytics/analytics-selectors';

import cursorIcon from '@/assets/icons/analytics/cursor.svg';
import downloadsIcon from '@/assets/icons/analytics/download.svg';
import purchasesIcon from '@/assets/icons/analytics/purchases.svg';

import DataCard from './DataCard';

const CardsSection = ({ isLoading }) => {
	const analyticsData = useSelector(analyticsSelectors.getAnalyticsData);
	const googleAnalyticsData = useSelector(analyticsSelectors.getAnalyticsDataFromGoogle);
	const [totalClicks, setTotalClicks] = useState(0);
	const [totalUniqueClicks, setTotalUniqueClicks] = useState(0);
	const [totalDownloads, setTotalDownloads] = useState(0);
	const [totalUniqueDownloads, setTotalUniqueDownloads] = useState(0);
	const [totalProfit, setTotalProfit] = useState(0);

	const totalProfitPurchases = () => {
		const total = analyticsData.incomes.reduce((acc, entry) => {
			const totalNetSum = parseFloat(entry.net || 0);
			const totalTipsSum = parseFloat(entry.tips || 0);
			const totalFeesSum = parseFloat(entry.fees || 0);

			return (acc += totalNetSum + totalTipsSum - totalFeesSum);
		}, 0);

		const totalSum = total.toFixed(2);
		setTotalProfit(totalSum);
	};
	const getTotal = () => {
		const events = googleAnalyticsData.analytics?.filteredEventsDataResponse;
		let clicks = 0;
		let downloads = 0;

		events.forEach(event => {
			event?.dimensionValues?.forEach(el => {
				if (el.value === 'click') {
					event.metricValues.forEach(({ value }) => (clicks += Number(value)));
				} else if (el.value === 'download') {
					event.metricValues.forEach(({ value }) => (downloads += Number(value)));
				}
			});
		});
		setTotalClicks(clicks);
		setTotalDownloads(downloads);
	};

	useEffect(() => {
		if (!isLoading && googleAnalyticsData?.analytics?.filteredEventsDataResponse) {
			getTotal();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [googleAnalyticsData?.analytics?.filteredEventsDataResponse, isLoading]);

	useEffect(() => {
		if (analyticsData?.incomes) {
			totalProfitPurchases();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [analyticsData?.incomes]);
	return (
		<Grid templateColumns='repeat(3, 1fr)' gap={'16px'}>
			<DataCard
				icon={purchasesIcon}
				title='Purchases'
				justifyContent={'space-between'}
				firstMetric='Total purchases'
				firstMetricAmount={analyticsData?.incomes?.length || 0}
				secondMetric='Total profit'
				secondMetricAmount={totalProfit ? `£${totalProfit}` : 0}
				isLoading={isLoading}
			/>
			<DataCard
				icon={cursorIcon}
				title='Click throughs'
				titleColor={'accent'}
				justifyContent={'space-between'}
				firstMetric='Total click throughs'
				firstMetricAmount={totalClicks}
				secondMetric='Unique click throughs'
				secondMetricAmount={googleAnalyticsData.analytics?.uniqueClicks || 0}
				isLoading={isLoading}
			/>
			<DataCard
				icon={downloadsIcon}
				title='Downloads'
				titleColor={'accent'}
				justifyContent={'space-between'}
				firstMetric='Total downloads'
				firstMetricAmount={analyticsData?.analytics?.totalDownloads || 0}
				secondMetric='Total user downloads'
				secondMetricAmount={analyticsData?.analytics?.uniqueUserDownloads || 0}
				isLoading={isLoading}
			/>
		</Grid>
	);
};

export default CardsSection;
