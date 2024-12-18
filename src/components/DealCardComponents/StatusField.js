import { Flex, Icon, Text } from '@chakra-ui/react';

import WarningIcon from '@/assets/icons/base/warningSmall.svg';

const StatusField = ({ contract }) => {
	return (
		<Flex align='center'>
			<Text fontWeight='400' fontSize='18px' color='black' w='200px'>
				Status
			</Text>
			<Flex alignItems='center' ml='24px'>
				{!contract.isCancelled && !contract.isContractSigned && (
					<Icon as={WarningIcon} mr='8px' boxSize='16px' cursor='pointer' color='accent' />
				)}
				<Text
					w='100%'
					fontWeight='400'
					fontSize='16px'
					color={contract.status === 0 ? 'accent' : contract?.status === 1 ? '#31bf31' : 'secondary'}
				>
					{contract.statusText}
				</Text>
			</Flex>
		</Flex>
	);
};

export default StatusField;
