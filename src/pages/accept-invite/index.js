import { useRouter } from 'next/router';

import { Heading, useToast } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getBapsRequest from 'src/functions/serverRequests/bap/getBapsRequest';
import checkNotifications from 'src/functions/serverRequests/notifications/checkNotifications';
import { setInviteToken } from 'store/auth/auth-slice';
import { setBaps } from 'store/slice';

import AuthLayout from '@/components/Layouts/AuthLayout';

const AcceptInvite = () => {
	const { push, asPath } = useRouter();
	const toast = useToast();
	const dispatch = useDispatch();
	const { user } = useSelector(state => state.user);
	const { jwtToken } = useSelector(state => state.auth);
	const axiosPrivate = useAxiosPrivate();
	const searchParams = new URLSearchParams(asPath.split(/\?/)[1]);
	const token = searchParams.get('token');

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

	const acceptInviteToBapHandler = async () => {
		const formData = new FormData();
		formData.append('isAccept', true);
		const resData = await checkNotifications(formData, token);

		if (resData.success) {
			getToast('success', 'Success', 'New B.A.P. was added to your B.A.P. list');
		} else {
			getToast(
				'error',
				'Error',
				`Failed to add new B.A.P. to your B.A.P. list. ${resData?.message || ''}`,
			);
		}

		return resData;
	};

	const acceptInviteHanlder = async () => {
		if (jwtToken) {
			await acceptInviteToBapHandler();
			const bapsWithImages = await getBapsRequest(axiosPrivate);
			dispatch(setBaps(bapsWithImages));
			if (user?.isNew) {
				router.push('/welcome');
			} else {
				push({
					pathname: '/bap/[bapId]/dashboard',
					query: { bapId: bapsWithImages[0]?.bapId },
				});
			}

			return;
		}
		dispatch(setInviteToken(token));
		getToast(
			'info',
			'Attention',
			'To accept the invite to the B.A.P. please register first. You will be transferred to the registration menu',
		);
		push('/');
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
			acceptInviteHanlder();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AuthLayout>
			<Heading fontWeight='600' fontSize='46px' color='black' textAlign='center' lineHeight='1.5'>
				Please wait...
			</Heading>
		</AuthLayout>
	);
};

export default AcceptInvite;
