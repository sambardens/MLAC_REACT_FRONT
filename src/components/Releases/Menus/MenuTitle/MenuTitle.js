import { Box, Heading, Text } from '@chakra-ui/react';

const MenuTitle = ({ title, text, mb = '32px', maxW = '700px', mr }) => {
	return (
		<Box px='12px' mb={mb} maxW={maxW} mr={mr}>
			<Heading
				as='h3'
				fontSize='16px'
				fontWeight='400'
				color='black'
				fontFamily='Poppins'
				lineHeight='1'
			>
				{title}
			</Heading>
			{text && (
				<Text fontSize='14px' fontWeight='400' color='secondary' mt='8px'>
					{text}
				</Text>
			)}
		</Box>
	);
};

export default MenuTitle;
