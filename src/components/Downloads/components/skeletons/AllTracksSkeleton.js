import { Box, Flex } from '@chakra-ui/react';

const AllTracksSkeleton = () => {
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
					<Flex key={index} w={'100%'}>
						<Flex alignItems={'center'}>
							<Box w={'40px'} mr={'16px'} h={'40px'} borderRadius={'50%'} bg={'bg.secondary'}></Box>{' '}
							<Box
								className='animate-pulse'
								bg={'bg.secondary'}
								borderRadius={'20px'}
								w={'82px'}
								h={'82px'}
							></Box>
						</Flex>
						<Flex flexDir={'column'} justifyContent={'space-between'} pt={'20px'} w={'100%'}>
							<Box w={'200px'} ml={'16px'} h={'15px'} borderRadius={'5px'} bg={'bg.secondary'}></Box>
							<Box w={'90%'} ml={'16px'} h={'10px'} borderRadius={'5px'} bg={'bg.secondary'}></Box>
						</Flex>
					</Flex>
				);
			})}
		</Flex>
	);
};

export default AllTracksSkeleton;
