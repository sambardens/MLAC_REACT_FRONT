import { Box, Flex, IconButton, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import {
	downloadListOfTracks,
	downloadOneTrack,
} from 'src/functions/serverRequests/downloads/getTracksToDownLoad';
import { addTracksToCart } from 'store/landing/landing-operations';

import CustomButton from '@/components/Buttons/CustomButton';
import SelectIcon from '@/components/Icons/SelectIcon/SelectIcon';

import UnselectedIcon from '@/assets/icons/base/unselected.svg';

import LandingTrack from '../LandingTrack/LandingTrack';

const LandingListOfTracks = ({
	titleDesign,
	subTitleDesign,
	additionalDesign,
	landingTracksList,
	setLandingTracksList,
	setShowAuthModal,
	setShowAllTracks,
}) => {
	const { landingInfo, cart } = useSelector(state => state.landing);
	const { webpagesTypeId, id, releasePrice, facebookPixel, bapId } = landingInfo;
	const { user } = useSelector(state => state.user);
	const { jwtToken } = useSelector(state => state.auth);
	const selectedTracks = landingTracksList.filter(track => track.isSelected);

	const axiosPrivate = useAxiosPrivate();
	const tracksToAdd = selectedTracks.filter(selectedTrack => {
		return !cart.some(cartItem => cartItem.id === selectedTrack.id);
	});
	const toast = useToast();
	const dispatch = useDispatch();
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
	const handleChange = (trackId, isInCart) => {
		if (isInCart) return;
		setLandingTracksList(
			landingTracksList.map(el => (el.id === trackId ? { ...el, isSelected: !el.isSelected } : el)),
		);
	};

	const handleAddTracksToCart = async () => {
		if (user?.id && jwtToken) {
			setIsLoading(true);

			const res = await dispatch(addTracksToCart({ tracks: tracksToAdd, landingPageId: id }));
			if (res?.payload?.success) {
				getToast(
					'success',
					'Success',
					`${tracksToAdd.length > 1 ? 'Tracks have' : 'Track has'} been added to the cart!`,
				);
				setShowAllTracks(false);
			} else {
				getToast('error', 'Error', 'Something has gone wrong. Try again later');
			}
			setIsLoading(false);
		} else {
			setShowAuthModal(true);
		}
	};
	const isAllSelected = landingTracksList.every(track => track.isSelected);
	const selectedTracksPrice = isAllSelected
		? releasePrice
		: selectedTracks.length
		? selectedTracks.reduce((acc, track) => acc + track.price, 0)
		: 0;
	const handleSelectAll = () => {
		if (isAllSelected) {
			if (cart.length > 0) {
				const updatedAllTracks = landingTracksList.map(track => {
					const foundTrack = cart.find(trackInCart => trackInCart.id === track.id);
					if (foundTrack) {
						return track;
					}
					return { ...track, isSelected: false };
				});
				setLandingTracksList(updatedAllTracks);
			} else {
				setLandingTracksList(landingTracksList.map(el => ({ ...el, isSelected: false })));
			}
		} else {
			setLandingTracksList(landingTracksList.map(el => ({ ...el, isSelected: true })));
		}
	};
	const isAllTracksInCart = cart.length === landingTracksList.length;

	const handleDownload = async () => {
		if (user?.id && jwtToken) {
			setIsLoading(true);
			let res;
			if (selectedTracks.length === 1) {
				res = await downloadOneTrack({
					trackData: selectedTracks[0],
					isFree: true,
					axiosPrivate,
					bapId,
				});
			} else if (selectedTracks.length > 1) {
				const folderName = landingInfo.releaseName;
				const artworkName = landingInfo.releaseName;
				const artwork = landingInfo?.releaseLogo;
				res = await downloadListOfTracks({
					tracks: selectedTracks,
					axiosPrivate,
					folderName,
					artwork,
					artworkName,
					bapId,
				});
			}
			if (res?.success) {
				if (facebookPixel && typeof window !== 'undefined' && typeof window?.fbq === 'function') {
					window.fbq('track', 'Download', { quantity: selectedTracks.length });
				}
				getToast('success', 'Success', '');
			}
			setIsLoading(false);
		} else {
			setShowAuthModal(true);
		}
	};
	return (
		<Box borderRadius='10px' bg={subTitleDesign?.hex} w='100%' py='16px' zIndex={10} mt='24px'>
			<Flex
				as='ul'
				flexDir='column'
				gap='12px'
				pl='12px'
				pr='6px'
				maxH='296px'
				overflowY='scroll'
				css={{
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: additionalDesign?.hex,
						borderRadius: '4px',
					},
				}}
			>
				{landingTracksList.map((track, index) => (
					<LandingTrack
						key={track?.id}
						track={track}
						index={index}
						titleDesign={titleDesign}
						subTitleDesign={subTitleDesign}
						additionalDesign={additionalDesign}
						onClick={handleChange}
					/>
				))}
			</Flex>
			{!isAllTracksInCart && landingTracksList.length > 1 && (
				<Flex px='12px' mt='12px' justify='flex-end' align='center'>
					<Text
						py='4px'
						color={titleDesign.hex}
						fontStyle={subTitleDesign.italic === 'italic' ? 'italic' : 'initial'}
						fontFamily={subTitleDesign.font}
					>
						Select All
					</Text>
					<IconButton
						size='xs'
						h='24px'
						aria-label={`${isAllSelected ? 'Unselect' : 'Select'} to buy all tracks`}
						icon={
							isAllSelected ? (
								<SelectIcon color={additionalDesign.hex} bgColor={titleDesign.hex} />
							) : (
								<UnselectedIcon style={{ color: titleDesign.hex }} />
							)
						}
						onClick={handleSelectAll}
						ml='16px'
					/>
				</Flex>
			)}
			{webpagesTypeId === 2 && (
				<>
					{isAllTracksInCart ? (
						<Text
							color={titleDesign.hex}
							fontWeight='600'
							mt='16px'
							align='center'
							fontFamily={subTitleDesign.font}
							fontStyle={subTitleDesign.italic ? 'italic' : 'initial'}
						>
							All tracks of the release are already in the cart!
						</Text>
					) : (
						<>
							<Flex mt='16px' px='12px'>
								<Text
									fontFamily={titleDesign.font}
									fontWeight={titleDesign.weight}
									fontSize={titleDesign.size}
									fontStyle={titleDesign.italic ? 'italic' : 'initial'}
									color={titleDesign.hex}
								>
									£{selectedTracksPrice}
								</Text>
								<CustomButton
									ml='auto'
									w='200px'
									bgColor={tracksToAdd.length > 0 && additionalDesign.hex}
									color={tracksToAdd.length > 0 && titleDesign.hex}
									styles={tracksToAdd.length === 0 && 'disabled'}
									fontFamily={additionalDesign.font}
									fontWeight={additionalDesign.weight}
									fontSize={additionalDesign.size}
									fontStyle={additionalDesign.italic === 'italic' ? 'italic' : 'initial'}
									disabledColor={titleDesign?.hex}
									isSubmiting={isLoading}
									onClickHandler={handleAddTracksToCart}
								>
									Add to cart
								</CustomButton>
							</Flex>
						</>
					)}
				</>
			)}

			{webpagesTypeId === 1 && (
				<Flex mt='16px' px='12px'>
					<CustomButton
						ml='auto'
						w='200px'
						bgColor={selectedTracks.length > 0 && additionalDesign?.hex}
						color={selectedTracks.length > 0 && titleDesign?.hex}
						styles={selectedTracks.length === 0 && 'disabled'}
						fontFamily={additionalDesign.font}
						fontWeight={additionalDesign.weight}
						fontSize={additionalDesign.size}
						fontStyle={additionalDesign.italic === 'italic' ? 'italic' : 'initial'}
						disabledColor={titleDesign?.hex}
						isSubmiting={isLoading}
						onClickHandler={handleDownload}
					>
						Download
					</CustomButton>
				</Flex>
			)}
		</Box>
	);
};

export default LandingListOfTracks;
