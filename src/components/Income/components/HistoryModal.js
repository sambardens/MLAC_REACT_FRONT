import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';

import CustomModal from '@/components/Modals/CustomModal';

const PayoutHistoryModal = ({ closeModal, withdrawals, isDistrubute = false }) => {
	return (
		<CustomModal maxW='692px' closeModal={closeModal}>
			<Heading fontSize='32px' fontWeight='600' align='center'>
				{isDistrubute ? 'Distribution payout history' : 'Payout history'}
			</Heading>

			{withdrawals.length > 0 ? (
				<Box mt='24px'>
					<Grid
						templateColumns='20px 2fr 1fr 2fr'
						gap='24px'
						alignItems='center'
						bg='transparent'
						px='12px'
						mb='12px'
					>
						<Text fontWeight='500' color='black' fontSize='18px' align='center'>
							№
						</Text>
						<Text fontWeight='500' color='black' fontSize='18px' align='center'>
							Date
						</Text>
						<Text fontWeight='500' color='black' fontSize='18px' align='center'>
							Amount
						</Text>
						<Text fontWeight='500' color='black' fontSize='18px' align='center'>
							Status
						</Text>
					</Grid>

					<Flex as='ul' flexDir='column' maxH='240px' overflowY='scroll'>
						{withdrawals.map((el, i) => {
							const amount = el.currency ? `${el.amount} ${el.currency}` : `£${el.amount}`;
							return (
								<Grid
									as='li'
									key={el.id}
									templateColumns='20px 2fr 1fr 2fr'
									gap='24px'
									alignItems='center'
									bg='transparent'
									px='12px'
									py='8px'
									bgColor={el.bgColor}
								>
									<Text fontWeight='400' color='black' fontSize='16px' align='center'>
										{i + 1}
									</Text>
									<Text fontWeight='400' color='black' fontSize='16px' align='center'>
										{el.date}
									</Text>
									<Text fontWeight='400' color='black' fontSize='16px' align='center'>
										{amount}
									</Text>
									<Text fontWeight='400' color='black' fontSize='16px' align='center'>
										{el.status}
									</Text>
								</Grid>
							);
						})}
					</Flex>
				</Box>
			) : (
				<Flex align='center' justify='center' w='100%' h='264px'>
					<Text fontWeight='500' color='black' fontSize='16px' align='center'>
						You have not had any withdrawal requests.
					</Text>
				</Flex>
			)}
		</CustomModal>
	);
};

export default PayoutHistoryModal;
