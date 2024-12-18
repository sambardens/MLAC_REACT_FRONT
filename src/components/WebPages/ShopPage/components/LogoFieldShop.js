import { useRouter } from 'next/router';

import { Box, Flex, IconButton, Text } from '@chakra-ui/react';

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getTracksFromBasket from 'src/functions/serverRequests/shop/cart/getTracksFromBasket';
import prepareTrackForCart from 'src/functions/utils/web-pages/shop/prepareTrackForCart';
import { logOut } from 'store/auth/auth-operations';
import { clearShopCart, setCart, setShopSelectedRelease } from 'store/shop/shop-user-slice';

import CartIcon from '@/components/VisualElements/CartIcon';
import WebPageLogo from '@/components/WebPageLogo/WebPageLogo';
import WebPageSocialLinks from '@/components/WebPageSocialLinks/WebPageSocialLinks';
import CartModal from '@/components/WebPages/ShopPage/components/cart/CartModal';
import PayModal from '@/components/WebPages/ShopPage/components/cart/PayModal';

import HomeIcon from '@/assets/icons/base/home.svg';

const LogoFieldShop = ({ isShopPage, setIsAuthModal }) => {
	const dispatch = useDispatch();
	const { data: session } = useSession();
	const shopUser = useSelector(state => state.shopUser);
	const { user } = useSelector(state => state.user);

	const {
		cart,
		selectedShopReleases,
		selectedPalette,
		logoSrc,
		socialLinksType,
		showSocialLinks,
		socialLinks,
	} = shopUser;
	const [isCartModal, setIsCartModal] = useState(false);
	const [isPayModal, setIsPayModal] = useState(false);
	const [totalPrice, setTotalPrice] = useState(0);
	const [trackIds, setTrackIds] = useState({});
	const router = useRouter();
	const { linkName } = router.query;

	const { jwtToken, refreshToken } = useSelector(state => state.auth);

	const getTotalPrice = () => {
		let newTotalPrice = 0;

		if (!cart.length) return newTotalPrice;
		const releasesTracks = {};

		cart.forEach(track => {
			const { releaseId } = track;
			if (!releasesTracks[releaseId]) {
				releasesTracks[releaseId] = [];
			}
			releasesTracks[releaseId].push(track);
		});
		for (const [releaseId, tracksInCart] of Object.entries(releasesTracks)) {
			const currentRel = selectedShopReleases.find(el => {
				return el.id === +releaseId;
			});

			if (currentRel) {
				if (tracksInCart.length === currentRel.tracks.length) {
					newTotalPrice += currentRel.releasePrice;
				} else {
					tracksInCart.forEach(el => (newTotalPrice += Number(el.price)));
				}
			}
		}

		const trackIdsRequestBody = {};

		for (const key in releasesTracks) {
			if (Object.hasOwnProperty.call(releasesTracks, key)) {
				trackIdsRequestBody[key] = releasesTracks[key].map(item => item.id);
			}
		}
		setTrackIds(trackIdsRequestBody);
		setTotalPrice(newTotalPrice);
	};

	const handleBackToShopClick = () => {
		dispatch(setShopSelectedRelease(null));
		router.push({
			pathname: '/music/shop/[linkName]',
			query: { linkName },
		});
	};

	const getCartTracksFromServer = async () => {
		const resData = await getTracksFromBasket(shopUser.id);
		if (!resData.success) {
			return;
		}
		const preparedCartTracks = prepareTrackForCart(shopUser, resData.basket);
		dispatch(setCart(preparedCartTracks));

		return preparedCartTracks;
	};

	useEffect(() => {
		if (shopUser.id && user?.id) {
			getCartTracksFromServer();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shopUser?.id, user?.id]);

	useEffect(() => {
		getTotalPrice();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cart]);

	const handleOpenCart = () => {
		if (!jwtToken) {
			setIsAuthModal(true);
		} else {
			setIsCartModal(!isCartModal);
		}
	};

	const handleLogout = async () => {
		if (session) {
			await signOut({ redirect: false }).then(() => {
				dispatch(logOut(refreshToken));
				dispatch(clearShopCart());
			});
		} else {
			dispatch(logOut(refreshToken));
			dispatch(clearShopCart());
		}
	};

	return (
		<Box position={'fixed'} w='calc(100% + 6px)' zIndex={3}>
			<Flex
				position={'relative'}
				zIndex='3'
				top='0'
				px='24px'
				align='center'
				h='80px'
				w='100%'
				justify='space-between'
				alignItems='center'
				bgColor='bg.gray'
				borderBottom='1px solid'
				borderColor={selectedPalette?.colors[0]}
			>
				<WebPageLogo logoSrc={logoSrc} socialLinksType={socialLinksType} />

				{showSocialLinks && (
					<Box
						pos='absolute'
						top='50%'
						left='50%'
						transform='translate(-50%, -50%)'
						display={{ base: 'none', lg: 'block' }}
					>
						<WebPageSocialLinks
							socialLinks={socialLinks}
							socialLinksType={socialLinksType}
							flexDir='raw'
						/>
					</Box>
				)}
				<Flex align='center'>
					{user?.id && (
						<Flex mr='24px' as='ul'>
							<Box as='li' pr='16px' borderRight='3px solid' borderColor='white'>
								<Text fontSize='16px' color='white' fontWeight='400'>
									{user.firstName} {user.lastName}
								</Text>
							</Box>
							<Box as='li' ml='16px'>
								<Text
									fontSize='16px'
									color='white'
									as='button'
									cursor='pointer'
									fontWeight='400'
									onClick={handleLogout}
									_hover={{ color: selectedPalette?.colors[2] }}
									transition='0.3s linear'
								>
									Logout
								</Text>
							</Box>
						</Flex>
					)}

					{!isShopPage && (
						<IconButton
							icon={<HomeIcon />}
							size='35px'
							_hover={{ color: selectedPalette?.colors[2] }}
							color='white'
							onClick={handleBackToShopClick}
							mr='20px'
						/>
					)}
					<CartIcon
						onClick={handleOpenCart}
						itemAmount={cart?.length}
						isNumber={cart?.length > 0}
						type='itemAmount'
						w='32px'
						h='32px'
						elColor={selectedPalette.colors[2]}
					/>
				</Flex>
			</Flex>
			{isCartModal && (
				<CartModal
					totalPrice={totalPrice}
					closeCart={() => setIsCartModal(false)}
					openPayModal={() => setIsPayModal(true)}
					tracks={cart}
				/>
			)}

			{isPayModal && (
				<PayModal
					totalPrice={totalPrice}
					closeCart={() => setIsPayModal(false)}
					tracks={cart}
					trackIds={trackIds}
					color={selectedPalette.colors[2]}
				/>
			)}
		</Box>
	);
};

export default LogoFieldShop;
