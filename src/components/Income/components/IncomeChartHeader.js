import { Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';

import ReceiptIcon from '@/assets/icons/income/receipt.svg';

import { poppins_500_16_24, poppins_600_18_27 } from '@/styles/fontStyles';

export const IncomeChartHeader = ({ setActiveChart, activeChart, data }) => {
	function calculateTotals() {
		let grossTotal = 0;
		let feesTotal = 0;
		let netTotal = 0;

		for (const item of data) {
			grossTotal += item.gross;
			feesTotal += item.fees;
			netTotal += item.net;
		}

		return [
			{ title: 'Gross', amount: `£${Math.round(grossTotal * 100) / 100}` },
			{ title: 'Fees', amount: `£${Math.round(feesTotal * 100) / 100}` },
			{ title: 'Net', amount: `£${Math.round(netTotal * 100) / 100}` },
		];
	}

	const chartButtonsArr = calculateTotals();

	return (
		<Flex
			w={'100%'}
			p={'20px'}
			alignItems={'center'}
			borderRadius={'10px'}
			bg={'bg.main'}
			my={'16px'}
			gap={'40px'}
		>
			<ReceiptIcon />
			<UnorderedList
				display={'flex'}
				gap={'40px'}
				w={'100%'}
				alignSelf={'stretch'}
				alignItems={'center'}
				justifyContent={'space-between'}
			>
				{chartButtonsArr?.map(item => {
					return (
						<ListItem
							key={item.title}
							maxW={'250px'}
							w={'100%'}
							display={'flex'}
							flexDirection={'column'}
							alignItems={'center'}
							gap='{8px}'
							borderRadius={'10px'}
							_hover={{ bg: 'bg.light' }}
							cursor={'pointer'}
							onClick={() => setActiveChart(item.title)}
						>
							<Text
								sx={poppins_600_18_27}
								color={activeChart === item.title ? 'textColor.red' : 'textColor.black'}
							>
								{item.title}
							</Text>
							<Text
								sx={poppins_500_16_24}
								color={activeChart === item.title ? 'textColor.red' : 'textColor.black'}
							>
								{item.amount}
							</Text>
						</ListItem>
					);
				})}
			</UnorderedList>
		</Flex>
	);
};
