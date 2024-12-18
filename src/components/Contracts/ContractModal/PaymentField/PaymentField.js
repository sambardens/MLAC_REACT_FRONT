import { Flex, Icon, Link, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveUserData } from 'store/operations';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';

import PayPalIcon from '@/assets/icons/base/paypal.svg';

import { inputStyles } from '@/styles/inputStyles';

const PaymentField = ({ setPaymentField, handlePaymentSaved }) => {
	const [paymentEmail, setPaymentEmail] = useState('');
	const [paymentEmailCopy, setPaymentEmailCopy] = useState('');
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();
	const toast = useToast();

	const handleSubmit = async e => {
		e.preventDefault();
		if (!paymentEmail || !paymentEmailCopy) {
			setError('Error two email addresses must be filled in and must match.');
			return;
		}
		if (paymentEmail !== paymentEmailCopy) {
			setError("Error two email addresses you have entered don't match");
			return;
		}
		setError(null);
		setIsLoading(true);
		const res = await dispatch(saveUserData({ paymentEmail }));
		setIsLoading(false);

		if (res?.payload?.success) {
			toast({
				position: 'top',
				title: 'Success',
				description: 'Thank you, your payment email was saved',
				status: 'success',
				duration: 9000,
				isClosable: true,
			});

			handlePaymentSaved();
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ paddingBottom: '24px', position: 'relative' }}>
			<Flex mt={'10px'} justify='space-between' align='center'>
				<Text fontSize='16px' fontWeight='400' mb='0'>
					Payment Details
				</Text>
				<Icon as={PayPalIcon} w='150px' h='36px' />
			</Flex>
			<Text mt='4px' fontSize={'12px'}>
				To receive payment on Major Labl, you need a PayPal account. Please make sure the email you
				provide is associated with a valid PayPal account. If you don&apos;t have a PayPal account, you
				can sign up by clicking{' '}
				<Link href='https://www.paypal.com/ky/webapps/mpp/account-selection' isExternal color='accent'>
					here
				</Link>
			</Text>
			<CustomInput
				type='email'
				name='paymentEmail'
				value={paymentEmail}
				onChange={e => setPaymentEmail(e.target.value)}
				mt={'8px'}
				placeholder='Enter your payment email address'
				sx={inputStyles}
				autoComplete='off'
			/>
			<CustomInput
				type='email'
				name='paymentEmailCopy'
				value={paymentEmailCopy}
				onChange={e => setPaymentEmailCopy(e.target.value)}
				mt={'8px'}
				placeholder='Re-Enter your payment email address'
				sx={inputStyles}
				autoComplete='off'
			/>

			{error && (
				<Text fontSize='12px' fontWeight='500' mt='8px' color='accent' h='18px'>
					{error}
				</Text>
			)}

			<Flex justify='flex-end' mt='16px'>
				<CustomButton styles='main' type='submit' isSubmiting={isLoading}>
					Save
				</CustomButton>
				<CustomButton
					styles='trasparent'
					onClickHandler={() => {
						setPaymentField(false);
					}}
					ml='16px'
				>
					Cancel
				</CustomButton>
			</Flex>
		</form>
	);
};

export default PaymentField;
