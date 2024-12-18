import { Flex, IconButton, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { pauseAllTracks, setCurrentIndex, startPlayAllTracks } from 'store/audio/audio-slice';
import { deleteTrackFromCart } from 'store/landing/landing-operations';

import SelectIcon from '@/components/Icons/SelectIcon/SelectIcon';
import RingLoader from '@/components/Loaders/RingLoader';
import CartIcon from '@/components/VisualElements/CartIcon';

import CloseIcon from '@/assets/icons/base/close.svg';
import UnselectedIcon from '@/assets/icons/base/unselected.svg';

const LandingTrack = ({ track, index, onClick, titleDesign, subTitleDesign, additionalDesign, isLandingCart = false, setLandingTracksList }) => {
	const { cart, landingInfo } = useSelector(state => state.landing);
	const { currentIndex, isPlayAllTracks } = useSelector(state => state.audio);
	const [isLoading, setIsLoading] = useState(false);
	const isInCart = cart.length > 0 && cart.find(el => el.id === track.id);
	const dispatch = useDispatch();
	const toast = useToast();
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

	const handleDeleteTrackFromCart = async trackId => {
		setIsLoading(true);
		const res = await dispatch(deleteTrackFromCart({ trackId, landingPageId: landingInfo.id }));
		if (res?.payload?.success) {
			setLandingTracksList(prev => prev.map(el => (el.id === res?.payload?.trackId ? { ...el, isSelected: false } : el)));
			getToast('success', 'Success', `Track ${track.name} has been deleted from the cart`);
		} else {
			getToast('error', 'Error', `Something went wrong. Track ${track.name} has not been deleted from the cart`);
		}
		setIsLoading(false);
	};

	const handlePlayTrack = () => {
		if (isLandingCart) return;
		if (currentIndex === index) {
			if (isPlayAllTracks) {
				dispatch(pauseAllTracks());
			} else {
				dispatch(startPlayAllTracks());
			}
		} else {
			dispatch(setCurrentIndex(index));
			dispatch(startPlayAllTracks());
		}
	};

	return (
		<Flex as='li' w='100%' align='center' py='4px'>
			<Flex justify='space-between' w='100%' align='center'>
				<Text
					fontFamily={subTitleDesign.font}
					fontStyle={subTitleDesign.italic ? 'italic' : 'initial'}
					color={titleDesign?.hex}
					fontWeight='400'
					fontSize='16px'
					isTruncated={true}
					maxW={isLandingCart ? { base: '300px', lg: '350px' } : { base: '275px', md: '335px', lg: '395px' }}
					as={isLandingCart ? 'p' : 'button'}
					onClick={handlePlayTrack}
					cursor={isLandingCart ? 'initial' : 'pointer'}
					_hover={{ color: !isLandingCart && additionalDesign?.hex }}
					transition='0.3s linear'
				>
					{index + 1}. {track.name}
				</Text>
				<Flex align='center'>
					{landingInfo.webpagesTypeId === 2 && track?.price && (
						<Text fontWeight='500' fontSize='16px' color={titleDesign?.hex} fontFamily={subTitleDesign.font} fontStyle={subTitleDesign.italic ? 'italic' : 'initial'} mr='16px' ml='6px'>
							£{track?.price}
						</Text>
					)}
					{!isLandingCart && (
						<>
							{isInCart ? (
								<CartIcon mainColor={titleDesign?.hex} elColor={additionalDesign?.hex} isHover={false} />
							) : (
								<IconButton
									minW='24px'
									h='24px'
									aria-label={`${track.isSelected ? 'Unselect' : 'select'} to buy track ${track?.name}`}
									color={additionalDesign?.hex}
									icon={track.isSelected ? <SelectIcon color={additionalDesign.hex} bgColor={titleDesign.hex} /> : <UnselectedIcon style={{ color: titleDesign.hex }} />}
									onClick={() => onClick(track.id, isInCart)}
									mr='lpx'
									disabled={isInCart}
								/>
							)}
						</>
					)}
					{isLandingCart && (
						<>
							{isLoading ? (
								<RingLoader w='24px' h='24px' />
							) : (
								<IconButton
									size='xs'
									h='24px'
									aria-label={`delete track ${track?.name} from the cart`}
									color={titleDesign?.hex}
									icon={<CloseIcon />}
									onClick={() => handleDeleteTrackFromCart(track?.id)}
									_hover={{ color: additionalDesign?.hex }}
								/>
							)}
						</>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default LandingTrack;
