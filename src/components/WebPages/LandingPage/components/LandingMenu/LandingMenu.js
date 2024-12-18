import { Box, Flex, Icon, Text, useToast } from '@chakra-ui/react';

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
import SignUpForML from '@/components/CreateWebPages/components/SignUpForML/SignUpForML';
import WebAudioPlayer from '@/components/WebAudioPlayer/WebAudioPlayer';
import WebPageSocialLinks from '@/components/WebPageSocialLinks/WebPageSocialLinks';

import DownIcon from '@/assets/icons/base/down.svg';

import LandingListOfTracks from '../LandingListOfTracks/LandingListOfTracks';

const LandingMenu = ({
	titleDesign,
	subTitleDesign,
	additionalDesign,
	showAuthModal,
	setShowAuthModal,
	setShowAllTracks,
	showAllTracks,
	landingTracksList,
	setLandingTracksList,
}) => {
	const axiosPrivate = useAxiosPrivate();
	const { user } = useSelector(state => state.user);
	const { landingInfo, cart } = useSelector(state => state.landing);
	const { jwtToken } = useSelector(state => state.auth);
	const {
		webpagesTypeId,
		tracks,
		id,
		releasePrice,
		showSocialLinks,
		socialLinks,
		socialLinksType,
		bapId,
	} = landingInfo;
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();
	const dispatch = useDispatch();
	const openAuthModal = () => {
		setShowAuthModal(true);
	};
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
	const notAddedTracks = landingTracksList?.filter(el => !el.isSelected);

	const isFullReleaseInCart = cart?.length === landingTracksList?.length;
	const handleBuyAllTracks = async () => {
		if (user?.id && jwtToken) {
			const tracksToAdd = notAddedTracks?.map(el => ({ ...el, isSelected: true }));
			if (!tracksToAdd.length) {
				getToast('info', 'Attention', ' The full release has already been added to the cart.');
				return;
			}
			setIsLoading(true);

			const res = await dispatch(addTracksToCart({ tracks: tracksToAdd, landingPageId: id }));
			if (res?.payload?.success) {
				getToast('success', 'Success', 'The full release has been added to the cart.');
				setLandingTracksList(landingTracksList.map(el => ({ ...el, isSelected: true })));
				setShowAllTracks(false);
			} else {
				getToast('Error', 'Something has gone wrong. Try again later');
			}
			setIsLoading(false);
		} else {
			openAuthModal();
		}
	};
	const handleDownloadTracks = async () => {
		if (user?.id && jwtToken) {
			setIsLoading(true);
			let res;

			if (landingTracksList?.length === 1) {
				res = await downloadOneTrack({
					trackData: landingTracksList[0],
					isFree: true,
					axiosPrivate,
					bapId,
				});
			} else if (landingTracksList.length > 1) {
				const folderName = landingInfo.releaseName;
				const artworkName = landingInfo.releaseName;
				const artwork = landingInfo?.releaseLogo;
				res = await downloadListOfTracks({
					tracks: landingTracksList,
					axiosPrivate,
					folderName,
					artwork,
					artworkName,
					isFree: true,
					bapId,
				});
			}
			if (res?.success) {
				if (
					landingInfo?.facebookPixel &&
					typeof window !== 'undefined' &&
					typeof window?.fbq === 'function'
				) {
					window.fbq('track', 'Download', { quantity: landingTracksList?.length });
				}
				getToast('success', 'Success', '');
			}
			setIsLoading(false);
		} else {
			openAuthModal();
		}
	};
	const downloadBtnText = tracks?.length > 1 ? 'Download all' : 'Download';
	return (
		<>
			<Box bg={subTitleDesign?.hex} p='12px' w='100%' mb='24px' borderRadius='10px'>
				<WebAudioPlayer
					tracks={tracks}
					color={additionalDesign?.hex}
					textColor={titleDesign?.hex}
					fontStyle={subTitleDesign?.italic ? 'italic' : 'initial'}
					isFullTrack={webpagesTypeId === 1}
					textMaxW='calc(100% - 44px)'
				/>

				{webpagesTypeId === 1 && (
					<Flex justify='space-between' align='center' minH='56px'>
						<CustomButton
							styles='main'
							w='200px'
							bgColor={additionalDesign?.hex}
							color={titleDesign?.hex}
							fontStyle={additionalDesign.italic === 'italic' ? 'italic' : 'initial'}
							fontFamily={additionalDesign.font}
							fontWeight={additionalDesign.weight}
							fontSize={additionalDesign.size}
							isSubmiting={isLoading}
							aria-label={'Download individual tracks'}
							onClickHandler={handleDownloadTracks}
							ml='auto'
						>
							{downloadBtnText}
						</CustomButton>
					</Flex>
				)}
				{webpagesTypeId === 2 && !isFullReleaseInCart && (
					<Flex justify='space-between' align='center' minH='56px'>
						<Text
							fontFamily={titleDesign?.font}
							fontWeight='600'
							fontSize='32px'
							fontStyle={titleDesign?.italic ? 'italic' : 'initial'}
							color={titleDesign?.hex}
						>
							£{releasePrice}
						</Text>
						<CustomButton
							styles='main'
							w='200px'
							bgColor={additionalDesign?.hex}
							color={titleDesign?.hex}
							fontStyle={additionalDesign.italic === 'italic' ? 'italic' : 'initial'}
							fontFamily={additionalDesign.font}
							fontWeight={additionalDesign.weight}
							fontSize={additionalDesign.size}
							isSubmiting={isLoading}
							aria-label='Buy individual tracks'
							onClickHandler={handleBuyAllTracks}
							ml='auto'
						>
							Buy full release
						</CustomButton>
					</Flex>
				)}
			</Box>

			<Flex w='100%' flexDir='column' align='center'>
				{tracks?.length > 1 && (
					<Flex
						align='center'
						color={titleDesign?.hex}
						w='100%'
						pos='relative'
						justify='center'
						flexDir='column'
					>
						<Flex
							onClick={() => {
								setShowAllTracks(!showAllTracks);
							}}
							as='button'
							aria-label={`${webpagesTypeId === 1 ? 'Download' : 'Buy'} individual tracks`}
							align='center'
							cursor='pointer'
							color={titleDesign.hex}
						>
							<Text
								fontFamily={subTitleDesign?.font}
								fontWeight={subTitleDesign?.weight}
								fontSize={subTitleDesign?.size}
								fontStyle={subTitleDesign?.italic ? 'italic' : 'initial'}
							>
								{webpagesTypeId === 1 ? 'Download' : 'Buy'} individual tracks
							</Text>
							<Icon
								as={DownIcon}
								ml='10px'
								boxSize='24px'
								transform={showAllTracks ? 'rotate(180deg)' : 'none'}
								transition='0.3s linear'
							/>
						</Flex>
						{showAllTracks && tracks?.length > 0 && (
							<LandingListOfTracks
								landingTracksList={landingTracksList}
								setLandingTracksList={setLandingTracksList}
								titleDesign={titleDesign}
								subTitleDesign={subTitleDesign}
								additionalDesign={additionalDesign}
								showAuthModal={showAuthModal}
								setShowAuthModal={setShowAuthModal}
								setShowAllTracks={setShowAllTracks}
							/>
						)}
					</Flex>
				)}
				<Box mt={showAllTracks ? '24px' : '80px'} w='100%'>
					<SignUpForML
						fontFamily={additionalDesign?.font}
						fontStyle={additionalDesign?.italic ? 'italic' : 'initial'}
						fontWeight={additionalDesign?.weight}
						fontSize={additionalDesign?.size}
						textColor={titleDesign?.hex}
						buttonColor={additionalDesign?.hex}
						openAuthModal={openAuthModal}
						bapId={bapId}
						bapName={landingInfo?.bapName}
					/>
					{showSocialLinks && (
						<Box display={{ base: 'block', lg: 'none' }} mt='24px'>
							<WebPageSocialLinks
								socialLinks={socialLinks}
								socialLinksType={socialLinksType}
								flexDir='raw'
							/>
						</Box>
					)}
				</Box>
			</Flex>
		</>
	);
};

export default LandingMenu;
