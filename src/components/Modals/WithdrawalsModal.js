import { Box, Flex, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createWithdrawal } from 'store/operations';

import CustomButton from '../Buttons/CustomButton';
import CustomInput from '../CustomInputs/CustomInput';

import CustomModal from './CustomModal';

const WithdrawalsModal = ({ closeModal, balance }) => {
	const [amount, setAmount] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const toast = useToast();
	const checkInputForNumber = () => {
		const numberRegex = /^(0|[1-9]\d*)(\.\d+)?$/;
		return numberRegex.test(amount);
	};

	const handleWithdrawal = async e => {
		e.preventDefault();
		setIsLoading(true);

		const res = await dispatch(createWithdrawal(amount));

		if (!res?.payload?.success) {
			toast({
				position: 'top',
				title: 'Error',
				description: res?.payload?.error || 'Something has gone wrong. Try again later',
				status: 'error',
				duration: 9000,
				isClosable: true,
			});
		}
		closeModal();
		setIsLoading(false);
	};
	const handleChange = e => {
		const { value } = e.target;
		if (value === '') {
			setAmount(value);
		} else {
			const numberRegex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
			const isCorrect = numberRegex.test(value);
			isCorrect && setAmount(value);
		}
	};
	const btnStyle =
		amount > balance || amount < 100 || !amount || !checkInputForNumber(amount) ? 'disabled' : 'main';
	return (
		<CustomModal closeModal={closeModal} maxW='594px' w='80vw' maxH='80vh'>
			<Box as='form' onSubmit={handleWithdrawal}>
				<Text color='secondary' fontSize='16px' fontWeight='400' mb='16px'>
					Enter the amount you want to withdraw. The amount must be at least £100
				</Text>

				<CustomInput
					mt='4px'
					onChange={handleChange}
					value={amount}
					w='100%'
					placeholder={'Enter the amount you want to withdraw'}
				/>

				<Flex alignItems={'center'} justifyContent={'space-between'} w={'100%'} mt={'24px'}>
					<CustomButton onClickHandler={closeModal}>Cancel</CustomButton>
					<CustomButton isSubmiting={isLoading} styles={btnStyle} type='submit'>
						Send
					</CustomButton>
				</Flex>
			</Box>
		</CustomModal>
	);
};

export default WithdrawalsModal;
