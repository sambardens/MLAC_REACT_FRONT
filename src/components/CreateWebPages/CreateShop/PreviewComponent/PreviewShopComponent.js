import { Box } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import SignUpForML from '../../components/SignUpForML/SignUpForML';

import BannerFieldShop from './components/BannerFieldShop';
import LogoFieldShop from './components/LogoFieldShop';
import PreviewReleasesList from './components/PreviewReleasesList';

const PreviewShopComponent = ({
	bannerSrc,
	logoSrc,
	bgSrc,
	socialLinksType,
	showSocialLinks,
	socialLinks,
}) => {
	const shop = useSelector(state => state.shop);
	const { selectedBap } = useSelector(state => state.user);
	const { blur, currentStep } = shop;
	return (
		<>
			<Box
				bgColor={bgSrc ? 'transparent' : shop?.selectedPalette?.colors[1]}
				bgImage={bgSrc || 'none'}
				bgSize={'cover'}
				bgPos={'center'}
				bgRepeat={'no-repeat'}
				pos='absolute'
				left={0}
				top={0}
				w='100%'
				h='100%'
				filter={`blur(${bgSrc ? (6.31 * Number(blur)) / 20 : 0}px)`}
			/>
			<Box w='100%' h='100%'>
				<LogoFieldShop
					logoSrc={logoSrc}
					socialLinksType={socialLinksType}
					socialLinks={socialLinks}
					showSocialLinks={showSocialLinks}
					position='absolute'
				/>

				{currentStep === 1 && bannerSrc && <BannerFieldShop bannerSrc={bannerSrc} />}
				{(currentStep === 2 || currentStep === 3) && <PreviewReleasesList />}

				<Box position={'absolute'} bottom='40px' right='50%' transform={'translateX(50%)'}>
					<SignUpForML
						isMock={true}
						fs={shop?.selectedFonts && Number(shop?.selectedFonts[0]?.size) * 0.5}
						textColor={shop?.selectedPalette?.colors[0]}
						buttonColor={shop?.selectedPalette?.colors[2]}
						fontFamily={shop?.selectedFonts[2]?.font}
						fontStyle={shop?.selectedFonts[2]?.italic}
						fontWeight={shop?.selectedFonts[2]?.weight}
						fontSize={shop?.selectedFonts[2]?.size}
						isСonstructor={true}
						bapName={selectedBap?.bapName}
					/>
				</Box>
			</Box>
		</>
	);
};

export default PreviewShopComponent;
