import { Box, ListItem, Text, UnorderedList } from '@chakra-ui/react';

const CustomTooltip = ({ active, payload, label, analyticsData }) => {
	const totalProfit = () => {
		if (!payload[0]?.payload?.net && !payload[0]?.payload?.tips) {
			return 0;
		}
		const sum =
			payload[0]?.payload?.net + payload[0]?.payload?.tips - payload[0]?.payload?.fees?.toFixed(2);
		return sum;
	};

	const profit = totalProfit();

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
						<Text fontSize={'18px'}>
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
						{analyticsData && (
							<>
								<UnorderedList display={'flex'} flexDir={'column'} mt={'5px'}>
									{payload[0]?.payload?.gross && (
										<ListItem>
											<Text textAlign={'start'}>Gross: &nbsp;£{payload[0]?.payload?.gross?.toFixed(2)}</Text>
										</ListItem>
									)}
									{payload[0]?.payload?.fees && (
										<ListItem>
											<Text textAlign={'start'}>
												Fees: &nbsp;&nbsp;&nbsp;£{payload[0]?.payload?.fees?.toFixed(2)}
											</Text>
										</ListItem>
									)}

									{payload[0]?.payload?.net && (
										<ListItem>
											<Text textAlign={'start'}>
												Net: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;£{payload[0]?.payload?.net?.toFixed(2)}
											</Text>
										</ListItem>
									)}

									{payload[0]?.payload?.tips && (
										<ListItem>
											<Text textAlign={'start'}>
												Tips: &nbsp;&nbsp;&nbsp;&nbsp;£{payload[0]?.payload?.tips?.toFixed(2)}
											</Text>
										</ListItem>
									)}
								</UnorderedList>
								{profit ? (
									<Text fontSize={'18px'} mt={'10px'}>
										Profit: £{profit}
									</Text>
								) : (
									<Text fontSize={'16px'}>No profit</Text>
								)}
							</>
						)}
						{/* {analyticsData && payload[0]?.payload?.price ? (
							<Text fontSize={'18px'} mt={'10px'}>
								Income: £{payload[0]?.payload?.price?.toFixed(2)}
							</Text>
						) : (
							analyticsData && <Text fontSize={'16px'}>No income</Text>
						)} */}
					</>
				)}
			</Box>
		);
	}
	return null;
};

export default CustomTooltip;
