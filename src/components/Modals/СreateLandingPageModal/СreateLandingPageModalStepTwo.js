import { useRouter } from 'next/router';

import { Box, Flex, Heading, Icon, Stack, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setLandingTracks } from 'store/landing/landing-slice';
import { getDealsByReleaseId } from 'store/operations';

import BackButton from '@/components/Buttons/BackButton/BackButton';
import NextButton from '@/components/Buttons/NextButton/NextButton';
import ContainerLoader from '@/components/Loaders/ContainerLoader';
import ProgressLine from '@/components/ProgressLine/ProgressLine';

import CheckedRadioButtonIcon from '@/assets/icons/modal/checkedRadioButton.svg';
import RadioButtonIcon from '@/assets/icons/modal/radioButton.svg';

import CustomModal from '../CustomModal';

const СreateLandingPageModalStepTwo = ({ closeModal, openStepOneModal }) => {
	const { selectedRelease, selectedBap, isLoading, user } = useSelector(state => state.user);
	const toast = useToast();
	const [path, setPath] = useState('create-download-landing');
	const { pathname, push } = useRouter();
	const isWebPages = pathname.includes('/web-pages');
	const isReleasePage = pathname.includes('/releases');
	const [isDisabled, setIsDisabled] = useState(false);
	const [isPushing, setIsPushing] = useState(false);
	const dispatch = useDispatch();
	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'info',
			duration: 5000,
			isClosable: true,
		});
	};
	const handleNext = async () => {
		setIsPushing(true);
		if (isWebPages) {
			await push({
				pathname: `/bap/[bapId]/web-pages/[releaseId]/${path}`,
				query: { bapId: selectedBap?.bapId, releaseId: selectedRelease?.id },
			});
		} else {
			await push({
				pathname: `/bap/[bapId]/releases/[releaseId]/${path}`,
				query: { bapId: selectedBap?.bapId, releaseId: selectedRelease?.id },
			});
		}
		setIsPushing(false);
	};
	const chooseLanding = async landingType => {
		const releaseTracks = selectedRelease.checkedTracks;
		const isErrorTrack = releaseTracks.find(el => el.error);
		if (releaseTracks?.length === 0) {
			getToast('Error', 'There are no tracks in the current release.');
			return;
		}
		if (isErrorTrack?.length > 0) {
			getToast('Error', 'There are tracks with errors in the current release. Please check it.');
			return;
		}

		if (landingType === 'create-sell-landing') {
			const isTracksWithPrice = releaseTracks?.every(track => track.price > 0);
			if (
				!isTracksWithPrice ||
				!selectedRelease?.releasePrice ||
				selectedRelease?.releasePrice === 0
			) {
				getToast(
					'Error',
					"You can't choose this type of landing page. You need to set the price for all the tracks contained in this release.",
				);
				return;
			}

			const tracksInDeals = selectedRelease?.splitsAndContracts
				.filter(el => el.status === 1)
				.map(el => el.splitTracks)
				.flat();
			if (tracksInDeals?.length > 0) {
				const landingTracks = [];
				tracksInDeals.forEach(el => {
					const trackToLanding = releaseTracks.find(releaseTrack => releaseTrack.id === el.trackId);
					if (trackToLanding) {
						landingTracks.push(trackToLanding);
					}
				});

				const difference = selectedRelease?.checkedTracks?.length - tracksInDeals.length;
				if (difference) {
					const description =
						difference > 1
							? 'Some of tracks in the release are without split or active contract. Those tracks are not available to sell in landing page'
							: 'One track in the release is without split or active contract. This track is not available to sell in landing page';
					getToast('Error', description);
					return;
				}
				dispatch(setLandingTracks(landingTracks));
				setIsDisabled(false);
			} else {
				getToast(
					'Error',
					'There are no tracks available to sell in this landing page. All tracks must have either splits or an active contract first.',
				);
				return;
			}
		} else if (landingType === 'create-download-landing') {
			dispatch(setLandingTracks(releaseTracks));
			setIsDisabled(false);
		}
		setPath(landingType);
	};

	useEffect(() => {
		if (!isReleasePage) {
			const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
			dispatch(
				getDealsByReleaseId({ releaseId: selectedRelease?.id, userId: user.id, creatorOrAdmin }),
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedRelease?.id]);

	useEffect(() => {
		if (selectedRelease?.checkedTracks) {
			dispatch(setLandingTracks(selectedRelease.checkedTracks));
		}
	}, [dispatch, selectedRelease.checkedTracks]);

	useEffect(() => {
		if (selectedRelease.checkedTracks?.length === 0) {
			setIsDisabled(true);
		}
	}, [selectedRelease.checkedTracks?.length]);
	return (
		<CustomModal closeModal={closeModal} maxW='594px' maxH='90vh' w='80vw' p='40px 26px 40px 40px'>
			{isLoading ? (
				<ContainerLoader h='514px' />
			) : (
				<>
					<Box pr='14px'>
						<Heading as='h3' fontSize='32px' fontWeight='600' lineHeight='1.5'>
							Create a landing page
						</Heading>
						{isWebPages && (
							<Flex mt='16px' gap='4px'>
								<ProgressLine n={0} currentStep={2} />
								<ProgressLine n={1} currentStep={2} />
							</Flex>
						)}

						<Box mt='24px'>
							<Text fontSize='18px' fontWeight='500' color='black' mb='8px'>
								{isWebPages && '2.'}Choose type of landing
							</Text>
							<Text fontSize='16px' fontWeight='400' color='secondary'>
								Choose the type of landing page for your release
							</Text>
						</Box>
					</Box>
					<Stack mt='24px' overflowY='scroll' maxH='calc(90vh - 339px)' pr='8px'>
						<Flex
							onClick={() => {
								chooseLanding('create-download-landing');
							}}
							px='12px'
							py='10px'
							border='1px solid'
							borderColor='stroke'
							borderRadius='10px'
							cursor='pointer'
						>
							{path === 'create-download-landing' ? (
								<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
							) : (
								<Icon as={RadioButtonIcon} boxSize='24px' />
							)}

							<Box ml='12px'>
								<Heading mb='8px' fontSize='16px' fontWeight='500' lineHeight='1.5' color='black'>
									Free download
								</Heading>
								<Text fontSize='14px' fontWeight='400' color='secondary'>
									Landing page with the ability to download your release for free
								</Text>
							</Box>
						</Flex>
						<Flex
							onClick={() => {
								chooseLanding('create-sell-landing');
							}}
							px='12px'
							py='10px'
							border='1px solid'
							borderColor='stroke'
							borderRadius='10px'
							cursor='pointer'
						>
							{path === 'create-sell-landing' ? (
								<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
							) : (
								<Icon as={RadioButtonIcon} boxSize='24px' />
							)}
							<Box ml='12px'>
								<Heading mb='8px' fontSize='16px' fontWeight='500' lineHeight='1.5' color='black'>
									Sell this release
								</Heading>
								<Text fontSize='14px' fontWeight='400' color='secondary'>
									Landing page where you can sell your release
								</Text>
							</Box>
						</Flex>
						<Flex
							onClick={() => {
								setIsDisabled(false);
								setPath('create-streaming-landing');
							}}
							px='12px'
							py='10px'
							border='1px solid'
							borderColor='stroke'
							borderRadius='10px'
							cursor='pointer'
						>
							{path === 'create-streaming-landing' ? (
								<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
							) : (
								<Icon as={RadioButtonIcon} boxSize='24px' />
							)}
							<Box ml='12px'>
								<Heading mb='8px' fontSize='16px' fontWeight='500' lineHeight='1.5' color='black'>
									Streaming links
								</Heading>
								<Text fontSize='14px' fontWeight='400' color='secondary'>
									Landing page where you can place links to the release on streaming services
								</Text>
							</Box>
						</Flex>
					</Stack>
					<Flex mt='24px' justify='space-between'>
						{isWebPages && <BackButton title='Back' onClickHandler={openStepOneModal} />}
						<NextButton
							onClickHandler={handleNext}
							ml='auto'
							styles={isDisabled ? 'disabled' : 'main'}
							isSubmiting={isPushing}
						/>
					</Flex>
				</>
			)}
		</CustomModal>
	);
};

export default СreateLandingPageModalStepTwo;
