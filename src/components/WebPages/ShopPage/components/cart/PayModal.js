import { Flex, Text, useToast } from '@chakra-ui/react';

import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import buyTracks from 'src/functions/serverRequests/payment/buyTracks';
import getAccurateCartText from 'src/functions/utils/getAccurateCartText';
import { setCart } from 'store/shop/shop-user-slice';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomModal from '@/components/Modals/CustomModal';
import PaypalCheckoutButton from '@/components/PaypalCheckoutButton';

const PayModal = ({ tracks = [], closeCart, totalPrice, trackIds }) => {
	const axiosPrivate = useAxiosPrivate();
	const dispatch = useDispatch();
	const shopUser = useSelector(state => state.shopUser);
	const { selectedPalette, selectedFonts, fbPixel } = shopUser;
	const [tips, setTips] = useState('');
	const [isTipsError, setIsTipsError] = useState(false);
	const toast = useToast();
	// const [product, setProduct] = useState(null);
	const [finalPrice, setFinalPrice] = useState(totalPrice);
	const [product, setProduct] = useState(null);
	const [paymentInfo, setPaymentInfo] = useState(null);
	const [isPaypalButton, setIsPaypalButton] = useState(true);

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
		const finalPriceArg = Math.round((totalPrice + Number(tips)) * 100) / 100;
		setFinalPrice(finalPriceArg);
		const updatedProduct = { description: 'Pay for tracks', price: finalPriceArg };
		setProduct({ ...updatedProduct });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tips]);

	const removePaypalButton = useRef(
		debounce(() => {
			setIsPaypalButton(false);
		}, 500),
	).current;

	const handleTipsInput = value => {
		if (value < 0) {
			setIsTipsError(true);
		} else {
			setIsTipsError(false);
		}

		if (value >= 0) {
			setTips(value);
		}

		removePaypalButton();
	};

	useEffect(() => {
		setIsPaypalButton(true);
	}, [isPaypalButton]);

	const handlePay = async () => {
		const data = {
			paymentEmail: paymentInfo.paymentEmail,
			invoiceId: paymentInfo.invoiceId,
			trackIds,
			tips: +tips,
		};
		const params = { purchaseLocationTypeId: 1, purchaseLocationId: shopUser.id };
		const res = await buyTracks(data, params, axiosPrivate);

		if (res?.success) {
			toast({
				position: 'top',
				title: 'Success',
				description: (
					<>
						Tracks have been added to your account. Check them in your email or in the&nbsp;
						<Text
							as='a'
							color='accent'
							textDecoration='underline'
							href='https://app.majorlabl.com/my-downloads'
						>
							My music&nbsp;
						</Text>
						menu.
					</>
				),
				status: 'success',
				duration: 9000,
				isClosable: true,
			});
		} else {
			getToast(
				'error',
				'Error',
				'The payment was successful, but there is an error on the server. Tracks have not been sent. Contact customer service',
			);
		}
	};

	useEffect(() => {
		console.log('SHOP paymentInfo: ', paymentInfo);
		if (paymentInfo?.success) {
			setPaymentInfo(null);
			dispatch(setCart([]));
			closeCart();
			handlePay();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paymentInfo?.success]);

	return (
		<CustomModal
			closeModal={closeCart}
			flexDir={'column'}
			maxH='90vh'
			w={{ base: '360px', sm: '420px', lg: '480px' }}
			right='6px'
			top='80px'
			h='548px'
			p='40px 20px'
			bgColor={selectedPalette?.colors[1]}
			closeIconColor={selectedPalette?.colors[0]}
			closeIconHoverColor={selectedPalette?.colors[2]}
		>
			<Flex flexDir={'column'} justifyContent={'space-between'} h='100%'>
				<Flex flexDir={'column'}>
					<Text
						fontWeight={'600'}
						fontSize={'32px'}
						fontStyle={selectedFonts[0].italic}
						fontFamily={selectedFonts[0].font}
						color={selectedPalette?.colors[0]}
					>
						Pay
					</Text>

					<Flex justifyContent={'space-between'} alignItems={'center'} mt='25px'>
						<Text
							fontWeight={'500'}
							fontSize={'16px'}
							fontStyle={selectedFonts[1].italic}
							fontFamily={selectedFonts[1].font}
							color={selectedPalette?.colors[0]}
						>
							{getAccurateCartText(tracks.length)}
						</Text>
						<Text
							fontWeight={'500'}
							fontSize={'18px'}
							fontStyle={selectedFonts[1].italic}
							fontFamily={selectedFonts[1].font}
							color={selectedPalette?.colors[0]}
						>
							£{totalPrice}
						</Text>
					</Flex>

					<Text
						mt='25px'
						fontWeight={'400'}
						fontSize={'16px'}
						fontStyle={selectedFonts[1].italic}
						fontFamily={selectedFonts[1].font}
						color={selectedPalette?.colors[0]}
					>
						Add an amount to the payment to support the artist&apos;s work
					</Text>

					<Text
						mt='25px'
						fontWeight={'400'}
						fontSize={'16px'}
						fontStyle={selectedFonts[1].italic}
						fontFamily={selectedFonts[1].font}
						color={selectedPalette?.colors[0]}
					>
						Add to price
					</Text>

					<CustomInput
						value={tips}
						onChange={e => handleTipsInput(e.target.value)}
						isInvalid={isTipsError}
						errors={'Good attempt, but you cannot enter a negative number for tips.'}
						placeholder={'0'}
						type='number'
						textRight='£'
						mt='4px'
						color={selectedPalette?.colors[0]}
						borderColor={selectedPalette?.colors[0]}
						bgColor='transparent'
					/>
				</Flex>

				<Flex justifyContent={'space-between'} alignItems={'center'} mt='24px' h='62px'>
					<Flex alignItems={'center'}>
						<Text
							fontWeight={'500'}
							fontSize={'16px'}
							color={selectedPalette?.colors[0]}
							fontStyle={selectedFonts[1].italic}
							fontFamily={selectedFonts[1].font}
						>
							Total price:
						</Text>
						<Text
							ml='20px'
							fontWeight={'600'}
							fontSize={'32px'}
							color={selectedPalette?.colors[0]}
							fontStyle={selectedFonts[1].italic}
							fontFamily={selectedFonts[1].font}
						>
							£{finalPrice}
						</Text>
					</Flex>

					{isPaypalButton && product && (
						<PaypalCheckoutButton product={product} setPaymentInfo={setPaymentInfo} fbPixel={fbPixel} />
					)}
				</Flex>
			</Flex>
		</CustomModal>
	);
};

export default PayModal;
