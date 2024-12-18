import { Box, Flex } from '@chakra-ui/react';

const ReleaseSkeleton = () => {
	let arr = Array.from({ length: 10 }, (_, index) => index + 1);
	return (
		<Flex
			alignItems={'center'}
			justifyContent={'center'}
			gap={'16px'}
			overflow={'hidden'}
			w={'100%'}
			mt={'24px'}
		>
			{arr?.map((item, index) => {
				return (
					<Box key={index}>
						<Box
							className='animate-pulse'
							w={'213px'}
							h={'183px'}
							bg={'bg.secondary'}
							borderRadius={'20px'}
						></Box>
						<Box w={'50px'} mt={'24px'} h={'10px'} borderRadius={'5px'} bg={'bg.secondary'}></Box>{' '}
						<Box w={'80px'} mt={'4px'} h={'10px'} borderRadius={'5px'} bg={'bg.secondary'}></Box>
					</Box>
				);
			})}
		</Flex>
	);
};

export default ReleaseSkeleton;
