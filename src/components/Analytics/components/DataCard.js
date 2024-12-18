import { Flex, Icon, Text } from '@chakra-ui/react';

import RingLoader from '@/components/Loaders/RingLoader';

const DataCard = ({
	icon,
	title,
	firstMetric,
	firstMetricAmount,
	secondMetric,
	secondMetricAmount,
	thirdMetric = false,
	thirdMetricAmount = false,
	titleColor = 'bg.blue',
	isLoading,
}) => {
	return (
		<Flex
			flexDir={'column'}
			w='100%'
			bgColor='white'
			borderRadius={'10px'}
			// color='secondary'
		>
			<Flex justifyContent={'start'} alignItems={'center'} px='16px' py='8px' color={titleColor}>
				<Icon as={icon} w='32px' h='32px' />
				<Text ml='8px' fontSize={'18px'} fontWeight={'600'}>
					{title}
				</Text>
			</Flex>

			{firstMetric && (
				<Flex
					// onClick={() => onMetricClick(firstMetric)}
					justifyContent={'space-between'}
					px='16px'
					py='8px'
					// cursor={'pointer'}
					// _hover={{ bgColor: 'secondary' }}
					// bgColor={firstMetric === chart.chartType && 'pink'}
				>
					<Text>{firstMetric}</Text>

					{isLoading ? <RingLoader w='24px' h='24px' /> : <Text>{firstMetricAmount}</Text>}
				</Flex>
			)}

			{secondMetric && (
				<Flex
					// onClick={() => onMetricClick(secondMetric)}
					justifyContent={'space-between'}
					px='16px'
					py='8px'
					// cursor={'pointer'}
					// _hover={{ bgColor: 'red' }}
					// bgColor={secondMetric === chart.chartType && 'pink'}
				>
					<Text>{secondMetric}</Text>

					{isLoading ? <RingLoader w='24px' h='24px' /> : <Text>{secondMetricAmount}</Text>}
				</Flex>
			)}

			{thirdMetric && (
				<Flex
					// onClick={() => onMetricClick(thirdMetric)}
					justifyContent={'space-between'}
					px='16px'
					py='8px'
					// cursor={'pointer'}
					// _hover={{ bgColor: 'red' }}
					// bgColor={thirdMetric === chart.chartType && 'pink'}
				>
					<Text>{thirdMetric}</Text>

					{isLoading ? <RingLoader w='24px' h='24px' /> : <Text>{thirdMetricAmount}</Text>}
				</Flex>
			)}
		</Flex>
	);
};

export default DataCard;
