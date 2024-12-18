import { Flex, Text } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRelease } from 'store/shop/shop-slice';

const PreviewReleaseCard = ({ rel, closeModal }) => {
	const dispatch = useDispatch();
	const shop = useSelector(state => state.shop);
	const { selectedBap } = useSelector(state => state.user);

	const tracksInDeals = selectedBap?.splitsAndContracts
		.filter(el => el.status === 1)
		.map(el => el.splitTracks)
		.flat();

	const releaseTracks = [];
	if (tracksInDeals?.length > 0) {
		tracksInDeals.forEach(el => {
			const trackToRelease = rel.tracks.find(track => track.id === el.trackId);

			if (trackToRelease) {
				releaseTracks.push(trackToRelease);
			}
		});
	}
	const updatedRelease = { ...rel, tracks: releaseTracks };
	const handleReleaseSelection = () => {
		dispatch(setSelectedRelease(updatedRelease));

		if (closeModal) {
			closeModal();
		}
	};

	return (
		<Flex
			onClick={handleReleaseSelection}
			alignItems={'end'}
			minW='200px'
			minH='200px'
			bgImage={rel.logoSrc}
			bgSize={'cover'}
			bgColor='secondary'
			borderRadius='10px'
			cursor='pointer'
			as='li'
			// boxShadow={'1px 1px 3px Gray'}
		>
			<Flex
				flexDir={'column'}
				w='100%'
				h='fit-content'
				minH='65px'
				p='10px'
				bgColor={'bg.blackSubstrate'}
				color={'white'}
				borderRadius={'0px 0px 10px 10px'}
			>
				<Text
					fontFamily={shop.selectedFonts[1].font}
					fontStyle={shop.selectedFonts[1].italic}
					fontWeight={shop.selectedFonts[1].weight}
					fontSize={shop.selectedFonts[1].size}
				>
					{rel.name || rel.title}
				</Text>
				<Text
					mt='7px'
					fontFamily={shop.selectedFonts[2].font}
					fontStyle={shop.selectedFonts[2].italic}
					fontWeight={shop.selectedFonts[2].weight}
					fontSize={shop.selectedFonts[2].size * 0.8}
				>
					{rel.formattedDate || rel.date}
				</Text>
			</Flex>
		</Flex>
	);
};

export default PreviewReleaseCard;
