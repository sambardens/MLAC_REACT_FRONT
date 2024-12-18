import {
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Icon,
	IconButton,
	Input,
	Text,
} from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';

import CloseIcon from '@/assets/icons/base/close.svg';

const CustomInput = ({
	name,
	placeholder,
	type = 'text',
	onBlur,
	onChange,
	onFocus,
	onClose,
	showCloseIcon,
	value,
	errors,
	label,
	ml,
	mb,
	mr,
	mt,
	w = '100%',
	maxW,
	px = '12px',
	py,
	h = '56px',
	readOnly = false,
	borderRadius = '10px',
	icon,
	iconRight,
	iconColor = 'stroke',
	iconRightColor = 'secondary',
	bgColor = 'white',
	isInvalid = false,
	maxLength = null,
	mlError = 0,
	mtError = '5px',
	mlLabel = '12px',
	textRight,
	isErrorsAbsolute = false,
	border = '1px solid',
	onKeyDown = false,
	autoComplete = 'on',
	reverse = false,
	isCursor = false,
	color = 'black',
	borderColor = '',
	min = null,
	max = null,
}) => {
	const id = name || nanoid();

	return (
		<FormControl
			pos='relative'
			ml={ml}
			mb={mb}
			mt={mt}
			mr={mr}
			w={w}
			maxW={maxW}
			isInvalid={isInvalid}
		>
			{label && (
				<FormLabel
					htmlFor={id}
					mb='4px'
					ml={mlLabel}
					fontSize='16px'
					fontWeight='400'
					color={color}
					data-focus={true}
				>
					{label}
				</FormLabel>
			)}
			<Flex
				position={'relative'}
				alignItems='center'
				border={border}
				borderRadius={borderRadius}
				borderColor={borderColor ? borderColor : isInvalid ? 'accent' : 'stroke'}
				px={px}
				h={h}
				bgColor={bgColor}
				flexDir={reverse ? 'row-reverse' : 'initial'}
			>
				{icon && <Icon as={icon} mr='12px' w='24px' h='24px' fill={iconColor} />}
				<Input
					id={id}
					type={type}
					name={name}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					onFocus={onFocus}
					{...(onKeyDown && (onKeyDown = { onKeyDown }))}
					placeholder={placeholder}
					w={w}
					_placeholder={{ color: borderColor || 'stroke' }}
					isReadOnly={readOnly}
					variant='unstyled'
					color={color}
					cursor={isCursor ? 'text' : readOnly ? 'inherit' : 'text'}
					autoComplete={autoComplete}
					textAlign={reverse ? 'end' : 'start'}
					maxLength={maxLength}
					min={min}
					max={max}
				/>
				{iconRight && <Icon as={iconRight} ml='12px' w='24px' h='24px' color={iconRightColor} />}
				{textRight && (
					<Text fontSize='16px' fontWeight='400' color={color}>
						{textRight}
					</Text>
				)}
				{onClose && showCloseIcon && (
					<IconButton
						size='sm'
						ml='4px'
						mr='3px'
						h='56px'
						aria-label='Clear search result'
						icon={<CloseIcon />}
						color='stroke'
						_hover={{ color: 'secondary' }}
						transition='0.3s linear'
						onClick={onClose}
					/>
				)}
			</Flex>

			{errors && (
				<FormErrorMessage
					position={isErrorsAbsolute ? 'absolute' : 'static'}
					{...(mlError && { ml: mlError, mt: mtError })}
				>
					{errors}
				</FormErrorMessage>
			)}
		</FormControl>
	);
};

export default CustomInput;
