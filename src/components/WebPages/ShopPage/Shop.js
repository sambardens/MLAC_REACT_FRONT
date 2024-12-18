import { useRouter } from 'next/router';

import { Box, Flex, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getPreparedShop from 'src/functions/serverRequests/shop/getPreparedShop';
import { eventGA, pageviewGA } from 'src/functions/utils/googleAnalytics/ga';
import { getUserInfo } from 'store/operations';
import { setUserShop } from 'store/shop/shop-user-slice';

import SignUpForML from '@/components/CreateWebPages/components/SignUpForML/SignUpForML';
import SocialLayout from '@/components/Layouts/SocialLayout';
import FullPageLoader from '@/components/Loaders/FullPageLoader';
import CustomerAuthModal from '@/components/Modals/CustomerAuthModal';
import WebPageSocialLinks from '@/components/WebPageSocialLinks/WebPageSocialLinks';

import BannerFieldShop from './components/BannerFieldShop';
import LogoFieldShop from './components/LogoFieldShop';
import ReleasesList from './components/ReleasesList';

const Shop = ({ resData }) => {
	const shopUser = useSelector(state => state.shopUser);
	const { isLoggedIn, jwtToken } = useSelector(state => state.auth);
	const { query, pathname, push } = useRouter();
	const { releaseId, linkName } = query;
	const isShopPage = !releaseId;
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthModal, setIsAuthModal] = useState(false);
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();
	const toast = useToast();

	const handleGetShop = async () => {
		setIsLoading(true);
		const res = await getPreparedShop(resData, axiosPrivate);
		if (!res.success) {
			toast({
				position: 'top',
				title: 'Error',
				description: 'Something went wrong. Please try again later',
				status: 'error',
				duration: 8000,
				isClosable: true,
			});
			setIsLoading(false);
			push('/');
			return;
		}

		dispatch(setUserShop(res.shopData));
		setIsLoading(false);
	};

	useEffect(() => {
		if (
			resData?.shop?.bapId &&
			linkName &&
			(!shopUser?.linkName || (shopUser?.linkName && shopUser?.linkName !== linkName))
		) {
			handleGetShop();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [linkName, shopUser?.linkName, resData?.shop?.bapId]);

	useEffect(() => {
		if (jwtToken && !isLoggedIn) {
			dispatch(getUserInfo());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwtToken, isLoggedIn]);

	useEffect(() => {
		function handleClick() {
			eventGA('click', {
				event_category: shopUser?.bapId,
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

	const isLoader = isLoading || !(linkName && linkName === shopUser?.linkName);

	return (
		<SocialLayout setShowAuthModal={setIsAuthModal}>
			{isLoader ? (
				<FullPageLoader />
			) : (
				<Box
					maxH='100vh'
					overflow='hidden'
					bgColor={shopUser.bgSrc ? 'transparent' : shopUser.selectedPalette?.colors[1]}
				>
					<Box
						pos='relative'
						zIndex={-100}
						bgImage={shopUser.bgSrc || 'none'}
						bgSize={'cover'}
						bgPos={'center'}
						bgRepeat={'no-repeat'}
						position={'absolute'}
						top='0'
						left='0'
						right='0'
						bottom='0'
						filter={`blur(${(6.31 * Number(shopUser?.blur)) / 20}px)`}
					/>
					<BannerFieldShop />
					<Flex
						position={'relative'}
						flexDir='column'
						align='center'
						maxW={'100vw'}
						minH={'100vh'}
						// h={!isShopPage && '1300px'}
						h='100vh'
						overflowY={'auto'}
						css={{
							'&::-webkit-scrollbar-thumb': {
								backgroundColor: shopUser.selectedPalette?.colors[2],
							},
						}}
					>
						<LogoFieldShop isShopPage={isShopPage} setIsAuthModal={setIsAuthModal} />

						<ReleasesList />

						<Box
							my={{ base: '40px', lg: '0' }}
							bottom={{ base: 'initial', lg: '60px' }}
							pos={{ base: 'relative', lg: 'absolute' }}
							left={{ base: 'initial', lg: '50%' }}
							transform={{ base: 'none', lg: 'translateX(-50%)' }}
						>
							<SignUpForML
								openAuthModal={() => setIsAuthModal(true)}
								fontFamily={shopUser.selectedFonts[2].font}
								fontStyle={shopUser.selectedFonts[2].italic}
								fontWeight={shopUser.selectedFonts[2].weight}
								fontSize={shopUser.selectedFonts[2].size}
								textColor={shopUser?.selectedPalette?.colors[0]}
								buttonColor={shopUser?.selectedPalette?.colors[2]}
								bapId={shopUser?.bapId}
							/>
							{shopUser?.showSocialLinks && (
								<Box mt='24px' display={{ base: 'block', lg: 'none' }}>
									<WebPageSocialLinks
										socialLinks={shopUser?.socialLinks}
										socialLinksType={shopUser?.socialLinksType}
										flexDir='raw'
									/>
								</Box>
							)}
						</Box>
					</Flex>
				</Box>
			)}
			{isAuthModal && (
				<CustomerAuthModal
					setIsModal={setIsAuthModal}
					btnBgColor={shopUser.selectedPalette.colors[2]}
				/>
			)}
		</SocialLayout>
	);
};
export default Shop;
