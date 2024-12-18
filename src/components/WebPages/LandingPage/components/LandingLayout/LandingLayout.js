import Image from 'next/image';

import { Box, Flex, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import WebPageLogo from '@/components/WebPageLogo/WebPageLogo';
import WebPageSocialLinks from '@/components/WebPageSocialLinks/WebPageSocialLinks';

import LandingHeader from '../LandingHeader/LandingHeader';
import LandingTitle from '../LandingTitle/LandingTitle';

const LandingLayout = ({
	children,
	setShowAllTracks,
	titleDesign,
	subTitleDesign,
	additionalDesign,
	setShowAuthModal,
	setLandingTracksList,
}) => {
	const { landingInfo } = useSelector(state => state.landing);
	const {
		backgroundBlur = 50,
		releaseLogo,
		releaseName = 'releaseName',
		bapName = 'bapName',
		showSocialLinks,
		socialLinks,
		socialLinksType,
		webpagesTypeId,
		logo,
	} = landingInfo;

	const isNotSell = webpagesTypeId !== 2;
	return (
		<Flex pos='relative' align='center' flexDir='column' minH='100vh'>
			<Box
				position='fixed'
				top='-10px'
				right='-10px'
				bottom='-10px'
				left='-10px'
				w='calc(100% + 20px)'
				h='calc(100% + 20px)'
				bgColor='rgba(0, 0, 0, 0.2)'
				bgPosition='center'
				bgSize='cover'
				bgRepeat='no-repeat'
				zIndex={-1}
				filter={`blur(${backgroundBlur / 4}px)`}
				bgImage={releaseLogo ? `url(${releaseLogo})` : 'none'}
			/>
			<Box display={{ base: isNotSell ? 'none' : 'block', lg: 'block' }}>
				<LandingHeader
					titleDesign={titleDesign}
					subTitleDesign={subTitleDesign}
					additionalDesign={additionalDesign}
					setShowAuthModal={setShowAuthModal}
					setShowAllTracks={setShowAllTracks}
					setLandingTracksList={setLandingTracksList}
				/>
			</Box>
			{showSocialLinks && (
				<Box
					display={{ base: 'none', lg: 'block' }}
					pos='fixed'
					top={isNotSell ? 0 : '80px'}
					right='0'
					zIndex={isNotSell ? 100 : 10}
				>
					<WebPageSocialLinks
						socialLinks={socialLinks}
						socialLinksType={socialLinksType}
						flexDir={isNotSell ? 'raw' : 'column'}
					/>
				</Box>
			)}
			<Box>
				<Flex flexDir='column' pb='60px' pos='relative' zIndex={1} align='center'>
					<Flex flexDir='column' w={{ base: '360px', md: '420px', lg: '480px' }} align='center'>
						<Flex
							pos='relative'
							align='center'
							justify='center'
							w={{ base: '360px', md: '420px', lg: '480px' }}
							h={{ base: '360px', md: '420px', lg: '480px' }}
							bg='gray'
							borderTopRadius={{ base: '10px', lg: '0' }}
							overflow='hidden'
						>
							{releaseLogo ? (
								<Image
									alt='Release logo'
									src={releaseLogo}
									fill
									sizes={{ base: '360px', md: '420px', lg: '480px' }}
									priority={true}
									quality={100}
								/>
							) : (
								<Text fontWeight='600' fontSize='24px' color='white'>
									The release has no logo
								</Text>
							)}
						</Flex>
						<LandingTitle titleDesign={titleDesign} subTitleDesign={subTitleDesign} />
						{children}
						<Box display={{ base: isNotSell ? 'block' : 'none', lg: 'none' }} mt='24px'>
							<WebPageLogo logoSrc={logo} socialLinksType={socialLinksType} />
						</Box>
					</Flex>
				</Flex>
			</Box>
		</Flex>
	);
};

export default LandingLayout;
