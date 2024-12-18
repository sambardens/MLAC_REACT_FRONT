import { useRouter } from 'next/router';

import { Heading, useToast } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import confirmDeletionBap from 'src/functions/serverRequests/bap/confirmDeletionBap';
import getBapsRequest from 'src/functions/serverRequests/bap/getBapsRequest';
import { getBapMembers, getBapReleases } from 'store/operations';
import { resetSelectedBap, setBap, setBaps, setDeleteToken } from 'store/slice';

import AuthLayout from '@/components/Layouts/AuthLayout';

const DeleteBap = () => {
	const router = useRouter();
	const toast = useToast();
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();
	const searchParams = new URLSearchParams(router.asPath.split(/\?/)[1]);
	const deleteToken = searchParams.get('token');
	const { jwtToken } = useSelector(state => state.auth);
	const { selectedBap, user } = useSelector(state => state.user);

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
	const updateBaps = async () => {
		const bapsWithImages = await getBapsRequest(axiosPrivate);
		dispatch(setBaps(bapsWithImages));

		if (bapsWithImages.every(bap => bap.bapId !== selectedBap.bapId)) {
			if (bapsWithImages?.length) {
				dispatch(setBap(bapsWithImages[0]));
				dispatch(getBapReleases(bapsWithImages[0].bapId));
				dispatch(getBapMembers({ bapId: bapsWithImages[0].bapId, userId: user?.id }));
			} else {
				dispatch(resetSelectedBap());
				router.push('/my-splits-contracts');
			}
		}
	};

	const confirmDeletionBapHandler = async () => {
		if (!jwtToken) {
			getToast('error', 'Error', 'To delete the B.A.P. you first need to login.');
			dispatch(setDeleteToken(deleteToken));
			router.push('/');
			return;
		}

		const resData = await confirmDeletionBap(deleteToken, jwtToken);

		if (resData.success) {
			getToast('success', 'Success', 'The B.A.P. will be removed in the next few minutes.');
			if (selectedBap?.bapId) {
				router.push({
					pathname: '/bap/[bapId]/bap-info',
					query: { bapId: selectedBap.bapId },
				});
			} else {
				router.push('/my-splits-contracts');
			}

			setTimeout(updateBaps, 120000);
		}

		if (!resData.success) {
			getToast('error', 'Error', `Failed to delete the B.A.P.: ${resData?.message}`);
		}
	};

	useEffect(() => {
		confirmDeletionBapHandler();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AuthLayout>
			<Heading fontWeight='600' fontSize='46px' color='black' textAlign='center' lineHeight='1.5'>
				Delete B.A.P.
			</Heading>
		</AuthLayout>
	);
};

export default DeleteBap;
