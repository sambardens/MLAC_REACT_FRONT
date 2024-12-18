import { useRouter } from 'next/router';

import { Heading, useToast } from '@chakra-ui/react';

import { useEffect } from 'react';

import AuthLayout from '@/components/Layouts/AuthLayout';

const Activate = () => {
	const toast = useToast();
	const router = useRouter();
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
		const activateHandler = async activateToken => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_URL}/api/auth/activate?token=${activateToken}`,
				);
				// const data = await response.json();

				if (response.status === 200) {
					getToast('success', 'Email confirmed', 'Account activated successfully.');
				}
				router.push('/');
			} catch (error) {
				getToast('error', 'Failed to activate account.', error?.message || '');
			}
		};
		const { token } = router.query;
		if (token) {
			activateHandler(token);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	return (
		<AuthLayout>
			<Heading
				fontWeight='600'
				fontSize='46px'
				color='black'
				textAlign='center'
				lineHeight='1.5'
				mb='40px'
			>
				Activate Account
			</Heading>
		</AuthLayout>
	);
};

export default Activate;
