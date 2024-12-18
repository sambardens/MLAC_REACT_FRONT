import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import createZipAndDownload from 'src/functions/utils/createZipAndDownload';

import CustomButton from '@/components/Buttons/CustomButton';
import WebAudioPlayer from '@/components/WebAudioPlayer/WebAudioPlayer';

import DownIcon from '@/assets/icons/base/down.svg';

import SignUpForML from '../../components/SignUpForML/SignUpForML';
import TracksList from '../../components/TracksList/TracksList';

const DownloadLandingSreenContent = ({
	colors,
	fonts,
	tracks,
	setTracks,
	isAllTracks,
	setIsAllTracks,
}) => {
	const { selectedRelease, selectedBap } = useSelector(state => state.user);

	return (
		<>
			<Flex bgColor={colors[1]} p='12px' borderRadius='10px' w='100%' mb='24px' flexDir='column'>
				<WebAudioPlayer tracks={tracks} color={colors[2]} isFullTrack={true} textColor={colors[0]} />

				<CustomButton
					w='200px'
					onClickHandler={() =>
						createZipAndDownload({ tracks, name: selectedRelease.name, artwork: selectedRelease.logo })
					}
					color={colors[0]}
					bgColor={colors[2]}
					fontStyle={fonts[2].italic === 'italic' ? 'italic' : 'initial'}
					fontFamily={fonts[2].font}
					fontWeight={fonts[2].weight}
					fontSize={fonts[2].size}
					ml='auto'
				>
					{tracks?.length > 1 ? 'Download all' : 'Download'}
				</CustomButton>
			</Flex>
			{tracks?.length > 1 && (
				<Flex
					onClick={() => {
						setIsAllTracks(!isAllTracks);
					}}
					as='button'
					aria-label='Download individual tracks'
					align='center'
					cursor='pointer'
					mb='24px'
					color={colors[0]}
				>
					<Text
						fontFamily={fonts[1].font}
						fontWeight={fonts[1].weight}
						fontSize={fonts[1].size}
						fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
						color={colors[0]}
					>
						Download individual tracks
					</Text>
					<Icon
						as={DownIcon}
						ml='10px'
						boxSize='24px'
						transform={isAllTracks ? 'rotate(180deg)' : 'none'}
						transition='0.3s linear'
					/>
				</Flex>
			)}
			<Box mb='40px' w='100%'>
				{isAllTracks && (
					<TracksList tracks={tracks} setTracks={setTracks} colors={colors} fonts={fonts} />
				)}
				<SignUpForML
					fontFamily={fonts[2].font}
					fontStyle={fonts[2].italic}
					fontWeight={fonts[2].weight}
					fontSize={fonts[2].size}
					textColor={colors[0]}
					buttonColor={colors[2]}
					isСonstructor={true}
					mt={isAllTracks ? '40px' : '80px'}
					bapName={selectedBap?.bapName}
				/>
			</Box>
		</>
	);
};

export default DownloadLandingSreenContent;
