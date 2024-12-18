import { Box, Flex, Icon, IconButton, Text, keyframes } from '@chakra-ui/react';

import { useEffect, useState } from 'react';

import Cart from '@/assets/icons/shop/cart.svg';
import CheckMarkIcon from '@/assets/icons/shop/checkMark.svg';

const CartIcon = ({
	onClick,
	w = '24px',
	h = '24px',
	mr,
	mainColor = 'white',
	elColor = 'black',
	children,
	type = 'checkMark',
	itemAmount,
	isHover = true,
	isNumber,
}) => {
	const scaleNumber = keyframes`
    from {
      transform: scale(0.5);
    }
    to {
      transform: scale(1.25);
    }
  `;

	return (
		<Flex
			as='button'
			onClick={onClick}
			position={'relative'}
			w={w}
			h={h}
			mr={mr}
			color={mainColor}
			cursor={isHover ? 'pointer' : 'initial'}
			_hover={isHover && { color: elColor }}
		>
			<Icon w={w} h={h} aria-label={'Shop cart'} as={Cart} color={'inherit'} transition='300ms' />
			{type === 'checkMark' && (
				<Icon
					position={'absolute'}
					bottom={'0'}
					right={'0'}
					transform={'translate(15%, 15%)'}
					w='15px'
					h='15px'
					aria-label={'Shop cart'}
					as={CheckMarkIcon}
					color={elColor}
				/>
			)}

			{type === 'itemAmount' && isNumber && (
				<Flex
					position={'absolute'}
					bottom={'0'}
					right={'0'}
					transform={'translate(15%, 15%)'}
					justifyContent={'center'}
					alignItems={'center'}
					minW='16px'
					h='16px'
					bgColor={elColor}
					color={'white'}
					borderRadius={'50%'}
				>
					<Text
						color='white'
						fontSize='12px'
						// animation={itemAmount ? `${scaleNumber} 0.3s linear` : 'none'}
					>
						{itemAmount}
					</Text>
				</Flex>
			)}
		</Flex>
	);
};

export default CartIcon;
