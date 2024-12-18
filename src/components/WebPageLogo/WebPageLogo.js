import Image from 'next/image';

import { Box, Icon } from '@chakra-ui/react';

import LogoWhiteIcon from '@/assets/icons/base/logo-white.svg';
import LogoIcon from '@/assets/icons/base/logo.svg';

const WebPageLogo = ({ logoSrc, socialLinksType }) => {
	const getLogoStyle = () => {
		if (socialLinksType === 'white') {
			return LogoWhiteIcon;
		}
		return LogoIcon;
	};
	return (
		<>
			{logoSrc ? (
				<Box borderRadius='6px' overflow='hidden' w='64px' h='64px' pos='relative'>
					<Image src={logoSrc} fill alt='Release logo' sizes='64px' />
				</Box>
			) : (
				<Icon as={getLogoStyle()} w='90px' h='50px' />
			)}
		</>
	);
};

export default WebPageLogo;
