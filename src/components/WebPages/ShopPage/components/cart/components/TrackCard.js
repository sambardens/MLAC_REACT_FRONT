import { Flex, Icon, Image, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { deleteTrackFromCartInShop } from 'store/shop/shop-operations';
import { setCart } from 'store/shop/shop-slice';

import RingLoader from '@/components/Loaders/RingLoader';

import closeIcon from '@/assets/icons/shop/closeSmall.svg';

const TrackCard = ({ track, isInCart = true, selectedFonts, selectedPalette }) => {
	const shopUser = useSelector(state => state.shopUser);
	const shop = useSelector(state => state.shop);
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
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
	const removeTrackFromCartInConstructor = () => {
		const updatedTrackCartList = shop?.cart?.filter(tr => tr.id !== track.id);
		dispatch(setCart(updatedTrackCartList));
	};

	const removeTrackFromCart = async () => {
		setIsLoading(true);
		const res = await dispatch(deleteTrackFromCartInShop({ trackId: track.id, shopId: shopUser.id }));

		if (res?.payload?.success) {
			getToast('success', 'Success', `Track ${track.name} has been deleted from the cart`);
		} else {
			getToast('error', 'Error', `Something went wrong. Track ${track.name} has not been deleted from the cart`);
		}
		setIsLoading(false);
	};

	const handleDeleteTrackFromCart = () => {
		if (shopUser?.id) {
			removeTrackFromCart();
		} else {
			removeTrackFromCartInConstructor();
		}
	};

	return (
		<Flex as='li' w='100%' align='center' justify='space-between'>
			<Flex align='center'>
				{isInCart && <Image src={track.src} w='64px' h='64px' borderRadius='8px' alt='Release logo' border='1px solid' borderColor={selectedPalette?.colors[0]} />}

				<Text ml='16px' fontWeight='400' fontSize='16px' color={selectedPalette?.colors[0]} fontStyle={selectedFonts[1].italic} fontFamily={selectedFonts[1].font} isTruncated={true} maxW='300px'>
					{track?.name}
				</Text>
			</Flex>

			<Flex justify={'space-between'} ml='5px'>
				<Text fontWeight={'500'} fontSize={'16px'} color={selectedPalette?.colors[0]} fontStyle={selectedFonts[1].italic} fontFamily={selectedFonts[1].font}>
					£{Number(track?.price)}
				</Text>
				<Flex flexDir={'column'} justify={'center'} align={'center'} ml='16px' w='24px'>
					{isLoading ? (
						<RingLoader w='24px' h='24px' color={selectedPalette?.colors[0]} />
					) : (
						<Icon onClick={handleDeleteTrackFromCart} as={closeIcon} color={selectedPalette?.colors[0]} cursor='pointer' _hover={{ color: selectedPalette?.colors[2] }} transition='300ms linear' />
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default TrackCard;
