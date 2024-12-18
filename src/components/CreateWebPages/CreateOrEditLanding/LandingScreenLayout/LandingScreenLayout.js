import Image from 'next/image';

import { Box, Flex, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import WebPageSocialLinks from '@/components/WebPageSocialLinks/WebPageSocialLinks';

import LogoField from '../../components/LogoField/LogoField';
import LandingScreenTitle from '../LandingScreenTitle/LandingScreenTitle';

const LandingScreenLayout = ({
	children,
	logoSrc,
	blurPx,
	colors,
	fonts,
	tracks,
	setTracks,
	setTracksInCart,
	tracksInCart,
	setIsAllTracks,
	socialLinks,
	showSocialLinks,
	socialLinksType,
	trackTitle,
}) => {
	const { selectedRelease, selectedLandingPage } = useSelector(state => state.user);

	return (
		<Flex pos='relative' align='center' flexDir='column' h='calc(100vh - 204px)' overflow='hidden'>
			<Box
				w='100%'
				h='100%'
				bgColor='transparent'
				bgImage={selectedRelease?.logo ? `url(${selectedRelease.logo})` : 'none'}
				bgSize={'cover'}
				bgPos={'center'}
				bgRepeat={'no-repeat'}
				right='0'
				bottom='0'
				pos='absolute'
				filter={`blur(${blurPx}px)`}
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
				<LogoField
					logoSrc={logoSrc}
					isCart={selectedLandingPage?.webpagesTypeId === 2 ? true : false}
					tracks={tracks}
					setTracks={setTracks}
					setTracksInCart={setTracksInCart}
					tracksInCart={tracksInCart}
					setIsAllTracks={setIsAllTracks}
					colors={colors}
					fonts={fonts}
					socialLinksType={socialLinksType}
				/>
				{showSocialLinks && (
					<Box
						pos='absolute'
						right='0'
						top={selectedLandingPage?.webpagesTypeId !== 2 ? 0 : '80px'}
						zIndex={10}
					>
						<WebPageSocialLinks socialLinks={socialLinks} socialLinksType={socialLinksType} />
					</Box>
				)}
				<Flex
					pos='relative'
					flexDir='column'
					w={{ base: '360px', md: '420px', lg: '480px' }}
					align='center'
					mx='auto'
					zIndex={1}
				>
					<Flex
						pos='relative'
						align='center'
						justify='center'
						w={{ base: '360px', md: '420px', lg: '480px' }}
						h={{ base: '360px', md: '420px', lg: '480px' }}
						bgColor='transparent'
					>
						{selectedRelease?.logo ? (
							<Image
								alt='Release logo'
								src={selectedRelease.logo}
								fill
								sizes={{ base: '360px', md: '420px', lg: '480px' }}
							/>
						) : (
							<Text fontWeight='600' fontSize='24px' color='white'>
								The release has no logo
							</Text>
						)}
					</Flex>

					<LandingScreenTitle colors={colors} fonts={fonts} trackTitle={trackTitle} />
					{children}
				</Flex>
			</Box>
		</Flex>
	);
};

export default LandingScreenLayout;
