import { useRouter } from 'next/router';

import { Box, Flex, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getPreparedShop from 'src/functions/serverRequests/shop/getPreparedShop';
import { eventGA, pageviewGA } from 'src/functions/utils/googleAnalytics/ga';
import { getUserInfo } from 'store/operations';
import { setShopSelectedRelease, setUserShop } from 'store/shop/shop-user-slice';

import SocialLayout from '@/components/Layouts/SocialLayout';
import FullPageLoader from '@/components/Loaders/FullPageLoader';
import CustomerAuthModal from '@/components/Modals/CustomerAuthModal';

import LogoFieldShop from './components/LogoFieldShop';
import SelectedRelease from './components/SelectedRelease';

const ShopWithSelectedRelease = ({ resData }) => {
	const shopUser = useSelector(state => state.shopUser);
	const { isLoggedIn, jwtToken } = useSelector(state => state.auth);
	const { selectedRelease } = shopUser;

	const { query, push, pathname } = useRouter();
	const { releaseId, linkName } = query;
	const isShopPage = !releaseId;
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthModal, setIsAuthModal] = useState(false);
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();
	const toast = useToast();

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
	const handleGetShop = async () => {
		setIsLoading(true);
		const res = await getPreparedShop(resData, axiosPrivate, releaseId);
		if (!res.success) {
			getToast('error', 'Error', 'Something went wrong. Please try again later');
			setIsLoading(false);
			push('/');
			return;
		}

		dispatch(setUserShop(res.shopData));
		setIsLoading(false);
	};

	useEffect(() => {
		if (resData?.shop?.bapId && linkName && releaseId) {
			if (!shopUser?.linkName || (shopUser?.linkName && shopUser?.linkName !== linkName)) {
				handleGetShop();
				return;
			}
			if (!selectedRelease?.id || (selectedRelease?.id && selectedRelease?.id !== +releaseId)) {
				const release = shopUser.selectedShopReleases?.find(el => el.id === +releaseId);
				if (release) {
					dispatch(setShopSelectedRelease(release));
				} else {
					getToast('error', 'Error', 'Something went wrong. Please try again later');
					push({
						pathname: '/music/shop/[linkName]',
						query: { linkName },
					});
					return;
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, linkName, releaseId, selectedRelease?.id, shopUser?.linkName, resData?.shop?.bapId]);

	useEffect(() => {
		if (jwtToken && !isLoggedIn) {
			dispatch(getUserInfo());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwtToken, isLoggedIn]);

	const isLoader =
		isLoading || !selectedRelease?.id || !(selectedRelease?.id && selectedRelease?.id !== releaseId);

	useEffect(() => {
		function handleClick() {
			eventGA('click', {
				event_category: resData?.shop?.bapId,
				value: 1,
			});
		}

		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (pathname) {
			pageviewGA(pathname);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<SocialLayout setShowAuthModal={setIsAuthModal}>
			{isLoader ? (
				<FullPageLoader />
			) : (
				<Box overflow='hidden'>
					<Flex
						position={'relative'}
						flexDir='column'
						align='center'
						minH='100vh'
						bgColor={selectedRelease.logoSrc ? 'transparent' : 'bg.gray'}
						maxW={'100vw'}
						h='100vh'
						overflowY='scroll'
						css={{
							'&::-webkit-scrollbar-thumb': {
								backgroundColor: shopUser.selectedPalette.colors[2],
							},
						}}
					>
						<Box
							position='fixed'
							top='-10px'
							right='-10px'
							bottom='-10px'
							left='-10px'
							w='calc(100% + 20px)'
							h='calc(100% + 20px)'
							bgColor='rgba(0, 0, 0, 0.2)'
							bgPosition='center'
							bgSize='cover'
							bgRepeat={'no-repeat'}
							zIndex={-1}
							bgImage={selectedRelease.logoSrc || 'none'}
							filter={`blur(${(6.31 * Number(selectedRelease?.blur)) / 20}px)`}
						/>
						<LogoFieldShop isShopPage={isShopPage} setIsAuthModal={setIsAuthModal} />
						<SelectedRelease setIsAuthModal={setIsAuthModal} />
					</Flex>
					{isAuthModal && (
						<CustomerAuthModal
							setIsModal={setIsAuthModal}
							// shopSignInHandler={signInHandler}
							btnBgColor={shopUser.selectedPalette.colors[2]}
						/>
					)}
				</Box>
			)}
		</SocialLayout>
	);
};

export default ShopWithSelectedRelease;
