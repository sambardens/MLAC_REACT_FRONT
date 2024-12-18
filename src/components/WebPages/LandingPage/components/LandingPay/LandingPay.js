import { Flex, Text, useToast } from '@chakra-ui/react';

import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import buyTracks from 'src/functions/serverRequests/payment/buyTracks';
import getAccurateCartText from 'src/functions/utils/getAccurateCartText';
import { clearCart } from 'store/landing/landing-slice';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomModal from '@/components/Modals/CustomModal';
import PaypalCheckoutButton from '@/components/PaypalCheckoutButton';

const LandingPay = ({
	totalPriceInCart,
	subTitleDesign,
	onClose,
	setLandingTracksList,
	titleDesign,
	additionalDesign,
}) => {
	const axiosPrivate = useAxiosPrivate();
	const { landingInfo, cart } = useSelector(state => state.landing);
	const [paymentInfo, setPaymentInfo] = useState(null);
	const dispatch = useDispatch();
	const [tips, setTips] = useState('');
	const [inputValue, setInputValue] = useState('');
	const [isPaypalButton, setIsPaypalButton] = useState(true);
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
	const removePaypalButton = useRef(
		debounce(() => {
			setIsPaypalButton(false);
		}, 500),
	).current;

	const handleTipsInput = e => {
		const { value } = e.target;
		const cleanedValue = value.replace(/[^0-9.]/g, '');
		setInputValue(cleanedValue);
		setTips(Number(cleanedValue).toFixed(2));
		removePaypalButton();
	};

	useEffect(() => {
		setIsPaypalButton(true);
	}, [isPaypalButton]);

	const handlePay = async () => {
		const data = {
			paymentEmail: paymentInfo.paymentEmail,
			invoiceId: paymentInfo.invoiceId,
			trackIds: { [landingInfo.releaseId]: cart.map(el => el.id) },
			tips: +tips,
		};
		const params = { purchaseLocationTypeId: 2, purchaseLocationId: landingInfo.id };
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
			dispatch(clearCart());
		} else {
			getToast(
				'error',
				'Error',
				'The payment was successful, but there is an error on the server. Tracks have not been sent. Contact customer service',
			);
		}
		setLandingTracksList(prev => prev.map(el => ({ ...el, isSelected: false })));
		setPaymentInfo(null);
		onClose();
	};
	useEffect(() => {
		if (paymentInfo?.success) {
			handlePay();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paymentInfo?.success]);

	const product = { price: totalPriceInCart + Number(tips), description: `${cart.length} tracks` };

	return (
		<CustomModal
			closeModal={onClose}
			maxH='90vh'
			w={{ base: '360px', sm: '420px', lg: '480px' }}
			right='6px'
			top='80px'
			p='40px 20px'
			h='568px'
			bgColor={subTitleDesign?.hex}
			closeIconColor={titleDesign.hex}
			closeIconHoverColor={additionalDesign.hex}
		>
			<Flex flexDir='column' justify='space-between' h='100%'>
				<Flex flexDir='column' gap='24px'>
					<Text
						fontWeight='500'
						fontSize='32px'
						color={titleDesign.hex}
						fontFamily={titleDesign.font}
						fontStyle={titleDesign.italic ? 'italic' : 'initial'}
					>
						Pay
					</Text>

					<Flex
						justifyContent='space-between'
						align='center'
						fontFamily={subTitleDesign.font}
						fontStyle={subTitleDesign.italic ? 'italic' : 'initial'}
						color={titleDesign.hex}
					>
						<Text fontWeight='500' fontSize='16px'>
							{getAccurateCartText(cart.length)}
						</Text>
						<Text fontWeight='500' fontSize='18px'>
							£{totalPriceInCart}
						</Text>
					</Flex>

					<Text
						fontWeight='400'
						fontSize='16px'
						color={titleDesign.hex}
						fontFamily={subTitleDesign.font}
						fontStyle={subTitleDesign.italic ? 'italic' : 'initial'}
					>
						Add an amount to the payment to support the artist&apos;s work
					</Text>

					<CustomInput
						label='Add to price'
						id='tips'
						name='tips'
						value={inputValue}
						onChange={handleTipsInput}
						placeholder='0'
						_placeholder={{ color: 'stroke' }}
						textRight='£'
						mlLabel='0'
						color={titleDesign.hex}
						borderColor={titleDesign.hex}
						bgColor='transparent'
					/>
				</Flex>

				<Flex justify='space-between' align='center' mt='24px' h='62px'>
					<Flex
						align='center'
						fontFamily={subTitleDesign.font}
						fontStyle={subTitleDesign.italic ? 'italic' : 'initial'}
						color={titleDesign.hex}
					>
						<Text fontWeight='500' fontSize='16px'>
							Total price:
						</Text>
						<Text ml='20px' fontWeight='600' fontSize='24px'>
							£{totalPriceInCart + Number(tips)}
						</Text>
					</Flex>

					{isPaypalButton && product && (
						<PaypalCheckoutButton
							product={product}
							setPaymentInfo={setPaymentInfo}
							fbPixel={landingInfo?.facebookPixel}
						/>
					)}
				</Flex>
			</Flex>
		</CustomModal>
	);
};

export default LandingPay;
