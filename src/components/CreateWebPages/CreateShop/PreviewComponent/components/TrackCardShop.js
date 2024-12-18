import { Flex, IconButton, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { pauseAllTracks, setCurrentIndex, startPlayAllTracks } from 'store/audio/audio-slice';

import SelectIcon from '@/components/Icons/SelectIcon/SelectIcon';
import CartIcon from '@/components/VisualElements/CartIcon';

import CloseIcon from '@/assets/icons/base/close.svg';
import UnselectedIcon from '@/assets/icons/base/unselected.svg';

const TrackCardShop = ({ track, onClick, fonts, isCart = false, onDelete, colors, index }) => {
	const dispatch = useDispatch();
	const { currentIndex, isPlayAllTracks } = useSelector(state => state.audio);

	const handlePlayTrack = () => {
		if (isCart) return;
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
		<Flex as='li' justifyContent={'space-between'} w='100%' align='center'>
			<Text
				as={isCart ? 'p' : 'button'}
				onClick={handlePlayTrack}
				py='4px'
				fontWeight={'400'}
				fontSize={'16px'}
				fontFamily={fonts[1].font}
				fontStyle={fonts[1].italic}
				color={colors[0]}
				_hover={{ color: !isCart && colors[2] }}
				transition='0.3s linear'
				isTruncated={true}
				maxW={{ base: '275px', md: '335px', lg: '395px' }}
			>
				{index + 1}. {track?.name}
			</Text>

			<Flex align='center' ml='16px'>
				<Text
					fontWeight='500'
					fontSize='16px'
					fontFamily={fonts[1].font}
					fontStyle={fonts[1].italic}
					color={colors[0]}
					mr='16px'
					lineHeight={1}
				>
					£{Number(track?.price)}
				</Text>
				{isCart ? (
					<IconButton
						size='xs'
						h='24px'
						aria-label={`delete track ${track?.name} from the cart`}
						icon={<CloseIcon />}
						color={colors[0]}
						onClick={onDelete}
						_hover={{ color: colors[2] }}
					/>
				) : (
					<>
						{track.isInCart ? (
							<CartIcon mainColor={colors[0]} elColor={colors[2]} isHover={false} />
						) : (
							<IconButton
								size='xs'
								h='24px'
								aria-label={`${track.isSelected ? 'Unselect' : 'select'} to buy track ${track?.name}`}
								icon={
									track.isSelected ? (
										<SelectIcon color={colors[2]} bgColor={colors[0]} />
									) : (
										<UnselectedIcon style={{ color: colors[0] }} />
									)
								}
								onClick={onClick}
							/>
						)}
					</>
				)}
			</Flex>
		</Flex>
	);
};

export default TrackCardShop;
