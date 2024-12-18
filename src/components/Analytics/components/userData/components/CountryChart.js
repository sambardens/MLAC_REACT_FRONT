import { Box, Flex, Text, UnorderedList, Grid, ListItem, Tooltip } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { poppins_400_16_24 } from '@/styles/fontStyles';
import { getColorByIndex } from 'src/functions/utils/getColorsByIndex';
import { RadiusChart } from './RadiusChart';
import analyticsSelectors from 'store/analytics/analytics-selectors';
import useCountWithPercentage from 'src/functions/customHooks/useCountWithPercentage';

export const CountryChart = () => {
	const googleAnalytics = useSelector(analyticsSelectors.getAnalyticsDataFromGoogle);
	const countryDataArray = googleAnalytics?.analytics?.filteredCountryGoogleResponse;

	const countryList = useCountWithPercentage(countryDataArray, 'country');

	return (
		<Grid templateColumns='repeat(2, 1fr)' w='100%' p='24px' align='center' gap='24px'>
			<RadiusChart data={countryList} title='Country' />
			<UnorderedList w='100%' m='0px' display='flex' flexDir='column' gap='8px'>
				{countryList?.map((item, index) => {
					const { country, percentage } = item;
					const colorStyle = getColorByIndex(index);
					return (
						<ListItem
							key={country}
							w='100%'
							sx={{
								color: colorStyle,
								fontSize: '22px',
							}}
						>
							<Flex alignItems='center' justifyContent='space-between' w='100%' gap={'5px'}>
								<Tooltip
									label={country?.length > 15 ? country : ''}
									hasArrow
									bg='secondary'
									borderRadius='10px'
									fontWeight='500'
									fontSize='14px'
								>
									<Text
										sx={poppins_400_16_24}
										w='150px'
										overflow={'hidden'}
										textOverflow={'ellipsis'}
										whiteSpace='nowrap'
										color='textColor.black'
										textAlign={'start'}
									>
										{country}
									</Text>
								</Tooltip>
								<Text sx={poppins_400_16_24} color='textColor.gray'>
									{percentage}%
								</Text>
							</Flex>
						</ListItem>
					);
				})}
			</UnorderedList>
		</Grid>
	);
};
