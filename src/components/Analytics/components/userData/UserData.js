import { Box, Flex, Grid, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import analyticsSelectors from 'store/analytics/analytics-selectors';

import FullPageLoader from '@/components/Loaders/FullPageLoader';

import { ByOsChart } from './components/ByOsChart';
import { CountryChart } from './components/CountryChart';
import { DeviseChart } from './components/DeviseChart';
import { HeaderUserData } from './components/HeaderUserData';
import { ReferrerChart } from './components/ReferrerChart';

export const UserData = ({ isLoading }) => {
	const googleAnalytics = useSelector(analyticsSelectors.getAnalyticsDataFromGoogle);

	const checkGoogleAnalyticsArray = () => {
		return (
			googleAnalytics?.analytics?.filteredCountryGoogleResponse?.length !== 0 ||
			googleAnalytics?.analytics?.filteredDeviceCategoryGoogleResponse?.length !== 0 ||
			googleAnalytics?.analytics?.filteredOperatingSystemGoogleResponse?.length !== 0 ||
			googleAnalytics?.analytics?.filteredPagePathGoogleResponse?.length !== 0
		);
	};

	return (
		<Box position={'relative'} p={'24px'} borderRadius={'10px'} bg={'bg.main'} h={'592px'} w={'100%'}>
			<HeaderUserData />
			{checkGoogleAnalyticsArray() && !isLoading && (
				<Flex flexDir={'column'} gap={'24px'} mt={'24px'}>
					<Grid templateColumns='repeat(2, 1fr)' gap={'40px'} h={'232px'}>
						<CountryChart />
						<ReferrerChart />
					</Grid>
					<Grid templateColumns='repeat(2, 1fr)' gap={'40px'} h={'232px'}>
						<DeviseChart />
						<ByOsChart />
					</Grid>
				</Flex>
			)}
			{!checkGoogleAnalyticsArray() && !isLoading && (
				<Box h={'400px'}>
					<Text
						position={'absolute'}
						top='50%'
						right='50%'
						transform={'translate(50%, -50%)'}
						color='black'
						fontSize='18px'
						fontWeight='500'
						textAlign='center'
					>
						No data
					</Text>
				</Box>
			)}
			{isLoading && <FullPageLoader position={'absolute'} w={'150px'} />}
		</Box>
	);
};
