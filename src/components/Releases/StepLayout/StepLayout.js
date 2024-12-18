import { Box, Flex, Heading, Text } from '@chakra-ui/react';

const StepLayout = ({ title, text, children }) => {
	return (
		<Flex flex='1' flexDir='column' w='100%'>
			<Box mb='32px'>
				<Heading color='black' fontSize='18px' fontWeight='500' mb='8px'>
					{title}
				</Heading>
				<Text color='secondary' fontSize='16px' fontWeight='400'>
					{text}
				</Text>
			</Box>

			{children}
		</Flex>
	);
};

export default StepLayout;
