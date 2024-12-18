import { Flex, Text } from '@chakra-ui/react';

const Item = ({ title, children }) => {
	return (
		<Flex
			flexDir={'column'}
			justifyContent={'start'}
			h='fit-content'
			maxH={'364px'}
			// w='287px'
			overflowY={'scroll'}
			p='0'
		>
			<Text p='12px' color='secondary'>
				{title}
			</Text>
			{children}
		</Flex>
	);
};

export default Item;
