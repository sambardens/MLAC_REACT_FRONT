import { Box, Flex, Input, Text, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';

import CustomModal from '@/components/Modals/CustomModal';

const VerifyModal = ({ closeModal, setIsPhoneVerified }) => {
	const [otp, setOtp] = useState('');
	const toast = useToast();
	const getToast = (status, title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status,
			duration: 5000,
			isClosable: true,
		});
	};
	useEffect(() => {
		const verifyOTP = () => {
			let confirmationResult = window.confirmationResult;
			if (!confirmationResult) {
				getToast('error', 'Error', 'Something went wrong. Please try again later.');
				return;
			} else {
				confirmationResult
					.confirm(otp)
					.then(async result => {
						// const user = result.user;
						setIsPhoneVerified(true);
						const recaptchaDiv = document.getElementById('recaptcha-div');
						recaptchaDiv.remove();
						closeModal();
					})
					.catch(error => {
						setIsPhoneVerified(false);
						getToast('error', 'Error', 'The entered code is incorrect');

						console.log('verifyNUMBER', error);
					});
			}
		};

		otp?.length === 6 && verifyOTP();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [closeModal, otp, setIsPhoneVerified]);

	const styledInput = props => {
		return (
			<Input
				{...props}
				minW='calc((100% - 64px) / 6)'
				h='63px'
				variant='flushed'
				textAlign='center'
				border='none'
				borderBottom='4px solid'
				borderColor='bg.secondary'
				type='number'
				fontSize='59px'
				lineHeight='100px'
			/>
		);
	};

	return (
		<CustomModal closeModal={closeModal} maxW='811px'>
			<Flex flexDir={'column'}>
				<Text fontSize={'32px'} fontWeight={'600'} lineHeight={'48px'}>
					Verify phone
				</Text>

				<Flex mt='24px'>
					<Box>
						<svg
							width='14'
							height='25'
							viewBox='0 0 14 25'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M4.5 20.5C4.22386 20.5 4 20.7239 4 21C4 21.2761 4.22386 21.5 4.5 21.5H9.5C9.77614 21.5 10 21.2761 10 21C10 20.7239 9.77614 20.5 9.5 20.5H4.5Z'
								fill='#FF0151'
							/>
							<path
								d='M11 0.5C12.6569 0.5 14 1.84315 14 3.5L14 21.5C14 23.1569 12.6569 24.5 11 24.5H3C1.34315 24.5 0 23.1569 0 21.5V3.5C0 1.84314 1.34315 0.5 3 0.5H11ZM12 3.5C12 2.94772 11.5523 2.5 11 2.5H10.6806C10.3768 2.5 10.0895 2.63809 9.89976 2.87531L9.70024 3.12469C9.51047 3.36191 9.22316 3.5 8.91938 3.5H5.08062C4.77684 3.5 4.48953 3.36191 4.29976 3.12469L4.10024 2.8753C3.91047 2.63809 3.62316 2.5 3.31938 2.5H3C2.44772 2.5 2 2.94772 2 3.5L2 21.5C2 22.0523 2.44772 22.5 3 22.5H11C11.5523 22.5 12 22.0523 12 21.5L12 3.5Z'
								fill='#FF0151'
							/>
						</svg>
					</Box>

					<Text ml='13px' fontSize={'18px'} fontWeight={'500'} lineHeight={'27px'}>
						Confirm your phone
					</Text>
				</Flex>

				<Text
					mt='9.5px'
					fontSize={'16px'}
					fontWeight={'400'}
					lineHeight={'24px'}
					color='brand.textGray'
				>
					We have sent a code to your phone , please enter this code to confirm
				</Text>

				<OtpInput
					value={otp}
					onChange={setOtp}
					numInputs={6}
					renderSeparator={<span>-</span>}
					renderInput={props => styledInput(props)}
					containerStyle={{ width: '100%', marginTop: '20px' }}
				/>
			</Flex>
		</CustomModal>
	);
};

export default VerifyModal;
