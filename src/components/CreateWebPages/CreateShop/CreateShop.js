import { useRouter } from 'next/router';

import { Box, Flex, Heading, Text, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import addDesignToShop from 'src/functions/serverRequests/shop/addDesignToShop';
import addSocialLinksToShop from 'src/functions/serverRequests/shop/addSocialLinksToShop';
import createShop from 'src/functions/serverRequests/shop/createShop';
import editShop from 'src/functions/serverRequests/shop/editShop/editShop';
import getShop from 'src/functions/serverRequests/shop/getShop';
import checkAndSaveReleases from 'src/functions/serverRequests/shop/releases/checkAndSaveReleases';
import prepareReleasesWithActualTracks from 'src/functions/serverRequests/shop/releases/prepareReleasesWithActualTracks';
import prepareShop from 'src/functions/serverRequests/shop/shopPreparers/prepareShop';
import prepareShopDataForSave from 'src/functions/serverRequests/shop/shopPreparers/prepareShopData';
import compareArraysOfObjects from 'src/functions/utils/compareArraysOfObjects';
import getFinalPaletteList from 'src/functions/utils/web-pages/shop/getFinalPaletteList';
import prepareDesignForReq from 'src/functions/utils/web-pages/shop/prepareDesignForReq';
import prepareDesignFromRes from 'src/functions/utils/web-pages/shop/prepareDesignFromRes';
import { getBapSocialLinks } from 'store/links/links-operations';
import { getDealsByBapId } from 'store/operations';
import {
	resetShop,
	setCurrentStep,
	setIsLinkNameError,
	setSelectedRelease,
	setShop,
} from 'store/shop/shop-slice';

import CustomButton from '@/components/Buttons/CustomButton';
import FullPageLoader from '@/components/Loaders/FullPageLoader';

import PreviewReleaseComponent from './PreviewComponent/PreviewReleaseComponent';
import PreviewShopComponent from './PreviewComponent/PreviewShopComponent';
import BasicSettings from './ShopSteps/BasicSettings/BasicSettings';
import Customization from './ShopSteps/Customization/Customization';
import ReleasesInShop from './ShopSteps/ReleasesInShop/ReleasesInShop';

const CreateShop = () => {
	const shop = useSelector(state => state.shop);
	const { selectedBap, user } = useSelector(state => state.user);
	const dispatch = useDispatch();
	const router = useRouter();
	const { pathname, query, push } = useRouter();
	const toast = useToast();
	const [bannerSrc, setBannerSrc] = useState('');
	const [bannerFile, setBannerFile] = useState(null);
	const [logoSrc, setLogoSrc] = useState('');
	const [logoFile, setLogoFile] = useState(null);
	const [faviconSrc, setFaviconSrc] = useState('');
	const [faviconFile, setFaviconFile] = useState(null);
	const [bgSrc, setBgSrc] = useState('');
	const [bgFile, setBgFile] = useState(null);

	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isValidFbPixel, setIsValidFbPixel] = useState(true);

	// ------------------ social links ---------------------

	const [showSocialLinks, setShowSocialLinks] = useState(true);
	const [socialLinksType, setSocialLinksType] = useState('colour');
	const [initialSocialLinks, setInitialSocialLinks] = useState([]);
	const [socialLinks, setSocialLinks] = useState([]);
	const [validSocialLinks, setValidSocialLinks] = useState([]);
	const [invalidSocialLinks, setInvalidSocialLinks] = useState([]);

	//--------------------------------------------------------
	const axiosPrivate = useAxiosPrivate();
	const isNewShop = pathname.includes('create-shop');
	const shopName = query?.shopName;
	const bapId = query?.bapId;

	const isNewSocialLinks =
		showSocialLinks && compareArraysOfObjects(initialSocialLinks, validSocialLinks);
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

	const handleGetShopReleases = async () => {
		setIsLoading(true);
		const resData = await getShop(shopName);

		if (resData.success) {
			let tracksInDeals = selectedBap?.splitsAndContracts
				?.filter(el => el.status === 1)
				?.map(el => el.splitTracks)
				?.flat();
			if (!selectedBap?.splitsAndContracts || selectedBap?.splitsAndContracts?.length === 0) {
				const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
				const res = await dispatch(
					getDealsByBapId({
						bapId,
						userId: user?.id,
						creatorOrAdmin,
					}),
				);
				tracksInDeals = res?.payload?.splitsAndContracts
					?.filter(el => el.status === 1)
					?.map(el => el.splitTracks)
					?.flat();
			}
			if (!tracksInDeals || tracksInDeals?.length === 0) {
				getToast('Error', "Can't find tracks in a split or active contract.");
				router.back();
				return;
			}
			const preparedShop = await prepareShop(resData.shop, true, selectedBap);
			const preparedShopReleases = await prepareReleasesWithActualTracks(
				resData.releases,
				axiosPrivate,
				tracksInDeals,
			);
			const design = prepareDesignFromRes(resData.design);
			const paletteList = getFinalPaletteList(preparedShop.paletteList, design[0]);

			const shopWithData = {
				...preparedShop,
				shopReleasesFromServer: preparedShopReleases,
				selectedShopReleases: preparedShopReleases,
				paletteList,
				selectedPalette: design[0],
				selectedFonts: design[1],
			};
			dispatch(setShop(shopWithData));

			setBannerSrc(shopWithData?.bannerSrc);
			setLogoSrc(shopWithData?.logoSrc);
			setFaviconSrc(shopWithData?.faviconSrc);
			setBgSrc(shopWithData?.bgSrc);
			setShowSocialLinks(shopWithData?.showSocialLinks);
			setSocialLinksType(shopWithData?.socialLinksType);
			setSocialLinks(shopWithData?.socialLinks);
			setValidSocialLinks(shopWithData?.socialLinks);
			setInitialSocialLinks(shopWithData?.socialLinks);
		}

		if (!resData.success) {
			getToast('Error', `Failed to load shop: ${resData?.message}`);
		}

		setIsLoading(false);
	};

	const handleGetDataForNewShop = async () => {
		setIsLoading(true);
		const preparedShop = await prepareShop({ bapId }, true, selectedBap);

		dispatch(setShop(preparedShop));
		setLogoSrc(preparedShop?.logoSrc);
		setFaviconSrc(preparedShop?.faviconSrc);
		setBgSrc(preparedShop?.bgSrc);

		// const blob = await fetch(preparedShop?.logoSrc).then(res => res.blob());
		// const type = blob.type;
		// const defaultLogo = new File([blob], `shop_logo.${type.split('/')[1]}`, { type });
		// const defaultFavicon = new File([blob], `shop_favicon.${type.split('/')[1]}`, { type });
		// setLogoFile(defaultLogo);
		// setFaviconFile(defaultFavicon);

		if (!selectedBap?.splitsAndContracts || selectedBap?.splitsAndContracts?.length === 0) {
			const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
			dispatch(getDealsByBapId({ bapId, userId: user?.id, creatorOrAdmin }));
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (!user?.id) return;
		if (bapId && isNewShop) {
			handleGetDataForNewShop();
		} else if (!isNewShop && shopName) {
			handleGetShopReleases();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bapId, isNewShop, shopName, user?.id]);

	const handleCancel = () => {
		push({
			pathname: '/bap/[bapId]/web-pages',
			query: { bapId: selectedBap.bapId },
		}).then(() => {
			dispatch(resetShop());
		});
	};

	const saveShopInfo = async shopId => {
		const saveReleasePromise = checkAndSaveReleases(
			shopId,
			shop.shopReleasesFromServer,
			shop.selectedShopReleases,
		);

		const designObjs = prepareDesignForReq(shop.selectedPalette.colors, shop.selectedFonts);
		const designPromises = designObjs.map(async obj => {
			addDesignToShop(obj, shopId);
		});
		const allPromises = [saveReleasePromise, ...designPromises];
		if ((isNewShop && showSocialLinks && validSocialLinks.length > 0) || isNewSocialLinks) {
			const socialData = validSocialLinks.map((el, i) => ({ link: el.link, position: i + 1 }));
			allPromises.push(
				addSocialLinksToShop({
					shopId,
					data: socialData,
				}),
			);
		}
		let isError = false;
		await Promise.allSettled(allPromises).then(results => {
			results.forEach(result => {
				if (result?.status === 'rejected') {
					isError = true;
				}
			});
		});
		if (isError) {
			getToast(
				'Error',
				`Something going wrong. Shop has been ${
					isNewShop ? 'created' : 'edited'
				}, but some information have not been saved`,
			);
		} else {
			getToast('Success', `Shop has been ${isNewShop ? 'created' : 'edited'}`);
		}
	};
	const handleShopSave = async () => {
		if (!shop.linkName) {
			dispatch(setIsLinkNameError(true));
			dispatch(setCurrentStep(3));
			return;
		}

		if (!isValidFbPixel) {
			getToast('Error', 'You have entered an invalid Facebook Pixel number.');
			dispatch(setCurrentStep(3));
			return;
		}
		if (!shop?.selectedShopReleases || shop?.selectedShopReleases?.length === 0) {
			getToast('Error', 'The shop must contain at least one release.');
			dispatch(setCurrentStep(2));
			return;
		}
		setIsSaving(true);

		const formData = prepareShopDataForSave(
			shop,
			bannerSrc,
			bannerFile,
			logoSrc,
			logoFile,
			faviconSrc,
			faviconFile,
			bgSrc,
			bgFile,
			showSocialLinks,
			socialLinksType,
		);

		let resData;

		if (isNewShop) {
			resData = await createShop(formData, selectedBap.bapId);

			if (resData?.success) {
				await saveShopInfo(resData.shop.id);
			} else {
				getToast('Error', `${resData.message}`);
				return;
			}
		}

		if (!isNewShop) {
			resData = await editShop(formData, shop.id);

			if (resData?.success) {
				await saveShopInfo(resData.shop.id);
			} else {
				getToast('Error', `${resData.message}`);
				return;
			}
		}

		setIsSaving(false);
		push({
			pathname: '/bap/[bapId]/web-pages',
			query: { bapId: selectedBap.bapId },
		});
	};

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
		if (selectedBap.bapId && (isNewShop || (shop?.id && !shop?.showSocialLinks))) {
			getSocialLinks();
		}
	}, [dispatch, isNewShop, selectedBap.bapId, shop?.id, shop?.showSocialLinks]);

	return isLoading ? (
		<FullPageLoader />
	) : (
		<Box maxH='100vh' overflowY='hidden'>
			<Box w='100%' bgColor='bg.main'>
				<Flex justify='space-between' py='12px' px='24px' align='center'>
					<Heading as='h1' fontWeight='500' fontSize='18px' color='black' lineHeight='1.5'>
						Create a shop
					</Heading>
					<Flex>
						<CustomButton w='200px' styles='main' onClickHandler={handleShopSave} isSubmiting={isSaving}>
							Save & publish
							{/* <Icon as={DownIcon} boxSize='24px' ml='10px' /> */}
						</CustomButton>
						<CustomButton styles='light' onClickHandler={handleCancel} ml='16px'>
							Cancel
						</CustomButton>
					</Flex>
				</Flex>
				<Box pt='16px' pb='12px' bg='bg.secondary' w='100%' px='16px'>
					<Flex w='100%' p='12px' as='ul' bg='bg.main' borderRadius='10px'>
						<Flex
							as='li'
							key='11'
							borderBottom='2px solid'
							h='56px'
							borderColor={shop?.currentStep === 1 ? 'accent' : 'transparent'}
							w='calc(100% / 3)'
							onClick={() => {
								dispatch(setCurrentStep(1));
								dispatch(setSelectedRelease(null));
							}}
							align='center'
							justify='center'
							cursor='pointer'
						>
							<Text fontWeight='500' fontSize='18px' color={shop?.currentStep === 1 ? 'accent' : 'black'}>
								Customisation
							</Text>
						</Flex>
						<Flex
							as='li'
							key='22'
							h='56px'
							borderBottom='2px solid'
							borderColor={shop?.currentStep === 2 ? 'accent' : 'transparent'}
							w='calc(100% / 3)'
							onClick={() => {
								dispatch(setCurrentStep(2));
							}}
							align='center'
							justify='center'
							cursor='pointer'
						>
							<Text fontWeight='500' fontSize='18px' color={shop?.currentStep === 2 ? 'accent' : 'black'}>
								Add release
							</Text>
						</Flex>
						<Flex
							as='li'
							key='33'
							h='56px'
							borderBottom='2px solid'
							borderColor={shop?.currentStep === 3 ? 'accent' : 'transparent'}
							w='calc(100% / 3)'
							onClick={() => {
								dispatch(setCurrentStep(3));
							}}
							align='center'
							justify='center'
							cursor='pointer'
						>
							<Text fontWeight='500' fontSize='18px' color={shop?.currentStep === 3 ? 'accent' : 'black'}>
								Settings
							</Text>
						</Flex>
					</Flex>
				</Box>
			</Box>
			<Flex pos='fixed' gap='24px' bg='bg.secondary' p='0 12px 16px 16px' w='100%'>
				<Flex
					flexDir={'column'}
					p='16px'
					w='30%'
					minW='453px'
					borderRadius='10px'
					bg='bg.main'
					h='calc(100vh - 204px)'
					overflowY='scroll'
				>
					{shop?.currentStep === 1 && (
						<Customization
							logoSrc={logoSrc}
							setLogoSrc={setLogoSrc}
							setLogoFile={setLogoFile}
							faviconSrc={faviconSrc}
							setFaviconSrc={setFaviconSrc}
							setFaviconFile={setFaviconFile}
							bgSrc={bgSrc}
							setBgSrc={setBgSrc}
							setBgFile={setBgFile}
							bannerSrc={bannerSrc}
							setBannerFile={setBannerFile}
							setBannerSrc={setBannerSrc}
						/>
					)}

					{shop?.currentStep === 2 && <ReleasesInShop />}
					{shop?.currentStep === 3 && (
						<BasicSettings
							isNewShop={isNewShop}
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
							isValidFbPixel={isValidFbPixel}
							setIsValidFbPixel={setIsValidFbPixel}
						/>
					)}
				</Flex>
				<Flex
					position={'relative'}
					flexDir='column'
					align='center'
					w='70%'
					h='calc(100vh - 204px)'
					fontFamily={shop?.selectedFonts && shop?.selectedFonts[0]?.font}
					overflow='hidden'
				>
					{shop.selectedRelease ? (
						<PreviewReleaseComponent
							bannerSrc={bannerSrc}
							logoSrc={logoSrc}
							bgSrc={bgSrc}
							socialLinksType={socialLinksType}
							showSocialLinks={showSocialLinks}
							socialLinks={socialLinks}
						/>
					) : (
						<PreviewShopComponent
							socialLinksType={socialLinksType}
							showSocialLinks={showSocialLinks}
							socialLinks={socialLinks}
							bannerSrc={bannerSrc}
							logoSrc={logoSrc}
							bgSrc={bgSrc}
						/>
					)}
				</Flex>
			</Flex>
		</Box>
	);
};

export default CreateShop;
