import { Box, Flex, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import getAccurateCartText from 'src/functions/utils/getAccurateCartText';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomModal from '@/components/Modals/CustomModal';

import TrackCard from './components/TrackCard';

const CartModal = ({ totalPrice, closeCart, openPayModal }) => {
	const shopUser = useSelector(state => state.shopUser);
	const { selectedPalette, selectedFonts } = shopUser;
	const tracks = shopUser.cart;

	const payHanlder = () => {
		closeCart();
		openPayModal();
	};

	return (
		<CustomModal
			closeModal={closeCart}
			flexDir={'column'}
			w={{ base: '420px', lg: '480px' }}
			p='40px 0'
			right='6px'
			top='80px'
			h='548px'
			bgColor={selectedPalette?.colors[1]}
			closeIconColor={selectedPalette?.colors[0]}
			closeIconHoverColor={selectedPalette?.colors[2]}
		>
			<Flex flexDir={'column'} justifyContent={'space-between'} h='100%'>
				<Box>
					<Flex justifyContent={'space-between'} alignItems={'center'} px='20px' mb='28px'>
						<Text
							fontWeight={'600'}
							fontSize={'32px'}
							fontStyle={selectedFonts[0].italic}
							fontFamily={selectedFonts[0].font}
							color={selectedPalette?.colors[0]}
						>
							Cart
						</Text>

						<Text
							fontWeight={'500'}
							fontSize={'16px'}
							fontStyle={selectedFonts[1].italic}
							fontFamily={selectedFonts[1].font}
							color={selectedPalette?.colors[0]}
						>
							{getAccurateCartText(tracks?.length)}
						</Text>
					</Flex>

					{tracks.length > 0 && (
						<Flex
							as='ul'
							h='100%'
							pl='20px'
							pr='10px'
							gap='16px'
							overflowY={'scroll'}
							flexDir='column'
							maxH='304px'
							css={{
								'&::-webkit-scrollbar-thumb': {
									backgroundColor: selectedPalette.colors[2],
									borderRadius: '4px',
								},
							}}
						>
							{tracks.map(track => (
								<TrackCard
									key={track.id}
									track={track}
									selectedFonts={selectedFonts}
									selectedPalette={selectedPalette}
								/>
							))}
						</Flex>
					)}
					{tracks.length < 1 && (
						<Flex position='absolute' top='50%' right='50%' transform={'translate(50%, -50%)'}>
							<Text
								mt='32px'
								fontStyle={selectedFonts[1].italic}
								fontFamily={selectedFonts[1].font}
								color={selectedPalette?.colors[0]}
								maxW='250px'
								textAlign='center'
							>
								Please select a track or several tracks from the releases
							</Text>
						</Flex>
					)}
				</Box>

				{tracks.length > 0 && (
					<Flex
						justifyContent={'space-between'}
						mt='32px'
						px='20px'
						fontWeight={'600'}
						fontSize={'32px'}
						color={selectedPalette?.colors[0]}
						fontStyle={selectedFonts[1].italic}
						fontFamily={selectedFonts[1].font}
					>
						£{totalPrice}
						<CustomButton
							onClickHandler={payHanlder}
							styles={true}
							bgColor={selectedPalette?.colors[2]}
							color={selectedPalette?.colors[0]}
							fontStyle={selectedFonts[2].italic}
							fontFamily={selectedFonts[2].font}
							fontSize={selectedFonts[2].size}
							fontWeight={selectedFonts[2].weight}
						>
							Checkout
						</CustomButton>
					</Flex>
				)}
			</Flex>
		</CustomModal>
	);
};

export default CartModal;
