import { Flex, Icon, Text } from '@chakra-ui/react';

const ActionBtn = ({ onClick = null, icon, text }) => (
	<Flex
		as='button'
		onClick={onClick}
		w='100%'
		py='8px'
		color='secondary'
		_hover={{ color: 'accent' }}
		transition='0.3s linear'
	>
		<Icon as={icon} mr='8px' boxSize='24px' />
		<Text fontWeight='500' fontSize='16px'>
			{text}
		</Text>
	</Flex>
);

export default ActionBtn;
