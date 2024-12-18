import { Flex, Icon, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import WarningIcon from '@/assets/icons/base/warning.svg';

const WarningMessage = ({ title = '' }) => {
	const { user } = useSelector(state => state.user);
	const text =
		title ||
		`Writer ${user?.firstName} ${user?.lastName} have not yet connected there bank account to Major Labl`;
	return (
		<Flex px='24px' py='8px' align='center' bg='bg.pink' mb='32px'>
			<Icon as={WarningIcon} mr='8px' boxSize='24px' color='accent' />
			<Text fontSize='14px' fontWeight='500' color='accent'>
				{text}
			</Text>
		</Flex>
	);
};

export default WarningMessage;
