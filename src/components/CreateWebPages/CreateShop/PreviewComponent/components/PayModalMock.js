import { Flex, Icon, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import getAccurateCartText from 'src/functions/utils/getAccurateCartText';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';

import closeIcon from '@/assets/icons/base/close.svg';

const PayModalMock = ({ closeCart, totalPrice }) => {
	const shop = useSelector(state => state.shop);
	const { cart, selectedPalette, selectedFonts } = shop;
	const [tips, setTips] = useState('');
	const [isTipsError, setIsTipsError] = useState(false);
	const toast = useToast();

	const handleTipsInput = value => {
		if (value < 0) {
			setIsTipsError(true);
		} else {
			setIsTipsError(false);
		}

		setTips(value);
	};

	const payHandler = () => {
		toast({
			position: 'top',
			title: 'Info',
			description:
				'After pressing the "Pay" button, the user will be able to pay for the selected tracks through the PayPal service',
			status: 'info',
			duration: 5000,
			isClosable: true,
		});
	};

	return (
		<Flex
			position={'absolute'}
			zIndex={'2'}
			top='81px'
			right='5px'
			flexDir={'column'}
			justifyContent={'space-between'}
			py='40px'
			px='20px'
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
						{getAccurateCartText(cart.length)}
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
					color={selectedPalette?.colors[0]}
					fontStyle={selectedFonts[1].italic}
					fontFamily={selectedFonts[1].font}
				>
					Add an amount to the payment to support the artist&apos;s work
				</Text>

				<Text
					mt='25px'
					fontWeight={'400'}
					fontSize={'16px'}
					color={selectedPalette?.colors[0]}
					fontStyle={selectedFonts[1].italic}
					fontFamily={selectedFonts[1].font}
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

			<Flex justifyContent={'space-between'} alignItems={'center'} mt='24px'>
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
						£{totalPrice + Number(tips)}
					</Text>
				</Flex>

				<CustomButton
					onClickHandler={payHandler}
					styles={isTipsError ? 'disabled' : true}
					bgColor={shop.selectedPalette.colors[2]}
					color={selectedPalette?.colors[0]}
					fontStyle={selectedFonts[1].italic}
					fontFamily={selectedFonts[1].font}
					fontWeight={selectedFonts[1].weight}
					fontSize={selectedFonts[1].size}
				>
					Pay
				</CustomButton>
			</Flex>
		</Flex>
	);
};

export default PayModalMock;
