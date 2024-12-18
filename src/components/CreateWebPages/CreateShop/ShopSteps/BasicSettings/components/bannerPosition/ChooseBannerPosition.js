import { Box, Flex, Heading } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import PositionCard from './PositionCard';

const ChooseBannerPosition = () => {
	const shop = useSelector(state => state.shop);

	return (
		<Box mt='24px'>
			<Heading fontSize='18px' fontWeight='500'>
				Banner size
			</Heading>
			{/* <Text mt='4px' fontSize='14px' fontWeight='400' color='secondary'>
				Upload your own banner or create a new one with Canva
			</Text> */}
			<Flex flexWrap={'wrap'} mt='24px'>
				<PositionCard title={'Slim'} posType={1} />
				<PositionCard title={'Full'} posType={2} />
				<PositionCard title={'Large'} posType={3} />
				<PositionCard title={'Square'} posType={4} />
			</Flex>
		</Box>
	);
};

export default ChooseBannerPosition;
