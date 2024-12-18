import { Box } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import BackgroundBlur from '../../components/BackgroundBlur/BackgroundBlur';
import CreateUniqueLink from '../../components/CreateUniqueLink/CreateUniqueLink';
import UploadImageContainer from '../../components/UploadImageContainer/UploadImageContainer';
import LandingFonts from '../LandingFonts/LandingFonts';
import LandingPalette from '../LandingPalette/LandingPalette';

const BasicSettings = ({
	faviconSrc,
	setFaviconSrc,
	setFaviconFile,
	setFaviconCanvaSrc,
	setLogoSrc,
	setLogoFile,
	setLogoCanvaSrc,

	linkName,
	setLinkName,
	blur,
	blurPx,
	setBlur,
	logoSrc,
	isNewLanding,
	selectedDesign,
	setSelectedDesign,
	paletteArr,
	setPaletteArr,
	fonts,
	setFonts,
	isStreaming,
	link,
	setLink,
}) => {
	const { selectedRelease } = useSelector(state => state.user);

	const handleLogoCanvaSrc = src => {
		setLogoSrc(src);
		setLogoCanvaSrc(src);
		setLogoFile(null);
	};

	const handleFaviconCanvaSrc = src => {
		setFaviconSrc(src);
		setFaviconCanvaSrc(src);
		setFaviconFile(null);
	};
	const handleRemoveLogo = () => {
		setLogoSrc(null);
		setLogoCanvaSrc(null);
		setLogoFile(null);
	};

	const handleRemoveFavicon = () => {
		setFaviconSrc(null);
		setFaviconCanvaSrc(null);
		setFaviconFile(null);
	};
	return (
		<Box>
			<CreateUniqueLink
				linkName={linkName}
				setLinkName={setLinkName}
				isNewLanding={isNewLanding}
				link={link}
				setLink={setLink}
			/>

			<UploadImageContainer
				title='Logo'
				text="Upload your logo or your band's"
				setImageSrc={setLogoSrc}
				setImageFile={setLogoFile}
				handleCanvaSrc={handleLogoCanvaSrc}
				isFavicon={true}
				faviconSrc={logoSrc}
				type={'logo'}
				isCross={logoSrc}
				handleCrossClick={handleRemoveLogo}
			/>

			<UploadImageContainer
				title='Favicon'
				text='Upload favicon for your shop, image ratio 1:1'
				setImageSrc={setFaviconSrc}
				setImageFile={setFaviconFile}
				handleCanvaSrc={handleFaviconCanvaSrc}
				isFavicon={true}
				faviconSrc={faviconSrc}
				type={'favicon'}
				isCross={faviconSrc}
				handleCrossClick={handleRemoveFavicon}
			/>
			{blur !== null && (
				<BackgroundBlur
					blur={blur}
					setBlur={setBlur}
					src={selectedRelease?.logoMin || selectedRelease?.logo}
					blurPx={blurPx}
				/>
			)}

			<LandingPalette
				selectedDesign={selectedDesign}
				setSelectedDesign={setSelectedDesign}
				mt={'24px'}
				paletteArr={paletteArr}
				setPaletteArr={setPaletteArr}
			/>

			<LandingFonts fonts={fonts} setFonts={setFonts} mt={'24px'} />
		</Box>
	);
};
export default BasicSettings;
