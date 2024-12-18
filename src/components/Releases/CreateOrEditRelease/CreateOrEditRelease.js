import { Box, Flex, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	getDealsByReleaseId,
	getLandingPagesByReleaseId,
	getShopsByBapId,
	getTracksToReleaseWithArtistLogo,
} from 'store/operations';
import { setArtwork, setReleaseSelectedMenu } from 'store/slice';

import CreateContractOrSplit from '@/components/CreateContractOrSplit/CreateContractOrSplit';
import ContainerLoader from '@/components/Loaders/ContainerLoader';

import AddCreditsMenu from '../Menus/AddCreditsMenu/AddCreditsMenu';
import AddNameMenu from '../Menus/AddNameMenu/AddNameMenu';
import AddSplitsMenu from '../Menus/AddSplitsMenu/AddSplitsMenu';
import AddTracksMenu from '../Menus/AddTracksMenu/AddTracksMenu';
import DistributeMenu from '../Menus/DistributeMenu/DistributeMenu';
import SellDirectMenu from '../Menus/SellDirectMenu/SellDirectMenu';
import WebPagesMenu from '../Menus/WebPagesMenu/WebPagesMenu';
import ReleaseReview from '../ReleaseReview/ReleaseReview';
import ReleaseSidebar from '../ReleaseSidebar/ReleaseSideBar';

const CreateOrEditRelease = ({ setIsStartPage, newRelease = false }) => {
	const [withContract, setWithContract] = useState(true);
	const { selectedRelease, releaseSelectedMenu, releaseScreen, user, selectedBap } = useSelector(
		state => state.user,
	);
	const {
		id,
		name,
		type,
		splitsAndContracts,
		landingPages,
		shops,
		checkedTracks,
		totalTracks,
		releasePrice,
	} = selectedRelease;
	const isTracks = checkedTracks?.length > 0;

	const isSpotifyRelease = Boolean(selectedRelease?.releaseSpotifyId);
	const tracksWithErrors = [];
	const tracksNoErrors = [];
	let artistWithoutCountry = 0;

	if (isTracks) {
		checkedTracks.forEach(el => {
			if (el.error) {
				tracksWithErrors.push(el);
			} else {
				tracksNoErrors.push(el);
			}
		});

		checkedTracks
			.map(el => el.featureArtists)
			.flat()
			.forEach(el => {
				if (!el?.country) {
					artistWithoutCountry += 1;
				}
			});
	}
	const isErrorInTrack = tracksWithErrors.length > 0;

	const isFirstMenuValid = id && name && type;
	const isTracksAndNoErrors =
		isFirstMenuValid && isTracks && !isErrorInTrack && !selectedRelease.isDuplicate;
	const isTrackMenuValid = isSpotifyRelease
		? isTracksAndNoErrors && +totalTracks === tracksNoErrors?.length
		: isTracksAndNoErrors;

	const tracksInDeals = splitsAndContracts
		?.filter(el => el.status === 1)
		?.map(el => {
			const tracks = el.splitTracks.map(track => ({ ...track, splitUsers: el.splitUsers }));
			return tracks;
		})
		.flat();
	const isDealsMenuValid = isTrackMenuValid && tracksInDeals?.length >= checkedTracks?.length;

	const getCreditMenuStatus = () => {
		if (!isDealsMenuValid) return false;
		let isValid = true;
		tracksInDeals.forEach(track => {
			track.splitUsers.forEach(splitUser => {
				const userId = splitUser.userId;
				const foundCredit = track.credits.find(credit => credit.userId === userId);
				if (!foundCredit) {
					isValid = false;
					return;
				}
			});

			if (!isValid) return;
		});
		return isValid;
	};
	const isCreditMenuValid = getCreditMenuStatus();

	const isDealsMenu = isTrackMenuValid || splitsAndContracts?.length > 0;

	const landingPagesWithoutStreaming = landingPages?.filter(el => el.webpagesTypeId !== 3);
	const isWebpages = landingPages?.length > 0 || shops?.length > 0;
	const isNotValidDealsOrCredits = !isDealsMenuValid || !isCreditMenuValid;
	const isWebpagesMenuValid =
		isSpotifyRelease && isNotValidDealsOrCredits
			? landingPagesWithoutStreaming?.length > 0
			: isWebpages;
	const isPriceMenuValid = Boolean(
		releasePrice && isTracks && checkedTracks?.every(track => track?.price > 0),
	);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!newRelease && id) {
			dispatch(getTracksToReleaseWithArtistLogo(id));
			dispatch(getLandingPagesByReleaseId(id));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	useEffect(() => {
		if (!newRelease && id && selectedBap?.bapMembers) {
			const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
			dispatch(getDealsByReleaseId({ releaseId: id, userId: user.id, creatorOrAdmin }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, selectedBap?.bapMembers]);

	useEffect(() => {
		if (!newRelease && isDealsMenuValid && selectedBap?.bapId) {
			dispatch(getShopsByBapId(selectedBap?.bapId));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDealsMenuValid, selectedBap?.bapId]);

	// useEffect(() => {
	// 	if (selectedRelease.splitsAndContracts?.length > 0) {
	// 		const usersInActiveDeals = selectedRelease.splitsAndContracts
	// 			.filter(el => el.status === 1)
	// 			.map(el => el.splitUsers)
	// 			.flat();

	// 		const userIds = [...new Set(usersInActiveDeals.map(user => user.userId))];
	// 		if (userIds?.length > 0) {
	// 			dispatch(getUsersForDistribute({ userIds, currentUserId: user.id }));
	// 		}
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [dispatch, selectedRelease.splitsAndContracts, user.id]);

	const toast = useToast();
	const getToast = (description, title = 'Not available') => {
		toast({
			position: 'top',
			title,
			description,
			status: 'error',
			duration: 5000,
			isClosable: true,
		});
	};
	const handleSelectMenu = n => {
		const notFirstOrSecondMenu = n !== 1 && n !== 2;
		if (n === 1) {
			dispatch(setReleaseSelectedMenu(n));
		} else if (n === 2 && (!id || !name || !type)) {
			getToast('You need to add the name, type and artwork for this release before you create it.');
		} else if (notFirstOrSecondMenu && (!id || !name || !type)) {
			getToast('You need to add the name, type and artwork for this release and then add tracks.');
		} else if (notFirstOrSecondMenu && !isSpotifyRelease && checkedTracks?.length < 1) {
			getToast('You need to start by adding tracks to this release.');
		} else if (notFirstOrSecondMenu && isErrorInTrack) {
			getToast('Please check tracks', 'There are errors');
			dispatch(setReleaseSelectedMenu(2));
		} else if (notFirstOrSecondMenu && artistWithoutCountry) {
			getToast(
				`The country is missing for ${artistWithoutCountry} featured ${
					artistWithoutCountry > 1 ? 'artists' : 'artist'
				}.`,
				'Country of origin is required for every featured artist.',
			);
			dispatch(setReleaseSelectedMenu(2));
		} else if (n === 5 && !isCreditMenuValid) {
			getToast('Credits are required for all participants in the splits/contracts of each track.');
		} else {
			dispatch(setReleaseSelectedMenu(n));
		}
	};

	useEffect(() => {
		if (selectedRelease.logo) {
			const getImageSize = async () => {
				try {
					const response = await fetch(selectedRelease.logo);
					const blob = await response.blob();
					const fileSizeInKB = Math.ceil(blob.size / 1024);
					const image = new Image();
					image.src = selectedRelease.logo;
					image.onload = () => {
						const error =
							image.width < 1400 || image.width > 4000 || fileSizeInKB < 100 || fileSizeInKB > 10240;

						dispatch(setArtwork({ error, size: image.width, weight: fileSizeInKB }));
					};
				} catch (error) {
					console.error('getImageSize error:', error);
				}
			};
			getImageSize();
		}
	}, [dispatch, selectedRelease.logo]);

	return (
		<>
			{releaseScreen === 'create-contract' && (
				<CreateContractOrSplit withContract={withContract} setWithContract={setWithContract} />
			)}

			{releaseScreen === 'review' && <ReleaseReview />}

			{releaseScreen === 'main' && (
				<Flex px='24px' bg='bg.main' borderRadius='10px' w='100%' h='100%' flexDir='column'>
					<Flex flex={1}>
						{!selectedRelease?.id || (checkedTracks && splitsAndContracts) ? (
							<>
								<ReleaseSidebar
									handleSelectMenu={handleSelectMenu}
									isSpotifyRelease={isSpotifyRelease}
									isFirstMenuValid={isFirstMenuValid}
									isPriceMenuValid={isPriceMenuValid}
									isTrackMenuValid={isTrackMenuValid}
									isDealsMenuValid={isDealsMenuValid}
									isDealsMenu={isDealsMenu}
									isCreditMenuValid={isCreditMenuValid}
									isWebpagesMenuValid={isWebpagesMenuValid}
								/>
								<Box
									pos='relative'
									w='100%'
									bgColor='bg.main'
									pt='75px'
									pb='24px'
									pl='24px'
									maxW='calc(100% - 240px)'
								>
									{releaseSelectedMenu === 1 && <AddNameMenu handleSelectMenu={handleSelectMenu} />}

									{releaseSelectedMenu === 2 && (
										<AddTracksMenu
											isTrackMenuValid={isTrackMenuValid}
											artistWithoutCountry={artistWithoutCountry}
										/>
									)}

									{releaseSelectedMenu === 3 && (
										<AddSplitsMenu
											setWithContract={setWithContract}
											withContract={withContract}
											isDealsMenuValid={isDealsMenuValid}
										/>
									)}
									{releaseSelectedMenu === 4 && <AddCreditsMenu isCreditMenuValid={isCreditMenuValid} />}
									{releaseSelectedMenu === 5 && <DistributeMenu />}
									{releaseSelectedMenu === 6 && <SellDirectMenu />}
									{releaseSelectedMenu === 7 && (
										<WebPagesMenu setIsStartPage={setIsStartPage} isDealsMenuValid={isDealsMenuValid} />
									)}

									{/* {releaseSelectedMenu === 7 && <PressMenu />} */}
								</Box>
							</>
						) : (
							<ContainerLoader />
						)}
					</Flex>
				</Flex>
			)}
		</>
	);
};

export default CreateOrEditRelease;
