import { useRouter } from 'next/router';

import { Heading, useToast } from '@chakra-ui/react';

import { useEffect } from 'react';

import AuthLayout from '@/components/Layouts/AuthLayout';

const ActivateNewEmail = () => {
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
					`${process.env.NEXT_PUBLIC_URL}/api/users/activateNewEmail?token=${activateToken}`,
				);

				if (response.status === 200) {
					getToast('success', 'Success', 'New email has been confirmed');
				}
				router.push('/');
			} catch (error) {
				getToast('error', 'Failed to activate new email.', error?.message || '');
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
				Activate new email
			</Heading>
		</AuthLayout>
	);
};

export default ActivateNewEmail;
