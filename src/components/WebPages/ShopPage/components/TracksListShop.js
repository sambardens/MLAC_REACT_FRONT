import { Box, Flex, IconButton, Text, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addTrackToBasket from 'src/functions/serverRequests/shop/cart/addTrackToBasket';
import { setUserShop } from 'store/shop/shop-user-slice';

import CustomButton from '@/components/Buttons/CustomButton';
import TrackCardShop from '@/components/CreateWebPages/CreateShop/PreviewComponent/components/TrackCardShop';
import SelectIcon from '@/components/Icons/SelectIcon/SelectIcon';

import SelectedIcon from '@/assets/icons/base/selected.svg';
import UnselectedIcon from '@/assets/icons/base/unselected.svg';

const TracksListShop = ({ closeTracksList, mt }) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const shopUser = useSelector(state => state.shopUser);
	const { selectedRelease, cart, selectedFonts, selectedPalette } = shopUser;

	const [tracksList, setTracksList] = useState(selectedRelease?.tracks || []);
	const [selectedTracksPrice, setSelectedTracksPrice] = useState(null);
	const [isAllSelected, setIsAllSelected] = useState(false);

	const [isAllowAllButton, setIsAllowAllButton] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isAddButtonValid, setIsAddButtonValid] = useState(false);

	const checkIsAddButtonValid = () => {
		const selectedTracks = tracksList.filter(tr => tr.isSelected);
		setIsAddButtonValid(!!selectedTracks.length);
	};

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

	useEffect(() => {
		checkIsAddButtonValid();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tracksList]);

	const checkIsAllowAllButton = markedTracks => {
		const tracksNotFromCart = markedTracks.filter(tr => !tr.isInCart);
		const isAllowSelectAllButton = !!tracksNotFromCart.length;

		setIsAllowAllButton(isAllowSelectAllButton);
	};

	const markTracksFromCart = async () => {
		const markedTracks = tracksList?.map(tr => {
			if (cart.find(cartTrack => cartTrack.id === tr.id)) {
				const markedTrack = { ...tr, isInCart: true, isSelected: false };

				return markedTrack;
			}
			return { ...tr, isInCart: false, isSelected: false };
		});

		setTracksList(markedTracks);

		checkIsAllowAllButton(markedTracks);
	};

	const handleTrackSelection = track => {
		const notChangedTracks = tracksList.filter(tr => tr.id !== track.id);
		const updatedTrack = { ...track, isSelected: !track.isSelected };
		const updatedTracksList = [...notChangedTracks, updatedTrack].sort(
			(a, b) => a.position - b.position,
		);
		setTracksList(updatedTracksList);
	};

	useEffect(() => {
		markTracksFromCart();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cart.length]);

	const handleAddingTracksToCart = async () => {
		if (!isAddButtonValid) {
			getToast('info', 'Attention', 'Please select at least one track');
			return;
		}

		setIsLoading(true);
		// const tracksFromOtherReleases = cart.filter((tr) => tr.releaseId !== selectedRelease.id);
		const selectedTrackFromCurrentRelease = tracksList.filter(tr => tr.isSelected && !tr.isInCart);
		const trackIds = selectedTrackFromCurrentRelease.map(tr => tr.id);
		const resData = await addTrackToBasket({ shopId: shopUser.id, trackIds });
		if (!resData.success) {
			getToast('error', 'Error', resData?.message);
			return;
		}
		getToast('success', 'Success', 'Tracks have been added to the cart!');

		const updatedCartList = [...cart, ...selectedTrackFromCurrentRelease];
		const updatedShop = { ...shopUser, cart: updatedCartList };
		dispatch(setUserShop(updatedShop));

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

			const sortedTracks = [...tracksFromCart, ...selectedTracks].sort(
				(a, b) => a.position - b.position,
			);
			setTracksList(sortedTracks);
			setIsAllSelected(true);
		}

		if (isAllSelected) {
			const notSelectedTracks = tracksNotInCart.map(tr => {
				return { ...tr, isSelected: false };
			});
			const sortedTracks = [...tracksFromCart, ...notSelectedTracks].sort(
				(a, b) => a.position - b.position,
			);
			setTracksList(sortedTracks);
			setIsAllSelected(false);
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
				h='fit-content'
				maxH='296px'
				overflowY={'scroll'}
				css={{
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: selectedPalette.colors[2],
						borderRadius: '4px',
					},
				}}
			>
				{tracksList.map((track, index) => (
					<TrackCardShop
						key={track?.id}
						onClick={() => {
							handleTrackSelection(track);
						}}
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
						>
							Select all
						</Text>
						<IconButton
							size='xs'
							h='24px'
							ml='16px'
							icon={
								isAllSelected ? (
									<SelectIcon color={selectedPalette.colors[2]} bgColor={selectedPalette.colors[0]} />
								) : (
									<UnselectedIcon style={{ color: selectedPalette.colors[0] }} />
								)
							}
							color={selectedPalette.colors[2]}
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
					fontStyle={selectedFonts[1].italic}
					fontFamily={selectedFonts[1].font}
					color={selectedPalette.colors[0]}
					textAlign='center'
				>
					All tracks of the release are already in the cart!
				</Text>
			)}
		</Flex>
	);
};

export default TracksListShop;
