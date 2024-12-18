import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import CustomButton from '@/components/Buttons/CustomButton';
import WebAudioPlayer from '@/components/WebAudioPlayer/WebAudioPlayer';

import DownIcon from '@/assets/icons/base/down.svg';

import SignUpForML from '../../components/SignUpForML/SignUpForML';
import TracksList from '../../components/TracksList/TracksList';

const SellLandingScreenContent = ({
	colors,
	fonts,
	tracks,

	tracksInCart,
	setTracks,
	setTracksInCart,
	isAllTracks,
	setIsAllTracks,
}) => {
	const { releasePrice } = useSelector(state => state.user.selectedRelease);
	const { selectedBap } = useSelector(state => state.user);
	const notAddedTracks = tracks?.filter(el => !el.isSelected);
	const handleBuyAllTracks = () => {
		setTracksInCart(tracks);
		setTracks(tracks.map(el => ({ ...el, isSelected: true })));
		setIsAllTracks(false);
	};
	return (
		<>
			<Box bgColor={colors[1]} p='12px' borderRadius='10px' w='100%' mb='24px'>
				<WebAudioPlayer
					tracks={tracks}
					color={colors[2]}
					textColor={colors[0]}
					fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
				/>
				{notAddedTracks.length > 0 && (
					<Flex justify='space-between' align='center' minH='56px'>
						<Text
							fontFamily={fonts[0].font}
							fontWeight='600'
							fontSize='32px'
							fontStyle={fonts[0].italic === 'italic' ? 'italic' : 'initial'}
							color={colors[0]}
						>
							£{releasePrice}
						</Text>

						<CustomButton
							styles='main'
							minW='200px'
							width='fit-content'
							fontStyle={fonts[2].italic === 'italic' ? 'italic' : 'initial'}
							fontFamily={fonts[2].font}
							fontWeight={fonts[2].weight}
							fontSize={fonts[2].size}
							bgColor={colors[2]}
							color={colors[0]}
							onClickHandler={handleBuyAllTracks}
						>
							Buy full release
						</CustomButton>
					</Flex>
				)}
			</Box>

			{tracks.length > 1 && (
				<Flex
					onClick={() => {
						setIsAllTracks(!isAllTracks);
					}}
					as='button'
					aria-label='Buy individual tracks'
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
						lineHeight={1}
					>
						Buy individual tracks
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
					<TracksList
						tracks={tracks}
						setTracks={setTracks}
						setTracksInCart={setTracksInCart}
						colors={colors}
						fonts={fonts}
						setIsAllTracks={setIsAllTracks}
						tracksInCart={tracksInCart}
					/>
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

export default SellLandingScreenContent;
