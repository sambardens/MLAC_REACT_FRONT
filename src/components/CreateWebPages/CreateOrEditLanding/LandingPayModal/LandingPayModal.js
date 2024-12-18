import { Flex, Icon, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import getAccurateCartText from 'src/functions/utils/getAccurateCartText';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';

import closeIcon from '@/assets/icons/base/close.svg';

const LandingPayModal = ({ onClose, tracksInCart, totalPriceInCart, colors, fonts }) => {
	const [tips, setTips] = useState('');
	const [inputValue, setInputValue] = useState('');
	const toast = useToast();
	const getToast = (title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status: 'info',
			duration: 5000,
			isClosable: true,
		});
	};
	const handleTipsInput = e => {
		const { value } = e.target;
		const cleanedValue = value.replace(/[^0-9.]/g, '');
		setInputValue(cleanedValue);
		setTips(Number(cleanedValue).toFixed(2));
	};

	const handlePay = () => {
		getToast(
			'Info',
			'After clicking the ‘Pay’ button, the user will be able to buy the selected tracks using PayPal.',
		);
	};

	return (
		<Flex
			position='absolute'
			zIndex={20}
			top='80px'
			right='5px'
			flexDir='column'
			justify='space-between'
			p='20px'
			w='480px'
			h='572px'
			bgColor={colors[1]}
			borderRadius='10px'
			boxShadow={'0 0 0 1px Gray'}
		>
			<Icon
				onClick={onClose}
				as={closeIcon}
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

			<Flex flexDir='column' gap='24px'>
				<Text
					fontWeight='500'
					fontSize='32px'
					color={colors[0]}
					fontFamily={fonts[0].font}
					fontStyle={fonts[0].italic === 'italic' ? 'italic' : 'initial'}
				>
					Pay
				</Text>

				<Flex justifyContent='space-between' align='center'>
					<Text
						fontWeight='500'
						fontSize='16px'
						color={colors[0]}
						fontFamily={fonts[1].font}
						fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
					>
						{getAccurateCartText(tracksInCart.length)}
					</Text>
					<Text
						fontWeight='500'
						fontSize='18px'
						color={colors[0]}
						fontFamily={fonts[1].font}
						fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
					>
						£{totalPriceInCart}
					</Text>
				</Flex>

				<Text
					fontWeight='400'
					fontSize='16px'
					color={colors[0]}
					fontFamily={fonts[1].font}
					fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
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
					textRight='£'
					mlLabel='0'
					color={colors[0]}
					borderColor={colors[0]}
					bgColor='transparent'
				/>
			</Flex>

			<Flex justify='space-between' align='center' mt='32px'>
				<Flex align='center'>
					<Text
						fontWeight='500'
						fontSize='16px'
						color={colors[0]}
						fontFamily={fonts[1].font}
						fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
					>
						Total price:
					</Text>
					<Text
						ml='20px'
						fontWeight='600'
						fontSize='32px'
						color={colors[0]}
						fontFamily={fonts[1].font}
						fontStyle={fonts[1].italic === 'italic' ? 'italic' : 'initial'}
					>
						£{totalPriceInCart + Number(tips)}
					</Text>
				</Flex>

				<CustomButton
					onClickHandler={handlePay}
					bgColor={colors[2]}
					color={colors[0]}
					fontFamily={fonts[2].font}
					fontWeight={fonts[2].weight}
					fontSize={fonts[2].size}
					fontStyle={fonts[2].italic === 'italic' ? 'italic' : 'initial'}
				>
					Pay
				</CustomButton>
			</Flex>
		</Flex>
	);
};

export default LandingPayModal;
