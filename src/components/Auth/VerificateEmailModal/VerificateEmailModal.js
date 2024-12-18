import { Flex, Heading, Icon, Text } from '@chakra-ui/react';

import CustomModal from '@/components/Modals/CustomModal';

import MailIcon from '@/assets/icons/auth/mail.svg';

const VerificateEmailModal = ({ setIsModal }) => {
	return (
		<CustomModal
			maxW='692px'
			closeModal={() => {
				setIsModal(false);
			}}
		>
			<Heading fontSize='32px' fontWeight='600' mb='24px'>
				Verification
			</Heading>
			<Flex alignItems='center' mb='8px'>
				<Icon as={MailIcon} mr='8px' w='24px' h='24px' />
				<Text fontSize='18px' fontWeight='500' color='black'>
					Verify your email
				</Text>
			</Flex>

			<Text fontSize='16px' fontWeight='400' color='secondary'>
				We have sent you an email. You need to verify your email to continue. If you have not received
				the email check your &apos;Spam&apos; folder.
			</Text>
		</CustomModal>
	);
};

export default VerificateEmailModal;
