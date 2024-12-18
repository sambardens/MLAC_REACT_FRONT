import { useRouter } from 'next/router';

import { Heading, useToast } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import acceptToBeFutureCreatorOfBap from 'src/functions/serverRequests/bap/acceptToBeFutureCreatorOfBap';
import { setTakeoverToken } from 'store/slice';

import AuthLayout from '@/components/Layouts/AuthLayout';

const TakeoverBap = () => {
	const { selectedBap } = useSelector(state => state.user);
	const { jwtToken } = useSelector(state => state.auth);
	const router = useRouter();
	const toast = useToast();
	const dispatch = useDispatch();
	const searchParams = new URLSearchParams(router.asPath.split(/\?/)[1]);
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

	const confirmTakeoverBapHandler = async () => {
		if (!jwtToken) {
			getToast('error', 'Error', 'To take over the B.A.P. you first need to login');

			dispatch(setTakeoverToken(token));
			router.push('/');

			return;
		}

		const resData = await acceptToBeFutureCreatorOfBap(token);

		if (resData.success) {
			getToast('success', 'Success', `B.A.P. ${resData?.bap?.name} was taken over successfully!`);
		}

		if (!resData.success) {
			getToast('error', 'Error', resData?.message);
		}
		if (selectedBap?.bapId) {
			router.push({
				pathname: '/bap/[bapId]/bap-info',
				query: { bapId: selectedBap?.bapId },
			});
		} else {
			router.push('/my-splits-contracts');
		}
	};

	useEffect(() => {
		confirmTakeoverBapHandler();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AuthLayout>
			<Heading
				fontWeight='600'
				fontSize='46px'
				color='black'
				textAlign='center'
				mb='40px'
				lineHeight='1.5'
			>
				Please wait...
			</Heading>
		</AuthLayout>
	);
};

export default TakeoverBap;
