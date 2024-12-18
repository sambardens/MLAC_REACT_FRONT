import { Flex } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import CartIcon from '@/components/VisualElements/CartIcon';
import WebPageLogo from '@/components/WebPageLogo/WebPageLogo';

import LandingCartModal from '../../CreateOrEditLanding/LandingCartModal/LandingCartModal';
import LandingPayModal from '../../CreateOrEditLanding/LandingPayModal/LandingPayModal';

const LogoField = ({
	logoSrc,
	isCart,
	setTracks,
	tracks,
	setTracksInCart,
	tracksInCart,
	setIsAllTracks,
	colors,
	fonts,
	socialLinksType,
}) => {
	const [isCartModal, setIsCartModal] = useState(false);
	const [isPayModal, setIsPayModal] = useState(false);

	const { releasePrice } = useSelector(state => state.user.selectedRelease);
	const totalPriceInCart =
		tracks?.length === tracksInCart.length
			? releasePrice
			: tracksInCart.length
			? tracksInCart.reduce((acc, track) => acc + track.price, 0)
			: 0;

	const handleOpenCart = () => {
		setIsAllTracks(false);
		setIsCartModal(!isCartModal);
	};

	return (
		<>
			<Flex
				bg='transparent'
				px='16px'
				zIndex={1}
				align='center'
				h='80px'
				w='100%'
				justify='space-between'
				pos='absolute'
				top='0'
			>
				<WebPageLogo logoSrc={logoSrc} socialLinksType={socialLinksType} />
				{isCart && (
					<CartIcon
						onClick={handleOpenCart}
						itemAmount={tracksInCart.length}
						isNumber={tracksInCart.length > 0}
						type='itemAmount'
						w='32px'
						h='32px'
						elColor={colors[2]}
					/>
				)}
			</Flex>
			{isCartModal && (
				<LandingCartModal
					colors={colors}
					fonts={fonts}
					tracks={tracks}
					setTracks={setTracks}
					setTracksInCart={setTracksInCart}
					tracksInCart={tracksInCart}
					totalPriceInCart={totalPriceInCart}
					onClose={() => {
						setIsCartModal(false);
					}}
					openPayModal={() => {
						setIsPayModal(true);
					}}
				/>
			)}

			{isPayModal && (
				<LandingPayModal
					colors={colors}
					fonts={fonts}
					onClose={() => setIsPayModal(false)}
					tracksInCart={tracksInCart}
					totalPriceInCart={totalPriceInCart}
				/>
			)}
		</>
	);
};

export default LogoField;
