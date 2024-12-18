import { useRouter } from 'next/router';

import { Box, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { eventGA, pageviewGA } from 'src/functions/utils/googleAnalytics/ga';
import getDesign from 'src/functions/utils/web-pages/landing/getDesign';
import { getCartTracks } from 'store/landing/landing-operations';
import { setLandingInfo } from 'store/landing/landing-slice';
import { getUserInfo } from 'store/operations';

import StreamingLandingSreenContent from '@/components/CreateWebPages/CreateOrEditLanding/LandingScreenContent/StreamingLandingScreenContent';
import SignUpForML from '@/components/CreateWebPages/components/SignUpForML/SignUpForML';
import SocialLayout from '@/components/Layouts/SocialLayout';
import FullPageLoader from '@/components/Loaders/FullPageLoader';
import CustomerAuthModal from '@/components/Modals/CustomerAuthModal';
import WebPageSocialLinks from '@/components/WebPageSocialLinks/WebPageSocialLinks';

import LandingLayout from './components/LandingLayout/LandingLayout';
import LandingMenu from './components/LandingMenu/LandingMenu';

const LandingPage = ({ landingInfo }) => {
	const { user } = useSelector(state => state.user);
	const {
		webpagesTypeId,
		id,
		tracks,
		streamingLinks,
		showSocialLinks,
		socialLinks,
		socialLinksType,
	} = landingInfo;
	const { isLoggedIn, jwtToken } = useSelector(state => state.auth);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const { titleDesign, subTitleDesign, additionalDesign } = getDesign(landingInfo?.design);

	const [showAuthModal, setShowAuthModal] = useState(false);
	const [showAllTracks, setShowAllTracks] = useState(false);
	const [landingTracksList, setLandingTracksList] = useState([]);

	const { push, pathname } = useRouter();
	const toast = useToast();
	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 5000,
			isClosable: true,
		});
	};
	// useEffect(() => {
	// 	console.log('useEffect========');
	// 	const getLandingTracks = async () => {
	// 		if (landingInfo?.tracks.length === 0) {
	// 			getToast('Error', 'There are no available tracks in current landing page');
	// 			push('/404');
	// 		}
	// 		setIsLoading(true);
	// 		const splitsAndContracts = await getDealsByReleaseIdWithoutThunk({
	// 			releaseId: landingInfo?.releaseId,
	// 		});
	// 		const tracksInDeals = splitsAndContracts
	// 			.filter(el => el.status === 1)
	// 			.map(el => el.splitTracks)
	// 			.flat();

	// 		if (tracksInDeals?.length > 0) {
	// 			const landingTracks = [];
	// 			tracksInDeals.forEach(el => {
	// 				const trackToLanding = landingInfo?.tracks?.find(
	// 					releaseTrack => releaseTrack.id === el.trackId,
	// 				);
	// 				if (trackToLanding) {
	// 					landingTracks.push(trackToLanding);
	// 				}
	// 			});
	// 			setLandingTracksList(landingTracks);
	// 			dispatch(setLandingInfo({ ...landingInfo, tracks: landingTracks }));
	// 		} else {
	// 			getToast('Error', 'There are no available tracks in current landing page');
	// 			push('/404');
	// 		}
	// 		setIsLoading(false);
	// 	};
	// 	console.log('webpagesTypeId === 2: ', webpagesTypeId === 2);
	// 	if (webpagesTypeId === 2) {
	// 		getLandingTracks();
	// 	} else {
	// 		console.log('TESTTTTTTTTTT');
	// 		setLandingTracksList(landingInfo.tracks);
	// 		dispatch(setLandingInfo(landingInfo));
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [dispatch, landingInfo]);

	useEffect(() => {
		setLandingTracksList(landingInfo.tracks);
		dispatch(setLandingInfo(landingInfo));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (user?.id && jwtToken && isLoggedIn && id && webpagesTypeId === 2) {
			const handleGetCartTracks = async () => {
				const tracksInCart = await dispatch(getCartTracks(id));
				if (tracksInCart?.payload?.length > 0) {
					const updatedAllTracks = tracks.map(track => {
						const foundTrack = tracksInCart?.payload.find(trackInCart => trackInCart.id === track.id);
						if (foundTrack) {
							return { ...track, isSelected: true };
						}
						return track;
					});
					setLandingTracksList(updatedAllTracks);
				}
			};
			handleGetCartTracks();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, id, jwtToken, isLoggedIn, user?.id, webpagesTypeId]);

	useEffect(() => {
		function handleClick() {
			eventGA('click', {
				event_category: landingInfo.bapId,
				value: 1,
			});
		}
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (pathname) {
			pageviewGA(pathname);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (jwtToken && !isLoggedIn) {
			dispatch(getUserInfo());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwtToken, isLoggedIn]);

	const openAuthModal = () => {
		setShowAuthModal(true);
	};

	const isLoader = isLoading || !landingInfo?.id;

	return (
		<SocialLayout setShowAuthModal={setShowAuthModal}>
			{isLoader ? (
				<FullPageLoader />
			) : (
				<Box
					h='100vh'
					overflowY={'scroll'}
					css={{
						'&::-webkit-scrollbar-thumb': {
							backgroundColor: additionalDesign?.hex,
						},
					}}
				>
					<LandingLayout
						titleDesign={titleDesign}
						subTitleDesign={subTitleDesign}
						additionalDesign={additionalDesign}
						setShowAuthModal={setShowAuthModal}
						setShowAllTracks={setShowAllTracks}
						setLandingTracksList={setLandingTracksList}
					>
						{webpagesTypeId === 3 ? (
							<>
								<StreamingLandingSreenContent
									mb='88px'
									streamingLinks={streamingLinks}
									borderColor={additionalDesign?.hex}
								/>
								<SignUpForML
									fontFamily={additionalDesign.font}
									fontStyle={additionalDesign.italic ? 'italic' : 'initial'}
									fontWeight={additionalDesign.weight}
									fontSize={additionalDesign.size}
									textColor={titleDesign.hex}
									buttonColor={additionalDesign.hex}
									openAuthModal={openAuthModal}
									bapId={landingInfo?.bapId}
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
							</>
						) : (
							<LandingMenu
								titleDesign={titleDesign}
								subTitleDesign={subTitleDesign}
								additionalDesign={additionalDesign}
								showAuthModal={showAuthModal}
								setShowAuthModal={setShowAuthModal}
								showAllTracks={showAllTracks}
								setShowAllTracks={setShowAllTracks}
								landingTracksList={landingTracksList}
								setLandingTracksList={setLandingTracksList}
							/>
						)}
					</LandingLayout>
				</Box>
			)}

			{showAuthModal && (
				<CustomerAuthModal
					btnBgColor={additionalDesign?.hex}
					btnTextColor={titleDesign?.hex}
					setIsModal={setShowAuthModal}
				/>
			)}
		</SocialLayout>
	);
};

export default LandingPage;
