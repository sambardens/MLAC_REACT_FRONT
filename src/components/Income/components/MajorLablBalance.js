import { Flex, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import { getWithdrawals } from 'src/functions/serverRequests/income/getWithdrawals';

import CustomButton from '@/components/Buttons/CustomButton';
import RingLoader from '@/components/Loaders/RingLoader';
import WithdrawalsModal from '@/components/Modals/WithdrawalsModal';

import PayoutHistoryModal from './HistoryModal';

const MajorLablBalance = () => {
	const toast = useToast();
	const axiosPrivate = useAxiosPrivate();
	const { incomes } = useSelector(state => state.income);
	const { user } = useSelector(state => state.user);
	const balance = Math.round(parseFloat(user.balance) * 100) / 100;

	const [isWithdrawModal, setIsWithdrawModal] = useState(false);
	const [isHistoryModal, setIsHistoryModal] = useState(false);
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);

	const [withdrawals, setWithdrawals] = useState([]);

	const test = [
		{
			id: 10,
			amount: '100.00',
			date: '12:11, 28 June 2023',
			status: 'Accepted for processing',
			bgColor: 'bg.pink',
		},
		{
			id: 11,
			amount: '1004.00',
			date: '12:11, 28 Jun 2023',
			status: 'Approved',
			bgColor: '#00ff0038',
		},
		{
			id: 12,
			amount: '1010.00',
			date: '10:11, 22 Oct 2023',
			status: 'Approved',
			bgColor: '#00ff0038',
		},
		{
			id: 13,
			amount: '1500.00',
			date: '19:22, 22 Oct 2023',
			status: 'Approved',
			bgColor: '#00ff0038',
		},
		{
			id: 14,
			amount: '10.00',
			date: '16:11, 28 Sep 2023',
			status: 'Approved',
			bgColor: '#00ff0038',
		},
		{
			id: 15,
			amount: '222.00',
			date: '10:00, 20 Jun 2022',
			status: 'Approved',
			bgColor: '#00ff0038',
		},
		{
			id: 16,
			amount: '10.00',
			date: '16:11, 28 Sep 2023',
			status: 'Approved',
			bgColor: '#00ff0038',
		},
		{
			id: 17,
			amount: '222.00',
			date: '10:00, 20 Jun 2022',
			status: 'Approved',
			bgColor: '#00ff0038',
		},
	];
	const onClickWithdrawal = () => {
		if (balance < 100) {
			toast({
				position: 'top',
				title: 'Information',
				description: 'To withdraw funds, the balance must be at least £100',
				status: 'info',
				duration: 9000,
				isClosable: true,
			});
			return;
		}
		setIsWithdrawModal(true);
	};
	const handleOpenHistory = async () => {
		setIsLoadingHistory(true);
		setIsHistoryModal(true);
		const res = await getWithdrawals(axiosPrivate);
		if (res.success) {
			setWithdrawals(res?.withdrawals);
		}

		setIsLoadingHistory(false);
	};

	return (
		<Flex align='center' gap='12px'>
			<Flex>
				<Text fontSize='16px' fontWeight='400' color='black'>
					Balance:
				</Text>
				<Text ml='12px' fontSize='16px' fontWeight='400' color='black' textAlign='end' w='80px'>
					£{balance}
				</Text>
			</Flex>
			<CustomButton onClickHandler={onClickWithdrawal}>Withdrawal</CustomButton>
			<CustomButton
				onClickHandler={handleOpenHistory}
				// styles={incomes?.length > 0 ? 'main' : 'disabled'}
				isSubmiting={isLoadingHistory}
			>
				Payout history
			</CustomButton>

			{isWithdrawModal && (
				<WithdrawalsModal closeModal={() => setIsWithdrawModal(false)} balance={balance} />
			)}
			{isHistoryModal && (
				<PayoutHistoryModal
					closeModal={() => {
						setIsHistoryModal(false);
					}}
					withdrawals={withdrawals}
				/>
			)}
		</Flex>
	);
};

export default MajorLablBalance;
