import { Box, Flex, Heading, Icon, Image, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from 'store/shop/shop-slice';

import CustomButton from '@/components/Buttons/CustomButton';
import SignUpForML from '@/components/CreateWebPages/components/SignUpForML/SignUpForML';
import WebAudioPlayer from '@/components/WebAudioPlayer/WebAudioPlayer';

import DownIcon from '@/assets/icons/base/down.svg';

import TracksListShop from './TracksListShop';

const SelectedRelease = () => {
	const dispatch = useDispatch();
	const { selectedRelease, cart, selectedFonts, selectedPalette } = useSelector(state => state.shop);
	const selectedBap = useSelector(state => state.user.selectedBap);
	const [isTracksList, setTracksList] = useState(false);

	const toast = useToast();
	const tracksNotInCart = selectedRelease.tracks.filter(releaseTrack => {
		const isInCart = cart.find(trackInCart => trackInCart.id === releaseTrack.id);
		return !isInCart;
	});

	const handleBuyFullRelease = () => {
		dispatch(setCart([...cart, ...tracksNotInCart]));

		toast({
			position: 'top',
			title: 'Success',
			description: 'Full release has been added to the cart!',
			status: 'success',
			duration: 3000,
			isClosable: true,
		});
	};
	useEffect(() => {
		setTracksList(false);
	}, [selectedRelease.id]);
	const showTracks = isTracksList && selectedRelease.tracks.length > 0;
	return (
		<Flex
			flexDir='column'
			w={{ base: '360px', md: '420px', lg: '480px' }}
			pos='relative'
			pb='40px'
			zIndex={1}
			align='center'
			mx='auto'
		>
			<Flex
				pos='relative'
				align='center'
				justify='center'
				w={{ base: '360px', md: '420px', lg: '480px' }}
				h={{ base: '360px', md: '420px', lg: '480px' }}
				bg='transparent'
			>
				{selectedRelease?.logoSrc ? (
					<Image alt='Release artwork' src={selectedRelease.logoSrc} h='100%' w='100%' />
				) : (
					<Text fontWeight='600' fontSize='24px' color='white'>
						The release has no artwork
					</Text>
				)}
			</Flex>
			<Box py='16px' bgColor={selectedPalette?.colors[1]} w='100%' borderBottomRadius='10px'>
				<Heading
					as='h2'
					fontFamily={selectedFonts[0].font}
					fontStyle={selectedFonts[0].italic}
					fontWeight={selectedFonts[0].weight}
					fontSize={selectedFonts[0].size}
					color={selectedPalette?.colors[0]}
					mb='6px'
					align='center'
					lineHeight={1.2}
				>
					{selectedRelease?.name}
				</Heading>

				<Text
					as='h3'
					fontFamily={selectedFonts[1].font}
					fontStyle={selectedFonts[1].italic}
					fontWeight={selectedFonts[1].weight}
					fontSize={selectedFonts[1].size}
					color={selectedPalette?.colors[0]}
					align='center'
					lineHeight={1.2}
				>
					{selectedBap?.bapName}
				</Text>
			</Box>

			<>
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
								fontFamily={selectedFonts[1].font}
								fontStyle={selectedFonts[1].italic}
							>
								£{selectedRelease?.releasePrice}
							</Text>

							<CustomButton
								onClickHandler={handleBuyFullRelease}
								styles={true}
								bgColor={selectedPalette?.colors[2]}
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
					<Flex
						onClick={() => setTracksList(!isTracksList)}
						alignItems={'center'}
						mt='24px'
						cursor={'pointer'}
					>
						<Text
							as='button'
							fontFamily={selectedFonts[1].font}
							fontStyle={selectedFonts[1].italic}
							fontWeight={selectedFonts[1].weight}
							fontSize={selectedFonts[1].size}
							color={selectedPalette?.colors[0]}
						>
							Buy individual tracks
						</Text>
						<Icon
							as={DownIcon}
							boxSize='24px'
							ml='10px'
							transform={isTracksList ? 'rotate(180deg)' : 'none'}
							transition={'300ms'}
							color={selectedPalette?.colors[0]}
						/>
					</Flex>
				)}
				{showTracks && <TracksListShop closeTracksList={() => setTracksList(false)} mt='24px' />}

				<SignUpForML
					fontFamily={selectedFonts[2].font}
					fontStyle={selectedFonts[2].italic}
					fontWeight={selectedFonts[2].weight}
					fontSize={selectedFonts[2].size}
					textColor={selectedPalette?.colors[0]}
					buttonColor={selectedPalette?.colors[2]}
					isСonstructor={true}
					mt={showTracks ? '40px' : '80px'}
					bapName={selectedBap?.bapName}
				/>
			</>
		</Flex>
	);
};

export default SelectedRelease;
