import { Box, Grid, IconButton, ListItem, Text, Tooltip, UnorderedList } from '@chakra-ui/react';

import { useState } from 'react';
import getIncomeDetails from 'src/functions/serverRequests/income/getIncomeDetails';
import getFormattedDate from 'src/functions/utils/getFormattedDate';

import UploadIcon from '@/assets/icons/base/upload-small.svg';

import IncomeDetails from './IncomeDetailsModal';

const IncomeItem = ({ transaction }) => {
	const [showDetails, setShowDetails] = useState(false);
	const date = getFormattedDate(transaction.createdAt);
	const [transactionDetails, setTransactionDetails] = useState(null);
	const handleDownload = async id => {
		const res = await getIncomeDetails(id);
		if (res?.success) {
			setTransactionDetails(res.income);
			setShowDetails(true);
		}
	};

	const getUniqueReleaseNames = () => {
		const uniqueReleaseNames = [];
		transaction?.tracks?.forEach(track => {
			const releaseName = track?.releaseName?.trim();

			if (!uniqueReleaseNames.includes(releaseName)) {
				uniqueReleaseNames.push(releaseName);
			}
		});
		return uniqueReleaseNames;
	};

	return (
		<>
			<Grid
				templateColumns='100px 1fr 1fr 1fr 50px 50px 50px 50px 50px'
				gap='24px'
				alignItems='center'
				px='12px'
				h='56px'
				bgColor='bg.main'
				borderRadius='10px'
			>
				<Text fontWeight='400' color='secondary' align='center' fontSize='14px'>
					{date}
				</Text>
				<Tooltip
					hasArrow
					label={transaction?.bapName?.length > 18 && transaction?.bapName}
					placement='auto'
					bg='bg.black'
					color='textColor.white'
					fontSize='16px'
					borderRadius={'5px'}
				>
					<Text
						fontWeight='400'
						align='center'
						color='black'
						fontSize='14px'
						overflow={'hidden'}
						textOverflow={'ellipsis'}
						whiteSpace='nowrap'
						maxWidth={'400px'}
					>
						{transaction.bapName}
					</Text>
				</Tooltip>

				<Tooltip
					hasArrow
					label={
						getUniqueReleaseNames()?.length !== 0 && (
							<Box minW={'150px'}>
								<Text textAlign={'center'}>Names of releases:</Text>
								<UnorderedList pr={'8px'} pb={'5px'} pl={'10px'}>
									{getUniqueReleaseNames()?.map(item => {
										return (
											<ListItem key={item}>
												<Text>{item}</Text>
											</ListItem>
										);
									})}
								</UnorderedList>
							</Box>
						)
					}
					placement='right'
					bg='bg.black'
					color='textColor.white'
					fontSize='16px'
					borderRadius={'5px'}
				>
					<Text
						fontWeight='400'
						align='center'
						color='black'
						fontSize='14px'
						overflow={'hidden'}
						textOverflow={'ellipsis'}
						whiteSpace='nowrap'
						maxWidth={'400px'}
					>
						{getUniqueReleaseNames()?.length}
					</Text>
				</Tooltip>

				<Tooltip
					hasArrow
					label={
						transaction?.tracks?.length !== 0 && (
							<Box minW={'150px'}>
								<Text textAlign={'center'}>Track names:</Text>
								<UnorderedList pr={'8px'} pb={'5px'} pl={'10px'}>
									{transaction?.tracks?.map(item => {
										return (
											<ListItem key={item?.uniqueName}>
												<Text>{item?.name}</Text>
											</ListItem>
										);
									})}
								</UnorderedList>
							</Box>
						)
					}
					placement='auto'
					bg='bg.black'
					color='textColor.white'
					fontSize='16px'
					borderRadius={'5px'}
				>
					<Text
						fontWeight='400'
						align='center'
						color='black'
						fontSize='14px'
						overflow={'hidden'}
						textOverflow={'ellipsis'}
						whiteSpace='nowrap'
						maxWidth={'400px'}
					>
						{transaction?.tracks?.length}
					</Text>
				</Tooltip>

				<Text fontWeight='400' color='secondary' align='center' fontSize='14px'>
					£{transaction.gross}
				</Text>
				<Text fontWeight='400' color='secondary' align='center' fontSize='14px'>
					£{transaction?.fees || 0}
				</Text>
				<Text fontWeight='400' color='secondary' align='center' fontSize='14px'>
					£{transaction?.net || 0}
				</Text>
				<Text fontWeight='400' color='secondary' align='center' fontSize='14px'>
					£{transaction?.tips || 0}
				</Text>
				<IconButton
					icon={<UploadIcon />}
					boxSize='24px'
					onClick={() => handleDownload(transaction.id)}
					color='stroke'
					_hover={{ color: 'accent' }}
					transition='0.3s linear'
				/>
			</Grid>
			{showDetails && (
				<IncomeDetails
					transaction={transactionDetails}
					closeModal={() => {
						setShowDetails(false);
					}}
				/>
			)}
		</>
	);
};

export default IncomeItem;
