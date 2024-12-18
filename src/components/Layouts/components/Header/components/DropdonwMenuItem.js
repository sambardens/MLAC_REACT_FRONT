import { Icon, MenuItem, Text } from '@chakra-ui/react';

const DropdownMenuItem = ({
	onClick,
	title,
	icon,
	iconColor = 'secondary',
	borderTop = '1px solid',
    borderTopColor = 'transparent',
    borderBottom = '1px solid',
	borderBottomColor = 'transparent',
}) => (
	<MenuItem
		onClick={onClick}
		p='12px'
		borderBottom={borderBottom}
		borderTop={borderTop}
        borderBottomColor={borderBottomColor}
        borderTopColor={borderTopColor}
        color='secondary'
        _hover={{bg: 'stroke', color: 'white'}}
		transition='0.3s linear'
	>
		<Icon as={icon} mr='10px' boxSize='24px' color={iconColor} />
		<Text color='currentColor' fontWeight='500' fontSize='16px'>{title}</Text>
	</MenuItem>
);


export default DropdownMenuItem