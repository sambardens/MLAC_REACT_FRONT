import { Box, Text } from '@chakra-ui/react';

export const CustomIncomeTooltip = ({ active, payload, label, activeChart }) => {
	if (active) {
		return (
			<Box
				borderRadius={'5px'}
				bg={'#26313c'}
				color={'#fff'}
				padding={'16px'}
				boxShadow={'15px 30px 40px 5px rgba(0, 0, 0, 0.5)'}
				textAlign={'center'}
			>
				{payload && (
					<>
						<Text>
							{payload[0]?.payload?.currentMonth
								? `${payload[0]?.payload?.currentMonth}, ${payload[0]?.payload?.name}`
								: payload[0]?.payload?.currentDay
								? payload[0]?.payload?.currentDay
								: payload[0]?.payload?.monthOfYear
								? payload[0]?.payload?.monthOfYear
								: payload[0]?.payload?.year
								? payload[0]?.payload?.year
								: payload[0]?.payload?.fullName}
						</Text>
						<Text>
							{activeChart === 'Gross'
								? payload[0]?.payload?.gross
								: activeChart === 'Fees'
								? payload[0]?.payload?.fees
								: activeChart === 'Net'
								? payload[0]?.payload?.net
								: null}{' '}
							£
						</Text>
					</>
				)}
			</Box>
		);
	}
	return null;
};
