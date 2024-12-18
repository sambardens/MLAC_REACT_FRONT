import { useRouter } from 'next/router';

import { Box, Flex, Grid, Heading, Icon, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getBrandInfoRequest from 'src/functions/serverRequests/brandKit/getBrandInfoRequest';
import addDesignToLanding from 'src/functions/serverRequests/landing/addDesignToLanding';
import addSocialLinksToLanding from 'src/functions/serverRequests/landing/addSocialLinksToLanding';
import addStreamingLinksToLandings from 'src/functions/serverRequests/landing/addStreamingLinksToLandings';
import compareArrays from 'src/functions/utils/compareArrays';
import compareArraysOfObjects from 'src/functions/utils/compareArraysOfObjects';
import compareObjects from 'src/functions/utils/compareObjects';
import getImageSrc from 'src/functions/utils/getImageSrc';
import getLandingFonts from 'src/functions/utils/web-pages/landing/getLandingFonts';
import transformFontsToDesignObj from 'src/functions/utils/web-pages/landing/transformFontsToDesignObj';
import { getBapSocialLinks } from 'store/links/links-operations';
import {
	createLandingPage,
	editLandingPage,
	getDealsByReleaseId,
	getReleaseLinks,
	getTracksToReleaseWithArtistLogo,
} from 'store/operations';
import { setLandingPage, setReleaseScreen, setReleaseSelectedMenu } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';
import ContainerLoader from '@/components/Loaders/ContainerLoader';

import DownIcon from '@/assets/icons/base/down.svg';

import getLangindPalette from '../../../functions/utils/web-pages/landing/getLandingPalette';
import CreateWebPageSocialLinks from '../components/CreateWebPageSocialLinks/CreateWebPageSocialLinks';

import DownloadLandingSreenContent from './LandingScreenContent/DownloadLandingSreenContent';
import SellLandingScreenContent from './LandingScreenContent/SellLandingSreenContent';
import StreamingLandingSreenContent from './LandingScreenContent/StreamingLandingScreenContent';
import LandingScreenLayout from './LandingScreenLayout/LandingScreenLayout';
import BasicSettings from './LandingSteps/BasicSetting';
import CreateWebPageLinks from './LandingSteps/CreateWebPageLinks';
import StepsMenu from './LandingSteps/StepsMenu';
import Tracking from './LandingSteps/Tracking';

const majorLablTheme = {
	paletteName: 'Major Labl theme',
	id: 0,
	designBlocks: [
		{
			hex: '#FFFFFF',
			font: 'Poppins',
			size: 32,
			weight: 600,
			italic: '',
			landingDesignTypeId: 1,
		},
		{
			hex: '#282727',
			font: 'Poppins',
			size: 18,
			weight: 500,
			italic: '',
			landingDesignTypeId: 2,
		},
		{
			hex: '#FF0151',
			font: 'Poppins',
			size: 14,
			weight: 400,
			italic: '',
			landingDesignTypeId: 3,
		},
	],
};

const CreateOrEditLanding = () => {
	const dispatch = useDispatch();
	const { selectedRelease, selectedLandingPage, selectedBap, user } = useSelector(
		state => state.user,
	);
	const { landingInfo } = useSelector(state => state.landing);

	const { pathname, push, back } = useRouter();
	const isWebPages = pathname.includes('/web-pages');
	const isNew = pathname.includes('create');

	const initialTrackingData = {
		facebookPixel: isNew && selectedBap.facebookPixel ? selectedBap.facebookPixel : '',
		metaTitle: '',
		metaDescription: isNew && selectedBap.bapDescription ? selectedBap.bapDescription : '',
	};
	const [isBrandKitLoaded, setIsBrandKitLoaded] = useState(false);
	const [tracks, setTracks] = useState(null);

	const webpagesTypeId = selectedLandingPage?.webpagesTypeId;
	const isStreaming = webpagesTypeId === 3;
	const [currentStep, setCurrentStep] = useState(0);
	const [linkName, setLinkName] = useState('');
	const [link, setLink] = useState('');
	const [trackingData, setTrackingData] = useState(initialTrackingData);
	const { facebookPixel, metaTitle, metaDescription } = trackingData;
	const [logoSrc, setLogoSrc] = useState(null);
	const [logoCanvaSrc, setLogoCanvaSrc] = useState(null);
	const [logoFile, setLogoFile] = useState(null);

	const [faviconSrc, setFaviconSrc] = useState(null);
	const [faviconCanvaSrc, setFaviconCanvaSrc] = useState(null);
	const [faviconFile, setFaviconFile] = useState(null);
	const [blur, setBlur] = useState(null);
	// ------------------ social links ---------------------

	const [showSocialLinks, setShowSocialLinks] = useState(true);
	const [socialLinksType, setSocialLinksType] = useState('colour');
	const [initialSocialLinks, setInitialSocialLinks] = useState([]);
	const [socialLinks, setSocialLinks] = useState([]);
	const [validSocialLinks, setValidSocialLinks] = useState([]);
	const [invalidSocialLinks, setInvalidSocialLinks] = useState([]);
	// ------------------ streaming links ---------------------

	const [streamingTrack, setStreamingTrack] = useState(null);

	const [isLandingForTrack, setIsLandingForTrack] = useState(false);
	const [streamingTracks, setStreamingTracks] = useState([]);
	const [initialStreamingLinks, setInitialStreamingLinks] = useState([]);
	const [streamingLinks, setStreamingLinks] = useState([]);
	const [validStreamingLinks, setValidStreamingLinks] = useState([]);
	const [invalidStreamingLinks, setInvalidStreamingLinks] = useState([]);

	// ------------------ pallete - fonts ---------------------
	const [selectedDesign, setSelectedDesign] = useState(majorLablTheme);
	const [oldFonts, setOldFonts] = useState(() => getLandingFonts(selectedDesign));
	const [fonts, setFonts] = useState(() => getLandingFonts(selectedDesign));
	const [paletteArr, setPalleteArr] = useState(() => [getLangindPalette(majorLablTheme)]);
	//--------------------------------------------------------

	const toast = useToast();
	const [tracksInCart, setTracksInCart] = useState([]);
	const [isAllTracks, setIsAllTracks] = useState(false);
	const [isSubmiting, setIsSubmiting] = useState(false);

	const verb = isNew ? 'Create' : 'Edit';
	const title =
		webpagesTypeId === 1
			? `${verb} a download landing page`
			: webpagesTypeId === 2
			? `${verb} a sell landing page`
			: `${verb} a landing page with streaming links`;

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

	const handleAddTrackLinks = track => {
		let newLinks;
		if (track.link) {
			const streamingPlatforms = [
				'spotify',
				'applemusic',
				'deezer',
				'youtubemusic',
				'youtube',
				'tidal',
				'napster',
			];
			newLinks = streamingPlatforms.map((platform, i) => ({
				link: `${track.link}?${platform}`,

				pos: i + 1,
				id: i + 1,
			}));
		} else if (track?.spotifyLink) {
			newLinks = [
				{
					link: track?.spotifyLink,
					pos: 1,
					id: 1,
				},
			];
		}
		if (!newLinks) return;
		setStreamingLinks(newLinks);
		setValidStreamingLinks(newLinks);
		setStreamingTrack(track);
	};
	const handlePush = () => {
		if (isWebPages) {
			push({
				pathname: '/bap/[bapId]/web-pages',
				query: { bapId: selectedBap.bapId },
			}).then(() => {
				setIsSubmiting(false);
				dispatch(setLandingPage(null));
			});
		} else {
			dispatch(setReleaseSelectedMenu(7));
			dispatch(setReleaseScreen('main'));
			push({
				pathname: '/bap/[bapId]/releases/[releaseId]',
				query: { bapId: selectedBap.bapId, releaseId: selectedRelease?.id },
			}).then(() => {
				setIsSubmiting(false);
				dispatch(setLandingPage(null));
			});
		}
	};

	const handlePublish = async () => {
		if (isStreaming) {
			if (invalidStreamingLinks.length > 0) {
				getToast('Error', 'You have entered an invalid streaming link.');
				setCurrentStep(1);
				return;
			} else if (validStreamingLinks.length < 1) {
				getToast('Error', 'You must add a streaming link.');
				setCurrentStep(1);
				return;
			}
		}
		if (showSocialLinks && invalidSocialLinks.length > 0) {
			getToast('Error', 'You have entered an invalid social link.');
			setCurrentStep(1);
			return;
		}
		const isValidFbPixel = facebookPixel?.length === 0 || facebookPixel?.length === 15;
		if (!isValidFbPixel) {
			getToast('Error', 'You have entered an invalid Facebook Pixel number.');
			setCurrentStep(2);
			return;
		}
		if (linkName) {
			setIsSubmiting(true);
			const landingData = new FormData();
			landingData.append('name', linkName);
			faviconFile && landingData.append('favicon', faviconFile);

			faviconCanvaSrc && landingData.append('urlFavicon', faviconCanvaSrc);
			logoFile && landingData.append('logo', logoFile);

			logoCanvaSrc && landingData.append('urlLogo', logoCanvaSrc);
			landingData.append('facebookPixel', facebookPixel || '');
			landingData.append('metaDescription', metaTitle || '');
			landingData.append('metaTitle', metaDescription || '');
			landingData.append('backgroundBlur', blur);
			landingData.append('webpagesTypeId', webpagesTypeId);
			landingData.append('showSocialLinks', showSocialLinks);
			landingData.append('socialLinksType', socialLinksType);
			if (isStreaming && isLandingForTrack && streamingTrack?.id) {
				landingData.append('trackIdForStreaming', streamingTrack?.id);
			}

			const res = await dispatch(createLandingPage({ landingData, releaseId: selectedRelease?.id }));

			if (res?.payload?.success) {
				const promises = [];

				const isNewFonts = compareObjects(oldFonts, fonts);

				if (selectedDesign.id !== 0 || isNewFonts) {
					promises.push(
						addDesignToLanding({
							designBlocks: selectedDesign.designBlocks.map(el => ({ ...el, italic: el.italic ? 1 : 0 })),
							landingPageId: res?.payload?.landingPage.id,
						}),
					);
				}
				if (isStreaming) {
					const streamingData = validStreamingLinks.map((el, i) => ({
						link: el.link,
						position: i + 1,
					}));
					promises.push(
						addStreamingLinksToLandings({
							landingPageId: res?.payload?.landingPage.id,
							data: streamingData,
						}),
					);
				}
				if (showSocialLinks && validSocialLinks.length > 0) {
					const socialData = validSocialLinks.map((el, i) => ({ link: el.link, position: i + 1 }));
					promises.push(
						addSocialLinksToLanding({
							landingPageId: res?.payload?.landingPage.id,
							data: socialData,
						}),
					);
				}
				let isError = false;
				await Promise.allSettled(promises).then(results => {
					results.forEach(result => {
						if (result?.status === 'rejected') {
							isError = true;
						}
					});
				});

				if (isError) {
					getToast(
						'Error',
						'Something going wrong, Landing page has been created, but some information have not been saved',
					);
				} else {
					getToast('Success', 'Landing page has been created');
				}

				handlePush();
			} else {
				getToast('Error', res?.payload?.error || 'Landing page has not been created. Try again later');
				setIsSubmiting(false);
			}
		} else {
			getToast('Error', 'You must provide a link name.');
			setCurrentStep(0);
		}
	};

	const isNewLink = linkName && selectedLandingPage?.name !== linkName;
	const isNewBlur = selectedLandingPage?.backgroundBlur !== blur;
	const isNewFacebookPixel = facebookPixel !== selectedLandingPage?.facebookPixel;
	const isNewMetaTitle = metaTitle !== selectedLandingPage?.metaTitle;
	const isNewMetaDescription = metaDescription !== selectedLandingPage?.metaDescription;
	const isNewSocialLinksType =
		selectedLandingPage?.socialLinksType && socialLinksType !== selectedLandingPage?.socialLinksType;

	const isNewSocialLinksVisionStatus = showSocialLinks !== selectedLandingPage?.showSocialLinks;
	const isNewStreamingTrack =
		isStreaming &&
		(streamingTrack?.id || null) !== (selectedLandingPage?.trackIdForStreaming || null);

	const isNewData =
		isNewLink ||
		faviconFile ||
		faviconCanvaSrc ||
		logoFile ||
		logoCanvaSrc ||
		isNewBlur ||
		isNewMetaTitle ||
		isNewMetaDescription ||
		isNewFacebookPixel ||
		isNewSocialLinksType ||
		isNewSocialLinksVisionStatus ||
		isNewStreamingTrack;

	const isNewStreamingLinks =
		isStreaming && compareArraysOfObjects(initialStreamingLinks, validStreamingLinks);

	const isNewSocialLinks =
		showSocialLinks && compareArraysOfObjects(initialSocialLinks, validSocialLinks);
	const isNewLinks = isNewStreamingLinks || isNewSocialLinks;

	const isNewDesign =
		selectedLandingPage?.design &&
		(selectedLandingPage.design?.length === 3
			? compareArraysOfObjects(selectedDesign.designBlocks, selectedLandingPage?.design)
			: compareArraysOfObjects(selectedDesign.designBlocks, majorLablTheme.designBlocks));

	const isEditAvailable =
		selectedLandingPage?.id && isBrandKitLoaded && (isNewData || isNewDesign || isNewLinks);

	const handleEdit = async () => {
		if (isStreaming) {
			if (invalidStreamingLinks.length > 0) {
				getToast('Error', 'You have entered an invalid streaming link.');
				setCurrentStep(1);
				return;
			} else if (validStreamingLinks.length < 1) {
				getToast('Error', 'You must add a streaming link.');
				setCurrentStep(1);
				return;
			}
		}
		if (showSocialLinks && invalidSocialLinks.length > 0) {
			getToast('Error', 'You have entered an invalid social link.');
			setCurrentStep(1);
			return;
		}

		const isValidFbPixel = facebookPixel?.length === 0 || facebookPixel?.length === 15;
		if (!isValidFbPixel) {
			getToast('Error', 'You have entered an invalid Facebook Pixel number.');
			setCurrentStep(2);
			return;
		}

		setIsSubmiting(true);

		if (isNewData) {
			const landingData = new FormData();
			isNewLink && landingData.append('name', linkName);
			faviconFile && landingData.append('favicon', faviconFile);
			faviconCanvaSrc && landingData.append('urlFavicon', faviconCanvaSrc);
			logoFile && landingData.append('logo', logoFile);
			logoCanvaSrc && landingData.append('urlLogo', logoCanvaSrc);
			isNewFacebookPixel && landingData.append('facebookPixel', facebookPixel || '');
			isNewMetaTitle && landingData.append('metaDescription', metaTitle || '');
			isNewMetaDescription && landingData.append('metaTitle', metaDescription || '');
			isNewBlur && landingData.append('backgroundBlur', blur);
			isNewStreamingLinks;
			if (isNewStreamingLinks) {
				landingData.append('trackIdForStreaming', isLandingForTrack ? streamingTrack?.id : '');
				landingData.append('webpagesTypeId', webpagesTypeId);
			}
			landingData.append('showSocialLinks', showSocialLinks);
			landingData.append('socialLinksType', socialLinksType);
			const landingRes = await dispatch(
				editLandingPage({ landingData, landingPageId: selectedLandingPage?.id }),
			);
			if (!landingRes?.payload?.success) {
				getToast('Error', 'Something has gone wrong, some information has not been saved.');
				setIsSubmiting(false);
				return;
			}
		}
		const promises = [];
		if (isNewDesign) {
			promises.push(
				addDesignToLanding({
					designBlocks: selectedDesign.designBlocks.map(el => ({ ...el, italic: el.italic ? 1 : 0 })),
					landingPageId: selectedLandingPage.id,
				}),
			);
		}
		if (isNewStreamingLinks) {
			const streamingData = validStreamingLinks.map((el, i) => ({ link: el.link, position: i + 1 }));
			promises.push(
				addStreamingLinksToLandings({
					landingPageId: selectedLandingPage.id,
					data: streamingData,
				}),
			);
		}
		if (isNewSocialLinks) {
			const socialData = validSocialLinks.map((el, i) => ({ link: el.link, position: i + 1 }));
			promises.push(
				addSocialLinksToLanding({
					landingPageId: selectedLandingPage.id,
					data: socialData,
				}),
			);
		}

		let isError = false;
		Promise.allSettled(promises).then(results => {
			results.forEach(result => {
				if (result?.status === 'rejected') {
					isError = true;
				}
			});
		});

		if (isError) {
			getToast('Error', 'Something has gone wrong, some information has not been saved.');
		} else {
			getToast('Success', 'Landing page has been edited');
		}

		handlePush();
	};

	const handleChangeTracking = e => {
		const { value, name } = e.target;
		if (name === 'facebookPixel') {
			const numberRegex = /^[0-9]+$/;
			if (value === '' || numberRegex.test(value)) {
				setTrackingData(prev => ({ ...prev, [name]: value }));
			}
		} else {
			setTrackingData(prev => ({ ...prev, [name]: value }));
		}
	};

	useEffect(() => {
		const getReleaseTracks = async () => {
			const res = await dispatch(getTracksToReleaseWithArtistLogo(selectedRelease.id));
			if (res?.payload?.tracks?.length > 0) {
				const releaseTracks = res?.payload?.tracks.map(el => ({
					...el,
					isSelected: false,
				}));

				return releaseTracks;
			} else {
				getToast('Error', 'There are no tracks in current release');
				back();
			}
		};
		const getDownloadLandingTracks = async () => {
			if (!selectedRelease?.checkedTracks) {
				const landingTracks = await getReleaseTracks();
				setTracks(landingTracks);
			} else {
				setTracks(selectedRelease?.checkedTracks);
			}
		};

		const getTracksForSellLanding = async () => {
			const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
			const res = await dispatch(
				getDealsByReleaseId({ releaseId: selectedRelease?.id, userId: user.id, creatorOrAdmin }),
			);
			if (res?.payload?.splitsAndContracts?.length > 0) {
				let releaseTracks = selectedRelease?.checkedTracks;
				if (!releaseTracks || releaseTracks?.length === 0) {
					releaseTracks = await getReleaseTracks();
				}
				const tracksInDeals = res?.payload?.splitsAndContracts
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
					setTracks(landingTracks);
				} else {
					getToast(
						'Error',
						'There are no tracks with a split or active contract in the current release.',
					);
					back();
				}
			} else {
				getToast(
					'Error',
					'There are no tracks with a split or active contract in the current release.',
				);
				back();
			}
		};

		if (user?.id && webpagesTypeId && selectedRelease?.id && !tracks) {
			if (landingInfo.tracks?.length > 0) {
				setTracks(
					landingInfo.tracks.map(el => ({
						...el,
						isSelected: false,
					})),
				);
			} else if (webpagesTypeId === 2) {
				getTracksForSellLanding();
			} else {
				console.log('запрос getDownloadLandingTracks');
				getDownloadLandingTracks();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, selectedRelease?.id, user.id, webpagesTypeId, tracks]);

	useEffect(() => {
		if (selectedBap?.bapId) {
			const setBrandkit = async () => {
				const res = await getBrandInfoRequest(selectedBap.bapId);
				if (res?.palette?.length > 0) {
					const normalizedPalettes = res?.palette.map(el => ({
						paletteName: el.name,
						id: el.id,
						colors: el.colours.map(colour => ({ id: colour.id, hex: colour.hex })),
					}));
					setPalleteArr(prev => [...prev, ...normalizedPalettes]);
				}
				if (isNew) {
					if (res?.fonts?.length > 0) {
						const currentThemeWithBrandKitFonts = transformFontsToDesignObj(res?.fonts, selectedDesign);
						const currentBrandKitFonts = getLandingFonts(currentThemeWithBrandKitFonts);
						setFonts(currentBrandKitFonts);
						setSelectedDesign(currentThemeWithBrandKitFonts);
					}

					const logoFromServer = getImageSrc(res?.logo || '', false);
					setLogoSrc(logoFromServer);
					setFaviconSrc(logoFromServer);
					// const blob = await fetch(logoFromServer).then(res => res.blob());
					// const type = blob.type;
					// const defaultLogo = new File([blob], `landing_logo.${type.split('/')[1]}`, { type });
					// const defaultFavicon = new File([blob], `landing_favicon.${type.split('/')[1]}`, { type });
					// setLogoFile(defaultLogo);
					// setFaviconFile(defaultFavicon);
				}
				setIsBrandKitLoaded(true);
			};
			setBrandkit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap?.bapId]);

	useEffect(() => {
		if (!isNew && selectedLandingPage?.id) {
			setBlur(selectedLandingPage?.backgroundBlur);
			selectedLandingPage?.name && setLinkName(selectedLandingPage?.name);
			selectedLandingPage?.logo && setLogoSrc(selectedLandingPage?.logo);
			selectedLandingPage?.favicon && setFaviconSrc(selectedLandingPage?.favicon);
			setShowSocialLinks(selectedLandingPage?.showSocialLinks);
			setSocialLinksType(selectedLandingPage?.socialLinksType);
			selectedLandingPage?.socialLinks?.length > 0 && setSocialLinks(selectedLandingPage?.socialLinks);
			selectedLandingPage?.socialLinks?.length > 0 &&
				setValidSocialLinks(selectedLandingPage?.socialLinks);
			selectedLandingPage?.socialLinks?.length > 0 &&
				setInitialSocialLinks(selectedLandingPage?.socialLinks);

			selectedLandingPage?.streamingLinks?.length > 0 &&
				setStreamingLinks(selectedLandingPage?.streamingLinks);
			selectedLandingPage?.streamingLinks?.length > 0 &&
				setValidStreamingLinks(selectedLandingPage?.streamingLinks);
			selectedLandingPage?.streamingLinks?.length > 0 &&
				setInitialStreamingLinks(selectedLandingPage?.streamingLinks);
			selectedLandingPage?.facebookPixel &&
				setTrackingData(prev => ({ ...prev, facebookPixel: selectedLandingPage.facebookPixel }));
			selectedLandingPage?.metaTitle &&
				setTrackingData(prev => ({ ...prev, metaTitle: selectedLandingPage.metaTitle }));
			selectedLandingPage?.metaDescription &&
				setTrackingData(prev => ({ ...prev, metaDescription: selectedLandingPage.metaDescription }));
			if (selectedLandingPage.design?.length === 3) {
				const designBlocks = selectedLandingPage.design.map(obj => {
					const { landingPageId, updatedAt, createdAt, id, ...rest } = obj;
					return rest;
				});
				const currentColors = designBlocks.map(el => el.hex);
				const majorLablColors = majorLablTheme.designBlocks.map(el => el.hex);
				const isEqualColors = compareArrays(currentColors, majorLablColors);

				const currentTheme = {
					paletteName: isEqualColors ? 'Major Labl theme' : 'Landing page theme',
					id: selectedLandingPage?.id,
					designBlocks,
				};

				setSelectedDesign(currentTheme);
				const currentThemePalletes = getLangindPalette(currentTheme);
				if (isEqualColors) {
					const newPalleteArr = paletteArr.map(el => (el.id === 0 ? currentThemePalletes : el));
					setPalleteArr(newPalleteArr);
				} else {
					setPalleteArr(prev => [currentThemePalletes, ...prev]);
				}

				const fontsData = getLandingFonts(currentTheme);
				setOldFonts(fontsData);
				setFonts(fontsData);
			}
		} else if (isNew) {
			setBlur(50);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLandingPage?.id]);

	useEffect(() => {
		setSelectedDesign(prev => transformFontsToDesignObj(fonts, prev));
	}, [fonts]);

	useEffect(() => {
		const getSocialLinks = async () => {
			const res = await dispatch(getBapSocialLinks(selectedBap.bapId));
			if (res?.payload?.success) {
				const links = res?.payload?.socialLinks.map(el => ({
					id: el.id,
					link: el.social,
					position: el.position,
				}));
				setSocialLinks(links);
				setValidSocialLinks(links);
				setInitialSocialLinks(links);
			}
		};
		if (
			selectedBap.bapId &&
			(isNew || (selectedLandingPage?.id && !selectedLandingPage?.showSocialLinks))
		) {
			getSocialLinks();
		}
	}, [
		dispatch,
		isNew,
		selectedLandingPage?.showSocialLinks,
		selectedBap.bapId,
		selectedLandingPage?.id,
	]);
	useEffect(() => {
		if (isStreaming) {
			if (!selectedRelease?.releaseSpotifyId && tracks?.length > 0) {
				setStreamingTracks(
					tracks
						// .filter(track => !track.error && (track.socialLinks || track.spotifyLink))
						.filter(track => !track.error)
						.map(track => ({
							id: track.id,
							value: track.name,
							label: track.name,
							link: track?.socialLinks || '',
							spotifyLink: track?.spotifyLink || '',
						})),
				);
			} else if (selectedRelease?.releaseLinks && selectedRelease?.releaseSpotifyId) {
				if (selectedRelease?.releaseLinks?.length > tracks?.length) {
					let tracksWithLinks;
					if (tracks?.length > 0) {
						tracksWithLinks = tracks.filter(track => !track.error);
						selectedRelease?.releaseLinks.forEach(track => {
							const isAlreadyUploaded = tracksWithLinks.find(el => el?.spotifyId === track?.spotifyId);
							if (!isAlreadyUploaded) {
								tracksWithLinks.push(track);
							}
						});
					} else {
						tracksWithLinks = selectedRelease?.releaseLinks;
					}

					if (tracksWithLinks) {
						const updatedTracks = tracksWithLinks.map(track => ({
							id: track.id,
							value: track.name,
							label: track.name,
							link: track?.socialLinks || '',
							spotifyLink: track?.spotifyLink || '',
						}));
						setStreamingTracks(updatedTracks);
					}
				} else if (tracks?.length > 0) {
					const updatedTracks = tracks
						.filter(track => !track.error && (track.socialLinks || track.spotifyLink))
						.map(track => ({
							id: track.id,
							value: track.name,
							label: track.name,
							link: track?.socialLinks || '',
							spotifyLink: track?.spotifyLink || '',
						}));
					setStreamingTracks(updatedTracks);
					if (selectedLandingPage.trackIdForStreaming && updatedTracks?.length > 0) {
						const initialStreamingTrack = updatedTracks.find(
							el => el.id === selectedLandingPage.trackIdForStreaming,
						);
						setStreamingTrack(initialStreamingTrack);
					}
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		webpagesTypeId,
		isStreaming,
		selectedRelease?.releaseSpotifyId,
		selectedRelease?.releaseLinks,
		tracks,
	]);

	useEffect(() => {
		if (isStreaming && selectedRelease?.releaseSpotifyId && !selectedRelease?.releaseLinks) {
			dispatch(getReleaseLinks(selectedRelease?.releaseSpotifyId));
		}
	}, [dispatch, isStreaming, selectedRelease?.releaseLinks, selectedRelease?.releaseSpotifyId]);

	useEffect(() => {
		if (isStreaming && streamingTracks?.length > 0) {
			if (isNew) {
				handleAddTrackLinks(streamingTracks[0]);
			} else {
				if (selectedLandingPage?.trackIdForStreaming) {
					const initialStreamingTrack = streamingTracks.find(
						el => el.id === selectedLandingPage.trackIdForStreaming,
					);
					setIsLandingForTrack(true);
					setStreamingTrack(initialStreamingTrack);
				}
				// else {
				// 	setStreamingTrack(streamingTracks[0]);
				// }
			}
		}
	}, [
		dispatch,
		isNew,
		isStreaming,
		selectedLandingPage?.trackIdForStreaming,
		streamingTracks,
		streamingTracks?.length,
	]);

	const blurPx = blur === null ? 0 : Number(blur) / 5;

	const steps = isStreaming
		? ['Link & Customisation', 'Streaming & social links', 'Tracking']
		: ['Link & Customisation', 'Social links', 'Tracking'];

	const loading = (tracks?.length === 0 || !tracks) && !isStreaming;
	const colors = selectedDesign.designBlocks.map(el => el.hex);
	const trackTitle = isLandingForTrack && streamingTrack?.label;
	return (
		<>
			<Flex flexDir='column' bg='bg.secondary' w='100%' gap='16px'>
				<Flex justify='space-between' py='12px' px='24px' align='center' w='100%' bg='bg.main'>
					<Heading as='h1' fontWeight='500' fontSize='18px' color='black'>
						{title} “{selectedRelease?.name}”
					</Heading>
					<Flex>
						{isNew ? (
							<CustomButton
								w='200px'
								styles='main'
								onClickHandler={handlePublish}
								isSubmiting={isSubmiting || loading}
							>
								Save & publish
								<Icon as={DownIcon} boxSize='24px' ml='10px' />
							</CustomButton>
						) : (
							<CustomButton
								w='200px'
								styles={isEditAvailable ? 'main' : 'disabled'}
								onClickHandler={handleEdit}
								isSubmiting={isSubmiting || loading}
							>
								Save & edit
								<Icon as={DownIcon} boxSize='24px' ml='10px' />
							</CustomButton>
						)}

						<CustomButton styles='light' onClickHandler={handlePush} ml='16px'>
							Cancel
						</CustomButton>
					</Flex>
				</Flex>
				<StepsMenu setCurrentStep={setCurrentStep} currentStep={currentStep} steps={steps} />
			</Flex>
			<Grid
				pos='fixed'
				bg='bg.secondary'
				p='0 12px 16px 16px'
				w='100%'
				templateColumns=' minmax(452px, 30%) minmax(0, 1fr)'
				gap='24px'
			>
				<Flex
					flexDir={'column'}
					justify='space-between'
					bg='bg.main'
					p='16px'
					borderRadius='10px'
					overflow='auto'
					h='calc(100vh - 204px)'
					overflowY='scroll'
				>
					{currentStep === 0 && (
						<BasicSettings
							logoSrc={logoSrc}
							faviconSrc={faviconSrc}
							setFaviconSrc={setFaviconSrc}
							setFaviconFile={setFaviconFile}
							setLogoSrc={setLogoSrc}
							setLogoFile={setLogoFile}
							setFaviconCanvaSrc={setFaviconCanvaSrc}
							setLogoCanvaSrc={setLogoCanvaSrc}
							linkName={linkName}
							setLinkName={setLinkName}
							blurPx={blurPx}
							blur={blur}
							setBlur={setBlur}
							isNew={isNew}
							setSelectedDesign={setSelectedDesign}
							selectedDesign={selectedDesign}
							paletteArr={paletteArr}
							setPaletteArr={setPalleteArr}
							fonts={fonts}
							setFonts={setFonts}
							isStreaming={isStreaming}
							setLink={setLink}
							link={link}
						/>
					)}
					{currentStep === 1 && (
						<Box h='fit-content'>
							{isStreaming && (
								<CreateWebPageLinks
									setValidLinks={setValidStreamingLinks}
									validLinks={validStreamingLinks}
									setLinks={setStreamingLinks}
									links={streamingLinks}
									setInvalidLinks={setInvalidStreamingLinks}
									invalidLinks={invalidStreamingLinks}
									isNew={isNew}
									isStreaming
									streamingTracks={streamingTracks}
									setIsLandingForTrack={setIsLandingForTrack}
									isLandingForTrack={isLandingForTrack}
									setStreamingTrack={setStreamingTrack}
									streamingTrack={streamingTrack}
									handleAddTrackLinks={handleAddTrackLinks}
								/>
							)}
							<CreateWebPageSocialLinks
								setValidSocialLinks={setValidSocialLinks}
								validSocialLinks={validSocialLinks}
								setSocialLinks={setSocialLinks}
								socialLinks={socialLinks}
								invalidSocialLinks={invalidSocialLinks}
								setInvalidSocialLinks={setInvalidSocialLinks}
								showSocialLinks={showSocialLinks}
								setShowSocialLinks={setShowSocialLinks}
								socialLinksType={socialLinksType}
								setSocialLinksType={setSocialLinksType}
								isNew={isNew}
								isStreaming={isStreaming}
								mt={isStreaming ? '32px' : 0}
							/>
						</Box>
					)}
					{currentStep === 2 && (
						<Tracking trackingData={trackingData} handleChangeTracking={handleChangeTracking} />
					)}
					{/* {currentStep === 2 ? (
						<>
							{isNew ? (
								<CustomButton
									styles='main'
									onClickHandler={handlePublish}
									w='100%'
									mt='32px'
									isSubmiting={isSubmiting || loading}
								>
									Save & publish
								</CustomButton>
							) : (
								<CustomButton
									styles={isEditAvailable ? 'main' : 'disabled'}
									onClickHandler={handleEdit}
									w='100%'
									mt='32px'
									isSubmiting={isSubmiting || loading}
								>
									Save & edit
								</CustomButton>
							)}
						</>
					) : (
						<NextButton
							w='100%'
							mt='32px'
							onClickHandler={() => {
								setCurrentStep(currentStep + 1);
							}}
						/>
					)} */}
				</Flex>

				{loading ? (
					<ContainerLoader h='calc(100vh - 204px)' />
				) : (
					<LandingScreenLayout
						logoSrc={logoSrc}
						blurPx={blurPx}
						colors={colors}
						fonts={fonts}
						tracks={tracks}
						setTracks={setTracks}
						setTracksInCart={setTracksInCart}
						tracksInCart={tracksInCart}
						setIsAllTracks={setIsAllTracks}
						socialLinks={validSocialLinks}
						showSocialLinks={showSocialLinks}
						socialLinksType={socialLinksType}
						trackTitle={trackTitle}
					>
						{webpagesTypeId === 1 && (
							<DownloadLandingSreenContent
								colors={colors}
								fonts={fonts}
								tracks={tracks}
								setTracks={setTracks}
								isAllTracks={isAllTracks}
								setIsAllTracks={setIsAllTracks}
							/>
						)}
						{webpagesTypeId === 2 && (
							<SellLandingScreenContent
								colors={colors}
								fonts={fonts}
								tracks={tracks}
								setTracksInCart={setTracksInCart}
								setTracks={setTracks}
								isAllTracks={isAllTracks}
								setIsAllTracks={setIsAllTracks}
								tracksInCart={tracksInCart}
							/>
						)}
						{isStreaming && (
							<StreamingLandingSreenContent
								borderColor={colors[2]}
								streamingLinks={streamingLinks}
								mb='88px'
							/>
						)}
					</LandingScreenLayout>
				)}
			</Grid>
		</>
	);
};

export default CreateOrEditLanding;
