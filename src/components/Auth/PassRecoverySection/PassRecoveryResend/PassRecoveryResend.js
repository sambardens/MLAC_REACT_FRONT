import { Box, Flex, Heading, Text, useToast } from '@chakra-ui/react';

import resetPassword from 'src/functions/serverRequests/mails/resetPassword';

import CustomButton from '@/components/Buttons/CustomButton';

const PassRecoveryResend = ({ email, styles, setStyles }) => {
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
	const handleResendMail = async emailValue => {
		const data = await resetPassword(emailValue);
		if (data.success === true) {
			getToast('success', 'Email sent successfully', 'Check your email to change your password!');
			setStyles('disabled');
			setTimeout(() => {
				setStyles('main');
			}, 30000);
		}
		if (data.success === false) {
			getToast('error', 'Error', data.message);
		}
	};
	return (
		<Box>
			<Heading
				fontWeight='600'
				fontSize='50px'
				color='black'
				textAlign='center'
				mb='16px'
				lineHeight='1.5'
			>
				Check your mail
			</Heading>

			<Text textAlign='center' color='secondary' fontSize='14px' lineHeight='1.5'>
				A link to reset your password has been sent, please check your email
				<Text as='span' color='accent'>
					&nbsp;{email}&nbsp;
				</Text>
			</Text>
			<Text textAlign='center' color='secondary' fontSize='14px' lineHeight='1.5'>
				If you did not receive this email, click the button below to resend it. send it again in
				<Text as='span' color='accent'>
					&nbsp;30 seconds
				</Text>
			</Text>
			<CustomButton
				mt='40px'
				w='100%'
				styles={styles}
				onClickHandler={() => {
					handleResendMail(email);
				}}
			>
				Resend
			</CustomButton>
		</Box>
	);
};

export default PassRecoveryResend;
