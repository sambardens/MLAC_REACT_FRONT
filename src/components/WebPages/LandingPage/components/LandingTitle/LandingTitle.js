import { Box, Heading, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

const LandingTitle = ({ titleDesign, subTitleDesign }) => {
	const {
		landingInfo: {
			releaseName = 'releaseName',
			bapName = 'bapName',
			webpagesTypeId,
			trackIdForStreaming,
			tracks,
		},
	} = useSelector(state => state.landing);

	const getTitle = () => {
		if (trackIdForStreaming) {
			const currentTrack = tracks.find(el => el.id === trackIdForStreaming);
			return currentTrack?.name || releaseName;
		} else {
			return releaseName;
		}
	};

	return (
		<Box
			py='16px'
			bgColor={subTitleDesign?.hex}
			w='100%'
			borderBottomRadius='10px'
			mb={webpagesTypeId === 3 ? '0' : '24px'}
		>
			<Heading
				as='h2'
				fontFamily={titleDesign?.font}
				fontWeight={titleDesign?.weight}
				fontSize={titleDesign?.size}
				fontStyle={titleDesign?.italic ? 'italic' : 'initial'}
				color={titleDesign?.hex}
				mb='6px'
				align='center'
				lineHeight={1.2}
			>
				{getTitle()}
			</Heading>
			<Text
				fontFamily={titleDesign?.font}
				fontWeight={subTitleDesign?.weight}
				fontSize={subTitleDesign?.size}
				fontStyle={titleDesign?.italic ? 'italic' : 'initial'}
				color={titleDesign?.hex}
				align='center'
				lineHeight={1.2}
			>
				{bapName}
			</Text>
		</Box>
	);
};

export default LandingTitle;
