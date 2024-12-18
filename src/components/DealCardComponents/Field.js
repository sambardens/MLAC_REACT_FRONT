import { Flex, Text } from '@chakra-ui/react';

const Field = ({ title, text, isTruncated = false, textColor = 'secondary' }) => (
	<Flex align='center' pr='12px'>
		<Text fontWeight='400' fontSize='18px' color='black' w='200px' mr='24px' minW='200px'>
			{title}
		</Text>
		<Text fontWeight='400' fontSize='16px' color={textColor} isTruncated={isTruncated}>
			{text}
		</Text>
	</Flex>
);

export default Field;
