import { Box } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import LogoFieldShop from './components/LogoFieldShop';
import SelectedRelease from './components/SelectedRelease';

const PreviewReleaseComponent = ({ logoSrc, socialLinksType, showSocialLinks, socialLinks }) => {
	const selectedRelease = useSelector(state => state.shop.selectedRelease);

	return (
		<>
			<Box
				bgImage={selectedRelease.logoSrc || 'none'}
				bgSize={'cover'}
				bgPos={'center'}
				bgRepeat={'no-repeat'}
				pos='absolute'
				w='100%'
				h='100%'
				right='0'
				bottom='0'
				filter={`blur(${(6.31 * selectedRelease.backgroundBlur) / 20}px)`}
			/>
			<Box
				w='100%'
				h='100%'
				minH='100%'
				overflowY='scroll'
				pos='absolute'
				right='0'
				bottom='0'
				mx='auto'
			>
				<LogoFieldShop
					logoSrc={logoSrc}
					socialLinksType={socialLinksType}
					socialLinks={socialLinks}
					showSocialLinks={showSocialLinks}
				/>

				<SelectedRelease />
			</Box>
		</>
	);
};

export default PreviewReleaseComponent;
