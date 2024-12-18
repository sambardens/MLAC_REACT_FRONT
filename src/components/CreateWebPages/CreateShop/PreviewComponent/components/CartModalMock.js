import { Flex, Icon, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import getAccurateCartText from 'src/functions/utils/getAccurateCartText';

import CustomButton from '@/components/Buttons/CustomButton';
import TrackCard from '@/components/WebPages/ShopPage/components/cart/components/TrackCard';

import closeIcon from '@/assets/icons/base/close.svg';

const CartModalMock = ({ closeCart, openPayModal, totalPrice }) => {
	const shop = useSelector(state => state.shop);

	const { cart, selectedPalette, selectedFonts } = shop;

	const payHanlder = () => {
		closeCart();
		openPayModal();
	};

	return (
		<Flex
			position={'absolute'}
			zIndex={20}
			top='81px'
			right='5px'
			flexDir={'column'}
			py='40px'
			w='480px'
			h='548px'
			bgColor={selectedPalette?.colors[1]}
			borderRadius={'10px'}
			boxShadow={'0 0 0 1px Gray'}
		>
			<Icon
				onClick={closeCart}
				as={closeIcon}
				position={'absolute'}
				right='13px'
				top='13px'
				w='24px'
				h='24px'
				cursor='pointer'
				color={selectedPalette?.colors[0]}
				_hover={{ color: selectedPalette?.colors[2] }}
				transition='300ms linear'
			/>

			<Flex justifyContent={'space-between'} alignItems={'center'} mb='28px' px='20px'>
				<Text
					fontWeight={600}
					fontSize={'32px'}
					fontStyle={selectedFonts[0].italic}
					fontFamily={selectedFonts[0].font}
					color={selectedPalette?.colors[0]}
				>
					Cart
				</Text>

				<Text
					fontWeight={500}
					fontSize={'16px'}
					fontStyle={selectedFonts[1].italic}
					fontFamily={selectedFonts[1].font}
					color={selectedPalette?.colors[0]}
				>
					{getAccurateCartText(cart.length)}
				</Text>
			</Flex>

			{cart.length > 0 && (
				<Flex
					as='ul'
					h='100%'
					pl='20px'
					pr='14px'
					gap='16px'
					py='0'
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
					{cart.map(track => (
						<TrackCard
							track={track}
							key={track.id}
							selectedFonts={selectedFonts}
							selectedPalette={selectedPalette}
						/>
					))}
				</Flex>
			)}
			{cart.length < 1 && (
				<Flex h='100%' justifyContent={'center'} alignItems={'center'}>
					<Text
						fontWeight='400'
						fontSize='16px'
						color={selectedPalette?.colors[0]}
						fontStyle={selectedFonts[1].italic}
						fontFamily={selectedFonts[1].font}
						maxW='250px'
						textAlign='center'
					>
						Please select a track or several tracks from the releases
					</Text>
				</Flex>
			)}

			{cart.length > 0 && (
				<Flex justifyContent={'space-between'} mt='32px' px='40px'>
					<Text
						fontWeight={'600'}
						fontSize={'32px'}
						color={selectedPalette?.colors[0]}
						fontStyle={selectedFonts[1].italic}
						fontFamily={selectedFonts[1].font}
					>
						£{totalPrice}
					</Text>
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
	);
};

export default CartModalMock;
