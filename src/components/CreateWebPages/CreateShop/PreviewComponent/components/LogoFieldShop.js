import { Box, Flex, IconButton } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSelectedRelease } from 'store/shop/shop-slice';

import CartIcon from '@/components/VisualElements/CartIcon';
import WebPageLogo from '@/components/WebPageLogo/WebPageLogo';
import WebPageSocialLinks from '@/components/WebPageSocialLinks/WebPageSocialLinks';

import HomeIcon from '@/assets/icons/base/home.svg';

import CartModalMock from './CartModalMock';
import PayModalMock from './PayModalMock';

const LogoFieldShop = ({
	logoSrc,
	socialLinksType,
	showSocialLinks,
	socialLinks,
	position = 'relative',
}) => {
	const shop = useSelector(state => state.shop);
	const [isCartModal, setIsCartModal] = useState(false);
	const [isPayModal, setIsPayModal] = useState(false);
	const [totalPrice, setTotalPrice] = useState(0);
	const { cart, selectedShopReleases, selectedRelease, selectedPalette, selectedFonts } = shop;
	const dispatch = useDispatch();
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

		setTotalPrice(newTotalPrice);
	};

	useEffect(() => {
		getTotalPrice();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cart]);

	return (
		<>
			<Flex
				position={position}
				top='0'
				left='0'
				px='20px'
				zIndex={1}
				align='center'
				h='80px'
				w='100%'
				justify='space-between'
				fontFamily={'Poppins, sans-serif'}
				bgColor='bg.gray'
				borderBottom='1px solid'
				// borderColor={selectedPalette?.colors[0]}
				borderColor='white'
			>
				<WebPageLogo logoSrc={logoSrc} socialLinksType={socialLinksType} />
				{showSocialLinks && (
					<Box pos='absolute' top='50%' left='50%' transform='translate(-50%, -50%)' zIndex={10}>
						<WebPageSocialLinks
							socialLinks={socialLinks}
							socialLinksType={socialLinksType}
							flexDir='raw'
						/>
					</Box>
				)}
				<Flex align='center'>
					{selectedRelease && (
						<IconButton
							icon={<HomeIcon />}
							size='35px'
							_hover={{ color: selectedPalette?.colors[2] }}
							color='white'
							onClick={() => dispatch(setSelectedRelease(null))}
							mr='20px'
						/>
					)}
					<CartIcon
						onClick={() => setIsCartModal(!isCartModal)}
						w='32px'
						h='32px'
						type='itemAmount'
						elColor={selectedPalette?.colors[2]}
						itemAmount={cart.length}
						isNumber={cart.length > 0}
					/>
				</Flex>
			</Flex>
			{isCartModal && (
				<CartModalMock
					closeCart={() => setIsCartModal(false)}
					openPayModal={() => setIsPayModal(true)}
					totalPrice={totalPrice}
				/>
			)}

			{isPayModal && <PayModalMock totalPrice={totalPrice} closeCart={() => setIsPayModal(false)} />}
		</>
	);
};

export default LogoFieldShop;
