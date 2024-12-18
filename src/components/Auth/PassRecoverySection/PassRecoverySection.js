import { useRouter } from 'next/router';

import { Box } from '@chakra-ui/react';

import { useState } from 'react';

import CustomButton from '@/components/Buttons/CustomButton';

import PassRecoveryResend from './PassRecoveryResend/PassRecoveryResend';
import PassRecoverySend from './PassRecoverySend/PassRecoverySend';

export const PassRecoverySection = () => {
	const router = useRouter();
	const [isStartPage, setIsStartPage] = useState(true);
	const [styles, setStyles] = useState('disabled');
	const [email, setEmail] = useState('');
	return (
		<Box maxW='454px' mb='40px'>
			{isStartPage ? (
				<PassRecoverySend setIsStartPage={setIsStartPage} setEmail={setEmail} setStyles={setStyles} />
			) : (
				<PassRecoveryResend email={email} setStyles={setStyles} styles={styles} />
			)}
			<CustomButton
				onClickHandler={() => {
					router.push('/');
				}}
				mt='40px'
				w='100%'
				styles={'light-red'}
			>
				Return to sign in
			</CustomButton>
		</Box>
	);
};
export default PassRecoverySection;
