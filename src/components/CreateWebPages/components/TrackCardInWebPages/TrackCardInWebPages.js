import { Flex, IconButton, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { pauseAllTracks, setCurrentIndex, startPlayAllTracks } from 'store/audio/audio-slice';

import SelectIcon from '@/components/Icons/SelectIcon/SelectIcon';
import CartIcon from '@/components/VisualElements/CartIcon';

import CloseIcon from '@/assets/icons/base/close.svg';
import UnselectedIcon from '@/assets/icons/base/unselected.svg';

const TrackCardInWebPages = ({
	track,
	onClick,
	colors,
	fonts,
	isCart = false,
	onDelete,
	index,
	tracksInCart,
}) => {
	const { selectedLandingPage } = useSelector(state => state.user);
	const { currentIndex, isPlayAllTracks } = useSelector(state => state.audio);
	const webpagesTypeId = selectedLandingPage?.webpagesTypeId;
	const isInCart = tracksInCart?.length > 0 && tracksInCart.find(el => el.id === track.id);
	const dispatch = useDispatch();

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
		<Flex as='li' justify='space-between' w='100%' align='center'>
			<Text
				color={colors[0]}
				fontFamily={fonts[1].font}
				fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
				fontWeight='400'
				fontSize='16px'
				as={isCart ? 'p' : 'button'}
				onClick={handlePlayTrack}
				isTruncated={true}
				maxW={isCart ? '335px' : '395px'}
				_hover={{ color: !isCart && colors[2] }}
				transition='0.3s linear'
			>
				{index + 1}. {track?.name}
			</Text>
			<Flex align='center' ml='16px'>
				{webpagesTypeId === 2 && track?.price && (
					<Text
						fontWeight='500'
						fontSize='16px'
						color={colors[0]}
						mr='16px'
						fontFamily={fonts[1].font}
						fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
					>
						£{track?.price}
					</Text>
				)}
				{!isCart && (
					<>
						{isInCart ? (
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
				{isCart && (
					<IconButton
						size='xs'
						h='24px'
						ml='16px'
						aria-label={`delete track ${track?.name} from the cart`}
						color={colors[0]}
						icon={<CloseIcon />}
						onClick={onDelete}
						_hover={{ color: colors[2] }}
						transition='300ms linear'
					/>
				)}
			</Flex>
		</Flex>
	);
};

export default TrackCardInWebPages;
