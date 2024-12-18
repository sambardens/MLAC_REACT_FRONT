import { Flex, Icon, Text } from '@chakra-ui/react';

import getAccurateCartText from 'src/functions/utils/getAccurateCartText';

import CustomButton from '@/components/Buttons/CustomButton';

import CloseIcon from '@/assets/icons/base/close.svg';

import TrackCardInWebPages from '../../components/TrackCardInWebPages/TrackCardInWebPages';

const LandingCartModal = ({
	fonts,
	colors,
	onClose,
	openPayModal,
	tracks,
	setTracks,
	tracksInCart,
	setTracksInCart,
	totalPriceInCart,
}) => {
	const handleDeleteTrackFromCart = idToDelete => {
		setTracks(tracks.map(el => (el?.id === idToDelete ? { ...el, isSelected: false } : el)));
		setTracksInCart(tracksInCart.filter(el => el?.id !== idToDelete));
	};
	const handlePay = () => {
		onClose();
		openPayModal();
	};

	return (
		<Flex
			position={'absolute'}
			zIndex={20}
			top='80px'
			right='5px'
			flexDir={'column'}
			py='40px'
			w='480px'
			bgColor={colors[1]}
			borderRadius={'10px'}
			boxShadow={'0 0 0 1px Gray'}
		>
			<Icon
				onClick={onClose}
				as={CloseIcon}
				position={'absolute'}
				right='13px'
				top='13px'
				w='24px'
				h='24px'
				color={colors[0]}
				cursor='pointer'
				_hover={{ color: colors[2] }}
				transition='300ms linear'
			/>

			<Flex justifyContent={'space-between'} alignItems={'center'} mb='28px' px='20px'>
				<Text
					fontWeight={500}
					fontSize='32px'
					fontFamily={fonts[0].font}
					fontStyle={fonts[0].italic === 'italic' ? 'italic' : 'initial'}
					color={colors[0]}
				>
					Cart
				</Text>

				<Text
					fontWeight={500}
					fontSize='16px'
					// fontWeight={fonts[1].weight}
					// fontSize={fonts[1].size}
					fontFamily={fonts[1].font}
					fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
					color={colors[0]}
				>
					{getAccurateCartText(tracksInCart.length)}
				</Text>
			</Flex>

			{tracksInCart.length > 0 && (
				<Flex
					flexDir='column'
					gap='32px'
					h='328px'
					maxH='328px'
					px='20px'
					py='0'
					overflowY={'auto'}
					css={{
						'&::-webkit-scrollbar-thumb': {
							backgroundColor: colors[2],
							borderRadius: '4px',
						},
					}}
				>
					{tracksInCart.map((track, index) => (
						<TrackCardInWebPages
							key={track?.id}
							onDelete={() => {
								handleDeleteTrackFromCart(track?.id);
							}}
							index={index}
							track={track}
							isCart={true}
							colors={colors}
							fonts={fonts}
						/>
					))}
				</Flex>
			)}
			{tracksInCart.length === 0 && (
				<Flex h='416px' justifyContent={'center'} alignItems={'center'}>
					<Text
						fontWeight='400'
						fontSize='16px'
						color={colors[0]}
						fontFamily={fonts[1].font}
						fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
						maxW='250px'
						textAlign='center'
					>
						Please select a track or several tracks from the list
					</Text>
				</Flex>
			)}
			{tracksInCart.length > 0 && (
				<Flex justifyContent={'space-between'} mt='32px' px='20px'>
					<Text
						fontWeight={'600'}
						fontSize={'32px'}
						color={colors[0]}
						fontFamily={fonts[1].font}
						fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
					>
						£{totalPriceInCart}
					</Text>
					<CustomButton
						onClickHandler={handlePay}
						bgColor={colors[2]}
						color={colors[0]}
						fontFamily={fonts[2].font}
						fontWeight={fonts[2].weight}
						fontSize={fonts[2].size}
						fontStyle={fonts[2].italic === 'italic' ? 'italic' : 'initial'}
					>
						Checkout
					</CustomButton>
				</Flex>
			)}
		</Flex>
	);
};

export default LandingCartModal;
