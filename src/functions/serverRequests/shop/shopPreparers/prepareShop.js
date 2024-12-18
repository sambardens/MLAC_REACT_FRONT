import getBrandInfoRequest from 'src/functions/serverRequests/brandKit/getBrandInfoRequest';
import getImageSrc from 'src/functions/utils/getImageSrc';
import prepareFonts from 'src/functions/utils/web-pages/shop/prepareFonts';
import prepareInitialPalette from 'src/functions/utils/web-pages/shop/prepareInitialPalette';

const defaultPalette = {
	name: 'Major default theme',
	id: 1,
	colors: ['#FFFFFF', '#282727', '#FF0151'],
};

async function prepareShop(shopFromServer, isBrandKit = false, selectedBap) {
	const id = shopFromServer?.id || '';
	let preparedBrankKit;

	if (isBrandKit) {
		const brandKit = await getBrandInfoRequest(shopFromServer.bapId);
		preparedBrankKit = { ...brandKit, logoSrc: getImageSrc(brandKit.logo, false) };
		if (preparedBrankKit?.fonts?.length !== 3) {
			const initialFonts = [
				{
					font: 'Poppins',
					size: 32,
					weight: 600,
					italic: '',
				},
				{
					font: 'Poppins',
					size: 18,
					weight: 500,
					italic: '',
				},
				{
					font: 'Poppins',
					size: 14,
					weight: 400,
					italic: '',
				},
			];
			for (let i = preparedBrankKit.fonts.length; i < 3; i++) {
				const initialFont = initialFonts[i];
				if (initialFont) {
					preparedBrankKit.fonts.push({
						id: i + 1,
						font: initialFont.font,
						size: initialFont.size,
						weight: initialFont.weight,
						italic: initialFont.italic,
						brandId: preparedBrankKit.id,
					});
				}
			}
		}
	}

	const currentStep = 1;
	const linkName = shopFromServer?.name;
	const isLinkNameError = false;
	const bannerType = shopFromServer?.bannerType || 'image';
	const bannerPosition = shopFromServer?.positionTypeId || 1;

	const fbPixel = id ? shopFromServer?.facebookPixel || '' : selectedBap?.facebookPixel || '';
	const metaTitle = shopFromServer?.metaTitle || '';
	const metaDescription = id
		? shopFromServer?.metaDescription || ''
		: selectedBap?.bapDescription || '';
	const logoSrc = id
		? getImageSrc(shopFromServer?.logo, false) || ''
		: preparedBrankKit?.logoSrc || '';

	const faviconSrc = id
		? getImageSrc(shopFromServer?.favicon, false) || ''
		: preparedBrankKit?.logoSrc || '';
	const bgSrc = getImageSrc(shopFromServer?.background, false);
	const bannerSrc = getImageSrc(shopFromServer?.banner, false);
	// const palette = preparePalette(brandKit.palette || []);

	const blur = shopFromServer?.backgroundBlur || 0;

	const preparedShop = {
		id,
		brandKit: preparedBrankKit,
		currentStep,
		linkNameOnServer: linkName,
		linkName,
		isLinkNameError,
		bannerType,
		bannerPosition,
		fbPixel,
		metaTitle,
		metaDescription,
		bannerSrc,
		logoSrc,
		faviconSrc,
		bgSrc,
		blur,
		paletteList: prepareInitialPalette(preparedBrankKit?.palette),
		selectedPalette: defaultPalette,
		selectedFonts: prepareFonts(preparedBrankKit),
		bapReleases: [],
		selectedShopReleases: [],
		selectedRelease: null,
		cart: [],
		bapId: shopFromServer?.bapId,
		bapName: shopFromServer?.bapName,
		socialLinks: shopFromServer?.socialLinks || [],
		showSocialLinks: shopFromServer?.showSocialLinks,
		socialLinksType: shopFromServer?.socialLinksType || 'colour',
	};

	return preparedShop;
}

export default prepareShop;
