import { Button, Icon } from '@chakra-ui/react';

import React from 'react';

import BackArrowIcon from '@/assets/icons/modal/backArrow.svg';
import NextArrowIcon from '@/assets/icons/modal/nextArrow.svg';

const CustomButton = ({
	onClickHandler,
	children,
	minW,
	w = '150px',
	h = '56px',
	ml,
	mt,
	mr,
	mb,
	py = '16px',
	px = '16px',
	borderRadius = '10px',
	isSubmiting = false,
	isEditable = true,
	styles,
	type = 'button',
	iconLeft = null,
	iconRight = null,
	isBackButton = false,
	isNextButton = false,
	alignSelf = undefined,
	color = null,
	bgColor = null,
	ariaLabel,
	_hover = { boxShadow: '1px 1px 3px 1px Gray' },
	disabledBgColor = 'stroke',
	disabledColor = 'white',
	fontFamily = 'Poppins',
	fontStyle = 'initial',
	fontSize = '16px',
	lineHeight = 1,
	fontWeight = 500,
}) => {
	const isDisabled = styles === 'disabled';

	const getBg = () => {
		if (bgColor) {
			return bgColor;
		}

		if (styles === 'main') {
			return 'accent';
		}
		if (styles === 'transparent') {
			return 'transparent';
		}
		if (styles === 'light') {
			return 'bg.light';
		}
		if (styles === 'light-red') {
			return 'bg.light';
		}
		if (styles === 'transparent-bold' || isDisabled) {
			return 'bg.secondary';
		}
		if (styles === 'blueYonder') {
			return 'brand.blueYonder';
		}
		return 'accent';
	};

	const getColor = () => {
		if (color) {
			return color;
		}

		if (styles === 'transparent') {
			return 'black';
		}
		if (styles === 'transparent-bold' || isDisabled) {
			return 'textColor.grayDark';
		}
		if (styles === 'blueYonder') {
			return 'white';
		}
		if (styles === 'main') {
			return 'white';
		}
		if (styles === 'light') {
			return 'black';
		}
		if (styles === 'light-red') {
			return 'accent';
		}
		return 'white';
	};

	return (
		<Button
			onClick={onClickHandler}
			isLoading={isSubmiting}
			w={w}
			h={h}
			ml={ml}
			mt={mt}
			mr={mr}
			mb={mb}
			py={py}
			px={px}
			minW={minW}
			bgColor={getBg()}
			color={getColor()}
			borderRadius={borderRadius}
			filter={isEditable ? 'none' : 'grayscale(90%)'}
			lineHeight={lineHeight}
			cursor={isEditable ? 'pointer' : 'not-allowed'}
			variant='ghost'
			type={type}
			isDisabled={isDisabled}
			_hover={_hover}
			_disabled={{ color: disabledColor, bgColor: disabledBgColor }}
			pointerEvents={isDisabled ? 'none' : 'auto'}
			leftIcon={isBackButton && <BackArrowIcon />}
			rightIcon={isNextButton && <NextArrowIcon />}
			alignSelf={alignSelf}
			aria-label={ariaLabel}
			fontSize={fontSize}
			fontWeight={fontWeight}
			fontFamily={fontFamily}
			fontStyle={fontStyle}
		>
			{iconLeft && !isBackButton && <Icon as={iconLeft} color={'white'} boxSize='24px' mr='10px' />}
			{children}
			{iconRight && !isNextButton && <Icon as={iconRight} boxSize='24px' ml='10px' />}
		</Button>
	);
};

export default CustomButton;
