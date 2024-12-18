import { Box, Flex } from '@chakra-ui/react';

const ArtistAndBandSkeleton = () => {
	let arr = Array.from({ length: 5 }, (_, index) => index + 1);
	return (
		<Flex
			justifyContent={'start'}
			gap={'16px'}
			overflowY={'hidden'}
			px={'24px'}
			w={'100%'}
			mt={'24px'}
			flexDir={'column'}
		>
			{arr?.map((item, index) => {
				return (
					<Flex key={index} alignItems={'center'}>
						<Box
							className='animate-pulse'
							bg={'bg.secondary'}
							borderRadius={'20px'}
							w={'80px'}
							h={'80px'}
						></Box>
						<Box w={'200px'} ml={'16px'} h={'15px'} borderRadius={'5px'} bg={'bg.secondary'}></Box>{' '}
					</Flex>
				);
			})}
		</Flex>
	);
};

export default ArtistAndBandSkeleton;
