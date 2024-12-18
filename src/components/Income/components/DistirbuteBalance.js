import { Box, Flex, Icon, Text, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import {
	getPayoutBalance,
	getPayoutHistory,
	payoutForDistribution,
} from 'src/functions/serverRequests/eveara/eveara';

import CustomButton from '@/components/Buttons/CustomButton';
import RingLoader from '@/components/Loaders/RingLoader';

import ConfirmationModal from './ConfirmationModal';
import PayoutHistoryModal from './HistoryModal';

const DistributeBalance = () => {
	const toast = useToast();
	const axiosPrivate = useAxiosPrivate();
	const { user } = useSelector(state => state.user);
	const [isWithdrawModal, setIsWithdrawModal] = useState(false);
	const [balanceInfo, setBalanceInfo] = useState(null);
	const [balance, setBalance] = useState(0);
	const [isHistoryModal, setIsHistoryModal] = useState(false);
	const [isLoadingBalance, setIsLoadingBalance] = useState(false);
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);
	const [isLoadingPayout, setIsLoadingPayout] = useState(false);
	const [error, setError] = useState(false);

	const [withdrawals, setWithdrawals] = useState([]);

	const normalizedBalanceInfo = balanceInfo?.filter(el => el.balance >= 50);

	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 7000,
			isClosable: true,
		});
	};

	const handleGetBalance = async () => {
		setIsLoadingBalance(true);
		const balanceArrRes = await Promise.all(
			user?.participantsInfo.map(async el => {
				const balanceRes = await getPayoutBalance({
					uuidEveara: el.uuidEveara,
					participantId: el.participantId,
					axiosPrivate,
				});
				console.log('balanceRes: ', balanceRes);
				return balanceRes;
			}),
		);
		console.log('balanceArrRes: ', balanceArrRes);
		const isSuccess = balanceArrRes.every(el => el.success);
		if (isSuccess) {
			setBalanceInfo(balanceArrRes);
			const newBalance = balanceArrRes.reduce((acc, el) => acc + el.balance, 0);
			setBalance(newBalance);
		} else {
			const errors = [];
			balanceArrRes?.forEach(el => {
				if (el.errors?.length > 0) {
					el.errors.forEach(error => {
						errors.push(error.message);
					});
				}
			});
			const errorText = errors?.length > 0 && errors.join('. ');
			getToast('Error', errorText || "Something went wrong. Can't got balance for distribution");

			setError(true);
		}

		setIsLoadingBalance(false);
	};
	const handleWithdrawal = async () => {
		setIsLoadingPayout(true);
		setIsLoadingBalance(true);
		const payoutArrRes = await Promise.all(
			normalizedBalanceInfo.map(async data => {
				const payoutRes = await payoutForDistribution({ ...data, axiosPrivate });
				console.log('handleWithdrawal payoutRes: ', payoutRes);

				return payoutRes;
			}),
		);
		const isSuccess = payoutArrRes.every(el => el.success);
		if (isSuccess) {
			getToast('Success', 'Your withdrawal request has been successfully submitted.');
		} else {
			const errors = [];
			payoutArrRes?.forEach(el => {
				if (el.errors?.length > 0) {
					el.errors.forEach(error => {
						errors.push(error.message);
					});
				}
			});
			const errorText = errors?.length > 0 && errors.join('. ');
			getToast('Error', errorText || "Something went wrong. Can't withdraw money. Try again later");
		}
		console.log('handleWithdrawal payoutArrRes: ', payoutArrRes);
		if (user?.participantsInfo?.length > 0) {
			await handleGetBalance();
		}
		setIsLoadingPayout(false);
		setIsWithdrawModal(false);
		setIsLoadingBalance(false);
	};

	const handleOpenHistory = async () => {
		setIsLoadingHistory(true);
		const payoutArrRes = await Promise.all(
			balanceInfo.map(async data => {
				const payoutRes = await getPayoutHistory({ ...data, axiosPrivate });
				console.log('handleOpenHistory payoutRes: ', payoutRes);
				return payoutRes;
			}),
		);
		console.log('handleOpenHistory payoutArrRes: ', payoutArrRes);
		const res = payoutArrRes
			?.filter(el => el.withdrawals?.length > 0)
			.map(el => el.withdrawals)
			.flat();
		setWithdrawals(res);

		setIsHistoryModal(true);
		setIsLoadingHistory(false);
	};

	useEffect(() => {
		if (user?.participantsInfo?.length > 0) {
			handleGetBalance();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [axiosPrivate, user?.participantsInfo, user?.participantsInfo?.length]);

	return (
		<>
			<Flex align='center' justify='flex-end' mt='12px' gap='12px'>
				<Flex align='center'>
					<Text fontSize='16px' fontWeight='400' color='black' mr='12px'>
						Balance from distribution:
					</Text>
					{isLoadingBalance ? (
						<Flex w='80px' justify='flex-end'>
							<RingLoader w='24px' h='24px' />
						</Flex>
					) : (
						<Text
							fontSize='16px'
							fontWeight='400'
							color={error ? 'accent' : 'black'}
							w='80px'
							textAlign='end'
						>
							{error ? 'error' : `£${Math.floor(balance * 100) / 100}`}
						</Text>
					)}
				</Flex>

				<CustomButton
					onClickHandler={() => setIsWithdrawModal(true)}
					styles={normalizedBalanceInfo?.length > 0 ? 'main' : 'disabled'}
				>
					Withdrawal
				</CustomButton>

				<CustomButton
					onClickHandler={handleOpenHistory}
					styles={balanceInfo?.length > 0 ? 'main' : 'disabled'}
					isSubmiting={isLoadingHistory}
				>
					Payout history
				</CustomButton>
			</Flex>
			{isWithdrawModal && (
				<ConfirmationModal
					closeModal={() => setIsWithdrawModal(false)}
					isLoading={isLoadingPayout}
					onClickHandler={handleWithdrawal}
				/>
			)}
			{isHistoryModal && (
				<PayoutHistoryModal
					closeModal={() => {
						setIsHistoryModal(false);
					}}
					isDistrubute={true}
					withdrawals={withdrawals}
				/>
			)}
		</>
	);
};

export default DistributeBalance;
