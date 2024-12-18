function prepareShopDataForSave(
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
) {
	const formData = new FormData();
	if (shop.linkName !== shop.linkNameOnServer) {
		formData.append('name', shop.linkName);
	}

	formData.append('metaTitle', shop?.metaTitle || '');
	formData.append('metaDescription', shop?.metaDescription || '');
	formData.append('facebookPixel', shop?.fbPixel || '');
	formData.append('backgroundBlur', shop.blur);
	formData.append('positionTypeId', shop.bannerPosition);
	formData.append('showSocialLinks', showSocialLinks);
	formData.append('socialLinksType', socialLinksType);
	if (!bannerSrc) {
		formData.append('bannerType', '');
	} else if (bannerSrc?.includes('export-download.canva.com')) {
		formData.append('urlBanner', bannerSrc);
		formData.append('bannerType', shop.bannerType);
	} else if (bannerFile) {
		formData.append('banner', bannerFile);
		formData.append('bannerType', shop.bannerType);
	}

	if (logoSrc?.includes('export-download.canva.com')) {
		formData.append('urlLogo', logoSrc);
	} else if (logoFile) {
		formData.append('logo', logoFile);
	}

	if (faviconSrc?.includes('export-download.canva.com')) {
		formData.append('urlFavicon', faviconSrc);
	} else if (faviconFile) {
		formData.append('favicon', faviconFile);
	}

	if (bgSrc?.includes('export-download.canva.com')) {
		formData.append('urlBackground', faviconSrc);
	} else if (bgFile) {
		formData.append('background', bgFile);
	}

	return formData;
}

export default prepareShopDataForSave;
