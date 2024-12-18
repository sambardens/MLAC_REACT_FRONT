import { Box, Flex, Text } from '@chakra-ui/react';

import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from 'store/auth/auth-operations';
import { clearCart } from 'store/landing/landing-slice';

import CartIcon from '@/components/VisualElements/CartIcon';
import WebPageLogo from '@/components/WebPageLogo/WebPageLogo';

import LandingCart from '../LandingCart/LandingCart';
import LandingPay from '../LandingPay/LandingPay';

const LandingHeader = ({
	setShowAllTracks,
	titleDesign,
	subTitleDesign,
	additionalDesign,
	setShowAuthModal,
	setLandingTracksList,
}) => {
	const { data: session } = useSession();
	const {
		landingInfo: { webpagesTypeId, logo, tracks, releasePrice, socialLinksType },
		cart,
	} = useSelector(state => state.landing);
	const { user } = useSelector(state => state.user);
	const { isLoggedIn, jwtToken, refreshToken } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const [isCartModal, setIsCartModal] = useState(false);
	const [isPayModal, setIsPayModal] = useState(false);

	const handleOpenCart = () => {
		if (user?.id && isLoggedIn && jwtToken) {
			setShowAllTracks(false);
			setIsCartModal(!isCartModal);
		} else {
			setShowAuthModal(true);
		}
	};
	const handleOpenPayModal = () => {
		setIsPayModal(true);
		setIsCartModal(false);
	};

	const handleLogout = async () => {
		if (session) {
			await signOut({ redirect: false }).then(() => {
				dispatch(logOut(refreshToken));
				dispatch(clearCart());
			});
		} else {
			dispatch(logOut(refreshToken));
			dispatch(clearCart());
		}
		setLandingTracksList(prev => prev.map(el => ({ ...el, isSelected: false })));
	};
	const totalPriceInCart =
		tracks.length === cart.length
			? releasePrice
			: cart.length
			? cart.reduce((acc, track) => acc + track.price, 0)
			: 0;

	return (
		<>
			<Flex
				pos={{ base: 'relative', lg: 'fixed' }}
				top='0'
				left='0'
				bg='transparent'
				px='16px'
				align='center'
				h='80px'
				w={{ base: '420px', lg: '100%' }}
				zIndex={100}
				justify='space-between'
			>
				<WebPageLogo logoSrc={logo} socialLinksType={socialLinksType} />

				{webpagesTypeId === 2 && (
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
										_hover={{ color: additionalDesign?.hex }}
										transition='0.3s linear'
									>
										Logout
									</Text>
								</Box>
							</Flex>
						)}
						<CartIcon
							onClick={handleOpenCart}
							itemAmount={cart.length}
							isNumber={cart.length > 0}
							type='itemAmount'
							w='32px'
							h='32px'
							elColor={additionalDesign?.hex}
						/>
					</Flex>
				)}
			</Flex>
			{isCartModal && (
				<LandingCart
					onClose={() => {
						setIsCartModal(false);
					}}
					handleOpenPayModal={handleOpenPayModal}
					titleDesign={titleDesign}
					subTitleDesign={subTitleDesign}
					additionalDesign={additionalDesign}
					totalPriceInCart={totalPriceInCart}
					setLandingTracksList={setLandingTracksList}
				/>
			)}

			{isPayModal && (
				<LandingPay
					titleDesign={titleDesign}
					subTitleDesign={subTitleDesign}
					additionalDesign={additionalDesign}
					onClose={() => setIsPayModal(false)}
					totalPriceInCart={totalPriceInCart}
					setLandingTracksList={setLandingTracksList}
				/>
			)}
		</>
	);
};

export default LandingHeader;
