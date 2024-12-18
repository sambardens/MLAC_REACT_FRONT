import { Flex, IconButton, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import createZipAndDownload from 'src/functions/utils/createZipAndDownload';

import CustomButton from '@/components/Buttons/CustomButton';
import SelectIcon from '@/components/Icons/SelectIcon/SelectIcon';

import UnselectedIcon from '@/assets/icons/base/unselected.svg';

import TrackCardInWebPages from '../TrackCardInWebPages/TrackCardInWebPages';

const TracksList = ({
	tracks,
	setTracks,
	tracksInCart,
	setTracksInCart,
	colors,
	fonts,
	setIsAllTracks,
}) => {
	const { selectedLandingPage, selectedRelease } = useSelector(state => state.user);
	const webpagesTypeId = selectedLandingPage?.webpagesTypeId;
	const selectedTracks = tracks.filter(track => track.isSelected);

	const selectedTracksPrice = selectedTracks.length
		? selectedTracks.reduce((acc, track) => acc + track.price, 0)
		: 0;

	const handleChange = trackId => {
		setTracks(tracks.map(el => (el.id === trackId ? { ...el, isSelected: !el.isSelected } : el)));
	};

	const handleAddTracksToCart = () => {
		setTracksInCart(tracks.filter(el => el.isSelected));
		setIsAllTracks(false);
	};
	const isAllSelected = tracks.every(track => track.isSelected);
	const handleSelectAll = () => {
		if (isAllSelected) {
			setTracks(tracks.map(el => ({ ...el, isSelected: false })));
		} else {
			setTracks(tracks.map(el => ({ ...el, isSelected: true })));
		}
	};
	const isAllTracksInCart = tracks?.length === tracksInCart?.length;

	return (
		<Flex
			flexDir='column'
			justifyContent='space-between'
			borderRadius='10px'
			py='12px'
			w='100%'
			h='fit-content'
			bgColor={colors[1]}
		>
			<Flex
				as='ul'
				flexDir='column'
				gap='12px'
				pl='12px'
				pr='6px'
				maxH='296px'
				overflowY='scroll'
				css={{
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: colors[2],
						borderRadius: '4px',
					},
				}}
			>
				{tracks.map((track, index) => (
					<TrackCardInWebPages
						key={track?.id}
						index={index}
						track={track}
						colors={colors}
						fonts={fonts}
						tracksInCart={tracksInCart}
						onClick={() => {
							handleChange(track?.id);
						}}
					/>
				))}
			</Flex>
			{!isAllTracksInCart && tracks.length > 1 && (
				<Flex px='12px' mt='12px' justify='flex-end' align='center'>
					<Text
						py='4px'
						color={colors[0]}
						fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
						fontFamily={fonts[1].font}
					>
						Select All
					</Text>
					<IconButton
						size='xs'
						h='24px'
						aria-label={`${isAllSelected ? 'Unselect' : 'Select'} to buy all tracks of the release`}
						icon={
							isAllSelected ? (
								<SelectIcon color={colors[2]} bgColor={colors[0]} />
							) : (
								<UnselectedIcon style={{ color: colors[0] }} />
							)
						}
						onClick={handleSelectAll}
						ml='16px'
					/>
				</Flex>
			)}
			{webpagesTypeId === 1 ? (
				<Flex mt='16px' px='12px'>
					<CustomButton
						ml='auto'
						w='200px'
						bgColor={colors[2]}
						color={colors[0]}
						fontFamily={fonts[2].font}
						fontWeight={fonts[2].weight}
						fontSize={fonts[2].size}
						fontStyle={fonts[2].italic === 'italic' ? 'italic' : 'initial'}
						styles={selectedTracks?.length > 0 ? 'main' : 'disabled'}
						disabledColor={colors[0]}
						onClickHandler={() =>
							createZipAndDownload({
								tracks: selectedTracks,
								name: selectedRelease.name,
								artwork: selectedRelease.logo,
							})
						}
					>
						Download
					</CustomButton>
				</Flex>
			) : (
				<>
					{isAllTracksInCart ? (
						<Text
							color={colors[0]}
							fontFamily={fonts[1].font}
							fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
							fontSize='16px'
							fontWeight='600'
							mt='16px'
							align='center'
						>
							All tracks of the release are already in the cart!
						</Text>
					) : (
						<Flex mt='16px' px='12px'>
							<Text
								fontFamily={fonts[0].font}
								fontWeight={fonts[0].weight}
								fontSize={fonts[0].size}
								fontStyle={fonts[0].italic === 'italic' ? 'italic' : 'initial'}
								color={colors[0]}
							>
								£{isAllSelected ? selectedRelease.releasePrice : selectedTracksPrice}
							</Text>
							<CustomButton
								ml='auto'
								w='200px'
								bgColor={colors[2]}
								color={colors[0]}
								fontFamily={fonts[2].font}
								fontWeight={fonts[2].weight}
								fontSize={fonts[2].size}
								fontStyle={fonts[2].italic === 'italic' ? 'italic' : 'initial'}
								onClickHandler={handleAddTracksToCart}
								disabledColor={colors[0]}
								styles={selectedTracks?.length > 0 ? 'main' : 'disabled'}
							>
								Add to cart
							</CustomButton>
						</Flex>
					)}
				</>
			)}
		</Flex>
	);
};

export default TracksList;
