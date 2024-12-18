import { Box, Flex } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFonts, setPalette, setSelectedRelease, setShop } from 'store/shop/shop-slice';

import CustomButton from '@/components/Buttons/CustomButton';

import { ColorPalette } from '../../../components/ColorPalette/ColorPalette';
import UploadImageContainer from '../../../components/UploadImageContainer/UploadImageContainer';
import BannerSettingShop from '../BasicSettings/components/BannerSettingShop';
import SelectedReleaseCard from '../ReleasesInShop/components/SelectedReleaseCard';

import BackgroundBlur from './components/BackgroundBlur';
import { FontsCheck } from './components/FontsCheck';
import SelectReleasesModal from './components/SelectReleasesModal';

const Customization = ({
	logoSrc,
	setLogoSrc,
	setLogoFile,
	setFaviconSrc,
	faviconSrc,
	setFaviconFile,
	setBgSrc,
	setBgFile,
	bgSrc,
	setBannerSrc,
	bannerSrc,
	setBannerFile,
}) => {
	const shop = useSelector(state => state.shop);
	const dispatch = useDispatch();

	const [isReleasesModal, setIsReleasesModal] = useState(false);

	const handlePaletteSelection = value => {
		const updatedShop = { ...shop, selectedPalette: value };

		dispatch(setShop(updatedShop));
	};

	const handleFontsSelection = value => {
		const updatedShop = { ...shop, selectedFonts: value };
		dispatch(setShop(updatedShop));
		// dispatch(setFonts(value));
	};

	const handleLogoCrossClick = () => {
		setLogoSrc(null);
		setLogoFile(null);
	};

	const handleFaviconCrossClick = () => {
		setFaviconSrc(null);
		setFaviconFile(null);
	};

	const handleBgCrossClick = () => {
		setBgSrc(null);
		setBgFile(null);

		const editedShop = { ...shop, bgImage: null };

		dispatch(setShop(editedShop));
	};

	const handlePaletteCrossClick = () => {
		dispatch(setPalette(null));
	};

	const handleFontsCrossClick = () => {
		dispatch(setFonts(null));
	};

	return (
		<>
			<Flex mb='24px'>
				<CustomButton
					onClickHandler={() => {
						dispatch(setSelectedRelease(null));
					}}
					w='50%'
					styles={`${shop.selectedRelease ? 'transparent-bold' : 'blueYonder'}`}
				>
					Main page settings
				</CustomButton>

				<CustomButton
					onClickHandler={() => {
						setIsReleasesModal(true);
					}}
					ml='4px'
					w='50%'
					styles={`${shop.selectedRelease ? 'blueYonder' : 'transparent-bold'}`}
				>
					Release page settings
				</CustomButton>
			</Flex>

			{!shop.selectedRelease && (
				<Box>
					<UploadImageContainer
						title='Background'
						text='Upload image for background'
						setImageSrc={setBgSrc}
						setImageFile={setBgFile}
						handleCanvaSrc={setBgSrc}
						faviconSrc={bgSrc}
						isFavicon={!!bgSrc}
						isCross={bgSrc}
						handleCrossClick={handleBgCrossClick}
						mt='0'
						imgW={1920}
						imgH={1080}
					/>

					{bgSrc && <BackgroundBlur src={bgSrc} />}

					<BannerSettingShop
						bannerSrc={bannerSrc}
						setBannerSrc={setBannerSrc}
						setBannerFile={setBannerFile}
					/>
				</Box>
			)}

			{shop.selectedRelease && (
				<SelectedReleaseCard release={shop.selectedRelease} isCloseButton={false} />
			)}

			<ColorPalette
				paletteList={shop.paletteList}
				storedPalette={shop?.selectedPalette}
				selectionHandler={handlePaletteSelection}
				// isCross
				onCrossClick={handlePaletteCrossClick}
				mt={'8px'}
			/>

			<FontsCheck
				storedFonts={shop?.selectedFonts}
				selectionHandler={handleFontsSelection}
				// isCross
				onCrossClick={handleFontsCrossClick}
				mt={'24px'}
			/>

			<UploadImageContainer
				title='Logo'
				text="Upload your logo or your band's"
				imageSrc={faviconSrc}
				setImageSrc={setLogoSrc}
				setImageFile={setLogoFile}
				handleCanvaSrc={setLogoSrc}
				faviconSrc={logoSrc}
				isFavicon={!!logoSrc}
				isCross={logoSrc}
				handleCrossClick={handleLogoCrossClick}
				mt='0'
			/>
			<UploadImageContainer
				title='Favicon'
				text='Upload favicon for your shop, image ratio 1:1'
				imageSrc={faviconSrc}
				setImageSrc={setFaviconSrc}
				setImageFile={setFaviconFile}
				handleCanvaSrc={setFaviconSrc}
				faviconSrc={faviconSrc}
				isFavicon={!!faviconSrc}
				isCross={faviconSrc}
				handleCrossClick={handleFaviconCrossClick}
			/>

			{isReleasesModal && <SelectReleasesModal closeModal={() => setIsReleasesModal(false)} />}
		</>
	);
};

export default Customization;
