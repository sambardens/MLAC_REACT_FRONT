import { Box, Heading, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

const LandingScreenTitle = ({ fonts, colors, trackTitle }) => {
	const { selectedRelease, selectedBap, selectedLandingPage } = useSelector(state => state.user);

	const webpagesTypeId = selectedLandingPage?.webpagesTypeId;
	return (
		<Box
			py='16px'
			bgColor={colors[1]}
			w='100%'
			borderBottomRadius='10px'
			mb={webpagesTypeId === 3 ? '0' : '24px'}
		>
			<Heading
				as='h2'
				fontFamily={fonts[0].font}
				fontWeight={fonts[0].weight}
				fontSize={fonts[0].size}
				fontStyle={fonts[0].italic === 'italic' ? 'italic' : 'initial'}
				color={colors[0]}
				mb='6px'
				align='center'
				lineHeight={1.2}
			>
				{trackTitle || selectedRelease?.name}
			</Heading>
			<Text
				fontFamily={fonts[1].font}
				fontWeight={fonts[1].weight}
				fontSize={fonts[1].size}
				fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
				color={colors[0]}
				align='center'
				lineHeight={1.2}
			>
				{selectedBap?.bapName}
			</Text>
		</Box>
	);
};

export default LandingScreenTitle;
