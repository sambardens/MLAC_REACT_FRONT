import { Box, Flex, Text, useToast } from '@chakra-ui/react';

import { signOut, useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import removeAccount from 'src/functions/serverRequests/user/removeAccount';
import { resetAuthState } from 'store/auth/auth-slice';
import { resetUserState } from 'store/slice';

import CustomButton from '../Buttons/CustomButton';

import CustomModal from './CustomModal';

const DeleteAccountModal = ({ closeModal }) => {
	const toast = useToast();
	const dispatch = useDispatch();
	const { data: session } = useSession();
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
	const deleteAccountHandler = async () => {
		const res = await removeAccount();
		let isSuccess;

		if (res.data.status) {
			isSuccess = true;
		}

		if (res.data.success) {
			isSuccess = false;
		}

		if (isSuccess) {
			getToast('success', 'Email sent successfully', 'Thank you, your account has been deleted successfully');

			if (session) {
				await signOut({ redirect: false });
			}

			dispatch(resetAuthState());
			dispatch(resetUserState());
		}

		if (!isSuccess) {
			getToast('error', 'Error', res?.data?.message);
		}
	};

	return (
		<CustomModal closeModal={closeModal}>
			<Flex flexDir='column' justifyContent={'center'} p='30px'>
				<Text textAlign={'center'}>Are you sure, that you want to delete your account?</Text>
				<Flex justifyContent={'space-between'} mt='50px'>
					<Box onClick={deleteAccountHandler}>
						<CustomButton>Yes</CustomButton>
					</Box>

					<Box onClick={closeModal}>
						<CustomButton>No</CustomButton>
					</Box>
				</Flex>
			</Flex>
		</CustomModal>
	);
};

export default DeleteAccountModal;
