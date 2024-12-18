import { Box, Flex, Grid, Heading, Icon, Text } from '@chakra-ui/react';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomModal from '@/components/Modals/CustomModal';

import UploadIcon from '@/assets/icons/base/upload-small.svg';

import IncomeDetailsPdf from './IncomeDetailsPdf';

const IncomeDetailsUserTableTitle = () => {
	return (
		<Grid
			templateColumns=' 1fr 1fr 150px'
			gap='24px'
			alignItems='center'
			bg='transparent'
			px='12px'
			mb='4px'
		>
			<Text fontWeight='500' color='black' fontSize='18px'>
				Writer name
			</Text>
			<Text fontWeight='500' color='black' fontSize='18px'>
				Email
			</Text>
			<Text fontWeight='500' color='black' fontSize='18px'>
				Ownership
			</Text>
		</Grid>
	);
};

const IncomeDetailsTrackTableTitle = () => {
	return (
		<Grid
			templateColumns=' 1fr 1fr 150px'
			gap='24px'
			alignItems='center'
			bg='transparent'
			px='12px'
			mb='4px'
		>
			<Text fontWeight='500' color='black' fontSize='18px'>
				Track name
			</Text>
			<Text fontWeight='500' color='black' fontSize='18px'>
				Release
			</Text>
			<Text fontWeight='500' color='black' fontSize='18px'>
				Track price
			</Text>
		</Grid>
	);
};

const IncomeDetailsTrackItem = ({ track }) => {
	return (
		<Grid
			as='li'
			templateColumns=' 1fr 1fr 150px'
			gap='24px'
			alignItems='center'
			px='12px'
			bgColor={'bg.light'}
			borderRadius='10px'
			height='56px'
			mb='4px'
		>
			<Text fontWeight='400' color='secondary' fontSize='16px' isTruncated={true}>
				{track.trackName}
			</Text>

			<Text fontWeight='400' color='secondary' fontSize='16px' isTruncated={true}>
				{track?.releaseName}
			</Text>

			<Text fontWeight='400' color='secondary' fontSize='16px'>
				£{track?.price}
			</Text>
		</Grid>
	);
};

const IncomeDetailsUserItem = ({ user }) => {
	return (
		<Grid
			as='li'
			templateColumns=' 1fr 1fr 150px'
			gap='24px'
			alignItems='center'
			px='12px'
			bgColor={'bg.light'}
			borderRadius='10px'
			height='56px'
		>
			<Text fontWeight='400' color='secondary' fontSize='16px' isTruncated={true}>
				{user?.firstName || 'Anonymous'} {user?.lastName || ''}
			</Text>

			<Text fontWeight='400' color='secondary' fontSize='16px' isTruncated={true}>
				{user?.email}
			</Text>

			<Text fontWeight='400' color='secondary' fontSize='16px'>
				{user?.ownership}%
			</Text>
		</Grid>
	);
};

const Field = ({ title, text, line = false }) => {
	return (
		<Flex
			align='center'
			sx={{
				pb: line ? '16px' : '0',
				borderBottom: line ? '1px solid' : 'none',
				borderColor: 'stroke',
			}}
		>
			<Text w='200px' fontWeight='400' fontSize='18px' color='black' mr='24px'>
				{title}
			</Text>
			<Text fontWeight='400' fontSize='16px' color='secondary'>
				{text}
			</Text>
		</Flex>
	);
};

const IncomeDetailsModal = ({ closeModal, transaction }) => {
	const { user } = useSelector(state => state.user);

	const getUserTotalIncome = () => {
		const currentUserEmail = user.email;
		let total = 0;
		let uniqueSplitUsers = [];
		transaction.tracks.forEach(track => {
			const isUserInDeal = track?.splitUsers?.find(user => user.email === currentUserEmail);
			if (isUserInDeal) {
				const trackPriceAfterFees = track.price - track.price * transaction.fees;
				const ownership = isUserInDeal.ownership / 100;
				const trackIncomeForCurrentUser = trackPriceAfterFees * ownership;
				total += trackIncomeForCurrentUser;
			}
		});
		transaction.tracks.forEach(track => {
			track.splitUsers.forEach(splitUser => {
				const existingUserIndex = uniqueSplitUsers.findIndex(user => user.email === splitUser.email);
				if (existingUserIndex === -1) {
					uniqueSplitUsers.push(splitUser);
				}
			});
		});

		const totalPayment = total + transaction?.tips / uniqueSplitUsers?.length;

		return totalPayment.toFixed(2);
	};

	return (
		<CustomModal
			closeModal={closeModal}
			maxW='930px'
			maxH='800px'
			h='80vh'
			w='80vw'
			p='40px 0 40px 40px'
		>
			<Box maxH='720px' overflowY='scroll' pr='34px' h='calc(80vh - 80px)'>
				<Flex align='center' justify='space-between' mb='24px'>
					<Heading as='h3' lineHeight='1.5' fontWeight='600' fontSize='32px'>
						Receipt of payment on Major Labl
					</Heading>
					<CustomButton w='200px'>
						<Icon as={UploadIcon} mr='8px' boxSize='24px' />
						<PDFDownloadLink
							document={
								<IncomeDetailsPdf transaction={transaction} getUserTotalIncome={getUserTotalIncome} />
							}
							fileName='transaction.pdf'
						>
							{({ blob, url, loading, error }) => (error ? 'Error to convert pdf' : 'Download pdf')}
						</PDFDownloadLink>
					</CustomButton>
				</Flex>
				<Box mb='24px'>
					<Flex gap='16px' flexDir='column' mb='16px'>
						<Field title='Invoice  ID' text={transaction.invoiceId || 'invoice ID is empty'} />
						<Field title='Payment sent by' text={transaction.paymentEmail} />
						<Field title='Payment sent to' text={transaction.bapName} line={true} />
						<Field title='Date' text={transaction.date} />
						<Field title='Income' text={`£${transaction.gross}`} />
						{/* <Field title='Payment method' text='Visa' /> */}
						<Field title='Major Labl fee' text='10%' />
						<Field title='PayPal fee' text='3.4% + £0.20' />
						<Field title='Tips' text={`£${transaction.tips}`} line={true} />
					</Flex>
				</Box>
				<Box mb='24px'>
					<Flex flexDir='column' gap='4px' as='ul'>
						{transaction?.tracks?.map(track => (
							<Box key={track?.id} borderBottom='1px solid' borderColor='stroke' mb='12px'>
								<IncomeDetailsTrackTableTitle />
								<IncomeDetailsTrackItem track={track} />
								<IncomeDetailsUserTableTitle />
								{track?.splitUsers?.map(user => (
									<IncomeDetailsUserItem user={user} key={user.id} />
								))}
							</Box>
						))}
					</Flex>
				</Box>
				<Text align='end' fontWeight='600' color='black' fontSize='18px'>
					Your payment: £{getUserTotalIncome()}
				</Text>
			</Box>
		</CustomModal>
	);
};

export default IncomeDetailsModal;
