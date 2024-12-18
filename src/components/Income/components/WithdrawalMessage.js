import { Flex, Icon, Text } from '@chakra-ui/react';

import WarningIcon from '@/assets/icons/base/warning.svg';

const WithdrawalMessage = ({ withdrawal }) => {
	const bgColor = withdrawal.isApproved ? '#00ff0038' : 'bg.pink';
	const text = withdrawal.isApproved ? 'has been approved' : 'has been accepted for processing';
	const iconColor = withdrawal.isApproved ? '#04bc04' : 'accent';
	return (
		<Flex as='li' align='center' bgColor={bgColor} p='8px 24px'>
			<Icon as={WarningIcon} mr='8px' boxSize='24px' color={iconColor} />
			<Text fontSize='14px' fontWeight='400' color='accent'>
				Your withdrawal request for £{withdrawal.amount}&nbsp;{text}
			</Text>
		</Flex>
	);
};

export default WithdrawalMessage;
