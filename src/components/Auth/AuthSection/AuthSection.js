import { Box, Flex, Heading } from '@chakra-ui/react';

import { useState } from 'react';

import CustomButton from '@/components/Buttons/CustomButton';

// import MailIcon from '@/assets/icons/auth/mail.svg';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import VerificateEmailModal from '../VerificateEmailModal/VerificateEmailModal';

export const AuthSection = ({ isSignIn, setIsSignIn }) => {
	const [isModal, setIsModal] = useState(false);
	const toggleAuth = () => {
		setIsSignIn(!isSignIn);
	};

	return (
		<>
			<Box w={{ base: '100%', sm: '454px' }} mx='auto'>
				<Box w='308px' mx='auto' mb='40px'>
					<Heading fontWeight='600' fontSize='46px' color='black' textAlign='center' mb='16px'>
						Welcome
					</Heading>
					<Flex p='4px' bgColor='bg.secondary' borderRadius='10px' mb='16px'>
						<CustomButton styles={isSignIn ? 'main' : 'transparent'} onClickHandler={toggleAuth} w='100%'>
							Sign in
						</CustomButton>
						<CustomButton
							styles={!isSignIn ? 'main' : 'transparent'}
							onClickHandler={toggleAuth}
							ml='4px'
							w='100%'
						>
							Sign up
						</CustomButton>
					</Flex>
				</Box>

				{isSignIn ? <SignIn /> : <SignUp toggleAuth={toggleAuth} setIsModal={setIsModal} />}
			</Box>
			{isModal && <VerificateEmailModal setIsModal={setIsModal} />}
		</>
	);
};

export default AuthSection;
