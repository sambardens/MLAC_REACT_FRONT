import { Box, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';

const PaletteCardSkeleton = () => {
	return (
		<Box
			p={'14px 10px 20px 10px'}
			// border={'1px solid #D2D2D2'}
			borderRadius={'5px'}
			mt={'8px'}
			className='animate-pulse'
		>
			<Flex alignItems={'center'} justifyContent={'space-between'}>
				<Box
					className='animate-pulse'
					w={'85px'}
					h={'20px'}
					bg={'bg.secondary'}
					borderRadius={'5px'}
				></Box>
				<Box w={'30px'} h={'30px'} borderRadius={'50%'} bg={'bg.secondary'}></Box>
			</Flex>

			<UnorderedList m={'0'} mt={'33px'} display={'flex'} justifyContent={'space-between'}>
				{[1, 2, 3, 4]?.map(itemColor => {
					return (
						<ListItem
							key={itemColor}
							listStyleType={'none'}
							borderColor={'brand.lightGray'}
							borderRadius={'5px'}
							h={'50px'}
							w={'50px'}
							bg={'bg.secondary'}
						></ListItem>
					);
				})}
			</UnorderedList>
		</Box>
	);
};

export default PaletteCardSkeleton;
