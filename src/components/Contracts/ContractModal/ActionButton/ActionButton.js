import { Flex, Icon, Text } from '@chakra-ui/react';

const ActionButton = ({ onClick = null, icon, text, children }) => {
	return (
		<Flex
			border='1px solid'
			borderColor='stroke'
			borderRadius='10px'
			py='8px'
			px='12px'
			as='button'
			cursor='pointer'
			onClick={onClick}
			color='secondary'
			type='button'
			_hover={{ color: 'accent', borderColor: 'accent' }}
			transition='0.3s linear'
		>
			{icon && <Icon as={icon} mr='8px' boxSize='24px' />}
			{text && (
				<Text fontWeight='500' fontSize='16px'>
					{text}
				</Text>
			)}
			{children}
		</Flex>
	);
};

export default ActionButton;
