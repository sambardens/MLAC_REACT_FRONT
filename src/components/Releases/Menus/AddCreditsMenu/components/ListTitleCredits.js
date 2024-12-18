import { Flex, Heading, Icon, Text } from '@chakra-ui/react';

import ArrowDownIcon from '@/assets/icons/base/arrow-down.svg';
import ArrowUpIcon from '@/assets/icons/base/arrow-up.svg';

const ListTitleCredits = ({ title, onClick, isViewAll, isAdditionalBtn }) => {
	return (
		<Flex justify='space-between' mb='4px' align='center'>
			<Heading color='black' fontSize='18px' fontWeight='500'>
				{title}
			</Heading>
			{isAdditionalBtn && (
				<>
					{isViewAll ? (
						<Flex as='button' onClick={onClick} px='12px' py='8px'>
							<Icon as={ArrowUpIcon} boxSize='24px' color='accent' mr='10px' />
							<Text color='accent' fontSize='16px' fontWeight='500'>
								Hide
							</Text>
						</Flex>
					) : (
						<Flex as='button' onClick={onClick} px='12px' py='8px'>
							<Icon as={ArrowDownIcon} boxSize='24px' color='accent' mr='10px' />
							<Text color='accent' fontSize='16px' fontWeight='500'>
								View all
							</Text>
						</Flex>
					)}
				</>
			)}
		</Flex>
	);
};

export default ListTitleCredits;
