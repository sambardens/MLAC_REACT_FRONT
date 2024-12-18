import { Box, Flex, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

const SpotifyReleaseCardVersionType = ({ release, getReleaseTracks }) => {
	const { selectedRelease } = useSelector(state => state.user);
	const spotifyLogo = release?.images[1]?.url;
	const releaseSpotifyId = release?.id;
	const { releases } = useSelector(state => state.user.selectedBap);
	const isCurrentRelease = releaseSpotifyId === selectedRelease.releaseSpotifyId;
	const isCurrentReleaseNotDuplicate = isCurrentRelease && !selectedRelease.isDuplicate;
	const isExisting = releases.find(el => el.releaseSpotifyId === releaseSpotifyId);

	const isActive = isCurrentReleaseNotDuplicate || !isExisting;
	return (
		<Flex
			as='li'
			w='200px'
			h='200px'
			borderRadius='10px'
			bg='accent'
			pos='relative'
			bgImage={`url(${spotifyLogo})`}
			bgSize='100% 100%'
			bgPosition='center'
			onClick={() => {
				isActive && getReleaseTracks(releaseSpotifyId);
			}}
			borderColor='transparent'
			_hover={{ boxShadow: isActive && '0px 2px 4px 2px rgba(0, 0, 0, 0.2)' }}
			cursor={isActive ? 'pointer' : 'initial'}
			filter={isActive ? null : 'brightness(0.5)'}
			overflow='hidden'
			flexDir='column'
			justify='flex-end'
		>
			<Box bgColor='gray' p='12px' w='100%' align='center'>
				<Text
					wordBreak='break-word'
					fontWeight='500'
					fontSize='16px'
					color='white'
					isTruncated={true}
					align='center'
				>
					{release?.name}
				</Text>
				<Text fontWeight='400' fontSize='14px' color='white' align='center'>
					{release?.release_date}
				</Text>
			</Box>
			{isExisting && (
				<Text
					position={'absolute'}
					top='12px'
					right='16px'
					px='8px'
					py='4px'
					bg={'accent'}
					fontWeight={'400'}
					fontSize={'14px'}
					color='white'
					borderRadius={'31px'}
					pointerEvents='none'
				>
					{isCurrentRelease ? 'Current release' : 'On Major Labl'}
				</Text>
			)}
		</Flex>
	);
};

export default SpotifyReleaseCardVersionType;
