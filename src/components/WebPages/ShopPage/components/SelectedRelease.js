import Image from 'next/image';

import { Box, Flex, Heading, Icon, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addTrackToBasket from 'src/functions/serverRequests/shop/cart/addTrackToBasket';
import { setUserShop } from 'store/shop/shop-user-slice';

import CustomButton from '@/components/Buttons/CustomButton';
import SignUpForML from '@/components/CreateWebPages/components/SignUpForML/SignUpForML';
import WebAudioPlayer from '@/components/WebAudioPlayer/WebAudioPlayer';
import WebPageSocialLinks from '@/components/WebPageSocialLinks/WebPageSocialLinks';

import DownIcon from '@/assets/icons/base/down.svg';

import TracksListShop from './TracksListShop';

const SelectedRelease = ({ setIsAuthModal }) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const shopUser = useSelector(state => state.shopUser);
	const { cart, selectedRelease, selectedFonts, selectedPalette } = shopUser;
	const [isTracksList, setTracksList] = useState(false);

	const auth = useSelector(state => state.auth);
	const [isLoading, setIsLoading] = useState(false);

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
	const tracksNotInCart = selectedRelease.tracks.filter(releaseTrack => {
		const isInCart = cart.find(trackInCart => trackInCart.id === releaseTrack.id);
		return !isInCart;
	});

	const handleBuyFullRelease = async () => {
		if (!auth.jwtToken) {
			setIsAuthModal(true);
			return;
		}

		setIsLoading(true);

		const trackIds = tracksNotInCart.map(tr => tr.id);
		const resData = await addTrackToBasket({ shopId: shopUser.id, trackIds });
		if (!resData.success) {
			getToast('error', 'Error', resData?.message);
			return;
		}
		getToast('success', 'Success', 'Full release has been added to the cart!');

		const tracksFromOtherReleases = cart.filter(tr => tr.releaseId !== selectedRelease.id);
		const updatedCart = [...tracksFromOtherReleases, ...selectedRelease.tracks];
		const updatedShop = { ...shopUser, cart: updatedCart };
		dispatch(setUserShop(updatedShop));
		setIsLoading(false);
	};

	const handleByIndividualTracks = () => {
		if (!auth.jwtToken) {
			setIsAuthModal(true);
			return;
		}

		setTracksList(!isTracksList);
	};

	const showTracks = isTracksList && selectedRelease.tracks.length > 0;
	return (
		<Flex
			flexDir='column'
			pb='40px'
			w={{ base: '360px', md: '420px', lg: '480px' }}
			pos='relative'
			zIndex={1}
			align='center'
			mt='80px'
		>
			<Flex
				pos='relative'
				align='center'
				justify='center'
				w={{ base: '360px', md: '420px', lg: '480px' }}
				h={{ base: '360px', md: '420px', lg: '480px' }}
				bg='bg.gray'
			>
				{selectedRelease?.logoSrc ? (
					<Image
						alt='Release artwork'
						src={selectedRelease.logoSrc}
						sizes={{ base: '360px', md: '420px', lg: '480px' }}
						fill
					/>
				) : (
					<Text fontWeight='600' fontSize='24px' color='white'>
						The release has no artwork
					</Text>
				)}
			</Flex>
			<Box py='16px' bgColor={selectedPalette.colors[1]} w='100%' borderBottomRadius='10px'>
				<Heading
					as='h2'
					fontFamily={selectedFonts[0].font}
					fontStyle={selectedFonts[0].italic}
					fontWeight={selectedFonts[0].weight}
					fontSize={selectedFonts[0].size}
					color={selectedPalette.colors[0]}
					textAlign='center'
					mb='6px'
					lineHeight={1.2}
				>
					{selectedRelease?.name}
				</Heading>

				<Heading
					as='h3'
					fontFamily={selectedFonts[1].font}
					fontStyle={selectedFonts[1].italic}
					fontWeight={selectedFonts[1].weight}
					fontSize={selectedFonts[1].size}
					color={selectedPalette.colors[0]}
					textAlign='center'
					lineHeight={1.2}
				>
					{selectedRelease?.bapName}
				</Heading>
			</Box>
			<Box bgColor={selectedPalette?.colors[1]} p='12px' borderRadius='10px' w='100%' mt='24px'>
				<WebAudioPlayer
					tracks={selectedRelease.tracks}
					color={selectedPalette?.colors[2]}
					textColor={selectedPalette?.colors[0]}
					fontStyle={selectedFonts[1].italic}
				/>
				{tracksNotInCart.length > 0 && (
					<Flex justify='space-between' align='center' minH='56px'>
						<Text
							fontWeight='600'
							fontSize='32px'
							color={selectedPalette?.colors[0]}
							fontFamily={selectedFonts[0].font}
							fontStyle={selectedFonts[0].italic}
						>
							£{selectedRelease?.releasePrice}
						</Text>

						<CustomButton
							onClickHandler={handleBuyFullRelease}
							isSubmiting={isLoading}
							styles={true}
							bgColor={selectedPalette.colors[2]}
							color={selectedPalette?.colors[0]}
							fontStyle={selectedFonts[2].italic}
							fontFamily={selectedFonts[2].font}
							fontWeight={selectedFonts[2].weight}
							fontSize={selectedFonts[2].size}
							w='200px'
						>
							Buy full release
						</CustomButton>
					</Flex>
				)}
			</Box>

			{selectedRelease?.tracks?.length > 1 && (
				<Flex onClick={handleByIndividualTracks} alignItems={'center'} mt='24px' cursor={'pointer'}>
					<Text
						as='button'
						fontFamily={selectedFonts[1].font}
						fontStyle={selectedFonts[1].italic}
						fontWeight={selectedFonts[1].weight}
						fontSize={selectedFonts[1].size}
						color={selectedPalette.colors[0]}
					>
						Buy individual tracks
					</Text>
					<Icon
						as={DownIcon}
						boxSize='24px'
						ml='10px'
						transform={isTracksList ? 'rotate(180deg)' : 'none'}
						transition={'300ms'}
						color={selectedPalette.colors[0]}
					/>
				</Flex>
			)}

			{showTracks && (
				<TracksListShop
					tracks={selectedRelease.tracks}
					closeTracksList={() => setTracksList(false)}
					mt='24px'
				/>
			)}

			<Box mt={showTracks ? '40px' : '80px'}>
				<SignUpForML
					openAuthModal={() => {
						setIsAuthModal(true);
					}}
					fontFamily={selectedFonts[2].font}
					fontStyle={selectedFonts[2].italic}
					fontWeight={selectedFonts[2].weight}
					fontSize={selectedFonts[2].size}
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
	);
};

export default SelectedRelease;
