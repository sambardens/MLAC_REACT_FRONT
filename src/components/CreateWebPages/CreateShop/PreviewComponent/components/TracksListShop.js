import { Box, Flex, IconButton, Text, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sortTracksById } from 'src/functions/utils/web-pages/shop/sortTracksById';
import { setShop } from 'store/shop/shop-slice';

import CustomButton from '@/components/Buttons/CustomButton';
import SelectIcon from '@/components/Icons/SelectIcon/SelectIcon';

import UnselectedIcon from '@/assets/icons/base/unselected.svg';

import TrackCardShop from './TrackCardShop';

const TracksListShop = ({ closeTracksList, mt }) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const shop = useSelector(state => state.shop);
	const { selectedRelease, cart, selectedFonts, selectedPalette } = shop;
	const [tracksList, setTracksList] = useState(selectedRelease?.tracks || []);
	const [selectedTracksPrice, setSelectedTracksPrice] = useState(null);
	const [isAllSelected, setIsAllSelected] = useState(false);

	const [isAllowAllButton, setIsAllowAllButton] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isAddButtonValid, setIsAddButtonValid] = useState(false);

	const getToast = (status, title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status,
			duration: 5000,
			isClosable: true,
		});
	};
	const checkIsAddButtonValid = () => {
		const selectedTracks = tracksList.filter(tr => tr.isSelected);
		setIsAddButtonValid(!!selectedTracks.length);
	};

	useEffect(() => {
		checkIsAddButtonValid();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tracksList]);

	const checkIsAllowAllButton = markedTracks => {
		const tracksNotFromCart = markedTracks.filter(tr => !tr.isInCart);
		const isAllowSelectAllButton = !!tracksNotFromCart.length;

		setIsAllowAllButton(isAllowSelectAllButton);
	};

	const markTracksFromCart = () => {
		const markedTracks = tracksList?.map(tr => {
			if (cart.find(cartTrack => cartTrack.id === tr.id)) {
				const markedTrack = { ...tr, isInCart: true, isSelected: false };

				return markedTrack;
			}

			const notMarkedTrack = { ...tr, isInCart: false, isSelected: false };

			return notMarkedTrack;
		});

		setTracksList(markedTracks);

		checkIsAllowAllButton(markedTracks);
	};

	const handleTrackSelection = track => {
		const notChangedTracks = tracksList.filter(tr => tr.id !== track.id);
		const updatedTrack = { ...track, isSelected: !track.isSelected };
		const updatedTracksList = [...notChangedTracks, updatedTrack];
		updatedTracksList.sort((a, b) => a.id - b.id);
		setTracksList(updatedTracksList);
		// checkIsAddButtonValid(updatedTracksList);
	};

	useEffect(() => {
		markTracksFromCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cart.length]);

	const handleAddingTracksToCart = async () => {
		if (!isAddButtonValid) {
			getToast('error', 'Error', 'Please select at least one track');
			return;
		}

		setIsLoading(true);
		// const tracksFromOtherReleases = cartTracks.filter((tr) => tr.releaseId !== selectedRelease.id);
		const selectedTrackFromCurrentRelease = tracksList.filter(tr => tr.isSelected && !tr.isInCart);
		const selectedIds = selectedTrackFromCurrentRelease.map(tr => tr.id);
		const data = JSON.stringify({
			trackIds: selectedIds,
		});
		getToast('success', 'Success', 'Tracks have been added to the cart!');

		const updatedCartList = [...cart, ...selectedTrackFromCurrentRelease];
		const updatedShop = { ...shop, cart: updatedCartList };
		dispatch(setShop(updatedShop));
		setIsLoading(false);

		closeTracksList();
	};

	useEffect(() => {
		const notSelectedTracks = tracksList.filter(tr => !tr.isSelected && !tr.isInCart);

		if (!notSelectedTracks.length) {
			setIsAllSelected(true);
			setSelectedTracksPrice(selectedRelease.releasePrice);
		} else {
			setIsAllSelected(false);
			const selectedTracks = tracksList.filter(tr => tr.isSelected);
			const sum = selectedTracks.length
				? selectedTracks?.reduce((acc, track) => acc + Number(track.price), 0)
				: 0;

			setSelectedTracksPrice(sum);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tracksList]);

	const handleSelectedAll = () => {
		const tracksFromCart = tracksList.filter(tr => tr.isInCart);
		const tracksNotInCart = tracksList.filter(tr => !tr.isInCart);

		if (!isAllSelected) {
			const selectedTracks = tracksNotInCart.map(tr => {
				return { ...tr, isSelected: true };
			});
			const sortedTracks = sortTracksById([...tracksFromCart, ...selectedTracks]);
			setTracksList(sortedTracks);
			setIsAllSelected(true);
			// checkIsAddButtonValid(selectedTracks);
		}

		if (isAllSelected) {
			const notSelectedTracks = tracksNotInCart.map(tr => {
				return { ...tr, isSelected: false };
			});
			const sortedTracks = sortTracksById([...tracksFromCart, ...notSelectedTracks]);
			setTracksList(sortedTracks);
			setIsAllSelected(false);
			// checkIsAddButtonValid(notSelectedTracks);
		}
	};

	return (
		<Flex
			flexDir={'column'}
			justifyContent={'space-between'}
			borderRadius='10px'
			py='12px'
			w='100%'
			h='fit-content'
			bgColor={selectedPalette.colors[1]}
			mt={mt}
			boxShadow={'1px 1px 3px Gray'}
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
						backgroundColor: selectedPalette.colors[2],
						borderRadius: '4px',
					},
				}}
			>
				{tracksList.map((track, index) => (
					<TrackCardShop
						onClick={() => {
							handleTrackSelection(track);
						}}
						key={track?.id}
						index={index}
						track={track}
						colors={selectedPalette.colors}
						fonts={selectedFonts}
					/>
				))}
			</Flex>

			{isAllowAllButton ? (
				<>
					<Flex px='12px' mt='12px' justify='flex-end' align='center'>
						<Text
							color={selectedPalette.colors[0]}
							fontFamily={selectedFonts[1].font}
							fontStyle={selectedFonts[1].italic}
							py='4px'
						>
							Select all
						</Text>
						<IconButton
							size='xs'
							h='24px'
							aria-label={`${isAllSelected ? 'Unselect' : 'Select'} to buy all tracks of the release`}
							icon={
								isAllSelected ? (
									<SelectIcon color={selectedPalette.colors[2]} bgColor={selectedPalette.colors[0]} />
								) : (
									<UnselectedIcon style={{ color: selectedPalette.colors[0] }} />
								)
							}
							ml='16px'
							onClick={handleSelectedAll}
						/>
					</Flex>

					<Flex alignItems={'center'} justifyContent={'space-between'} mt='8px' px='12px'>
						<Text
							fontWeight='600'
							fontSize='32px'
							color={selectedPalette.colors[0]}
							fontStyle={selectedFonts[1].italic}
							fontFamily={selectedFonts[1].font}
						>
							£{selectedTracksPrice}
						</Text>
						<Box onClick={handleAddingTracksToCart}>
							<CustomButton
								ml='auto'
								w='200px'
								minH='56px'
								styles={isAddButtonValid ? true : 'disabled'}
								bgColor={selectedPalette.colors[2]}
								color={selectedPalette.colors[0]}
								fontStyle={selectedFonts[2].italic}
								fontFamily={selectedFonts[2].font}
								fontWeight={selectedFonts[2].weight}
								fontSize={selectedFonts[2].size}
								isSubmiting={isLoading}
							>
								Add to cart
							</CustomButton>
						</Box>
					</Flex>
				</>
			) : (
				<Text
					mt='16px'
					px='12px'
					fontWeight='600'
					textAlign='center'
					fontSize='16px'
					fontStyle={selectedFonts[1].italic}
					fontFamily={selectedFonts[1].font}
					color={selectedPalette.colors[0]}
				>
					All tracks of the release are already in the cart!
				</Text>
			)}
		</Flex>
	);
};

export default TracksListShop;
