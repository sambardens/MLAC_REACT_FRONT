import { Box, Heading, Text } from '@chakra-ui/react';

import { useState } from 'react';

import CustomModal from '@/components/Modals/CustomModal';

import SignIn from '../Auth/SignIn/SignIn';
import SignUp from '../Auth/SignUp/SignUp';
import VerificateEmailModal from '../Auth/VerificateEmailModal/VerificateEmailModal';

const CustomerAuthModal = ({ setIsModal, btnBgColor, btnTextColor }) => {
	const [showLoginScreen, setShowLoginScreen] = useState(false);
	const [showVerifyEmailModal, setShowVerifyEmailModal] = useState();
	const toggleAuth = () => {
		setShowLoginScreen(!showLoginScreen);
	};

	return (
		<>
			<CustomModal
				maxW='692px'
				closeModal={() => {
					setIsModal(false);
				}}
			>
				<Heading fontSize='32px' fontWeight='600' mb='24px' pl='12px' textAlign={'center'}>
					Please authorize to continue
				</Heading>
				<Text fontSize='18px' fontWeight='500' color='black' mb='24px' pl='12px'>
					{showLoginScreen ? 'Sign in form' : 'Sign up form'}
				</Text>
				{showLoginScreen ? (
					<SignIn
						accentColor={btnBgColor}
						btnTextColor={btnTextColor}
						closeModalInWeb={() => {
							setIsModal(false);
						}}
					/>
				) : (
					<SignUp
						toggleAuth={toggleAuth}
						setIsModal={setShowVerifyEmailModal}
						accentColor={btnBgColor}
						btnTextColor={btnTextColor}
					/>
				)}
				<Box
					as='button'
					cursor='pointer'
					w='100%'
					m='auto'
					onClick={() => {
						setShowLoginScreen(!showLoginScreen);
					}}
				>
					<Text fontWeight={500} fontSize='18px' textAlign='center' mt='16px'>
						{showLoginScreen ? 'No account? Sign up' : 'Already have an account? Sign in'}
					</Text>
				</Box>
			</CustomModal>
			{showVerifyEmailModal && <VerificateEmailModal setIsModal={setShowVerifyEmailModal} />}
		</>
	);
};

export default CustomerAuthModal;
