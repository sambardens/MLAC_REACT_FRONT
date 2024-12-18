import { Box, Text } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import VerifyPhoneNumber from '@/components/Modals/components/VerifyPhoneNumber';

const VerifyForSignature = ({ handleVerify }) => {
	const { user } = useSelector(state => state.user);
	useEffect(() => {
		if (user?.phone) {
			handleVerify();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.phone]);
	return (
		<Box p='8px' bg='bg.secondary' borderRadius='8px'>
			<Text color='accent' fontSize='16px' fontWeight='400' mb='8px'>
				Please verify your phone to sign.
			</Text>
			<VerifyPhoneNumber />
		</Box>
	);
};

export default VerifyForSignature;
