import NextLink from 'next/link';

import { Box, FormControl, FormLabel, IconButton, Link, Text } from '@chakra-ui/react';

import { Field } from 'formik';

import CloseEye from '@/assets/icons/auth/closeEye.svg';
import OpenEye from '@/assets/icons/auth/openEye.svg';

import s from './FormikField.module.css';

const FormikField = ({
	name,
	placeholder,
	type,
	onBlur,
	onChange,
	value,
	errors,
	touched,
	label,
	isShowPass,
	setIsShowPass,
	ml,
	mb,
	isShowForgotPass,
}) => {
	return (
		<FormControl pos='relative' ml={ml} mb={mb}>
			<FormLabel htmlFor={name} mb='4px' ml='12px' color='black'>
				{label}
			</FormLabel>
			<Box pos='relative'>
				<Field
					id={name}
					name={name}
					placeholder={placeholder}
					type={type !== 'password' ? type : isShowPass ? 'text' : 'password'}
					onChange={onChange}
					onBlur={onBlur}
					value={value}
					className={s.input}
				/>
				{type === 'password' && (
					<IconButton
						pos='absolute'
						right='4px'
						top='0'
						size='lg'
						h='56px'
						aria-label={isShowPass ? 'Hide password' : 'Show password'}
						icon={isShowPass ? <OpenEye /> : <CloseEye />}
						color='stroke'
						_hover={{ color: 'gray' }}
						transition='0.3s linear'
						onClick={() => {
							setIsShowPass(!isShowPass);
						}}
					/>
				)}
			</Box>
			{errors && touched && (
				<Text color='accent' pos='absolute' bottom='2px' left='12px' fontSize='12px'>
					{errors}
				</Text>
			)}
			{isShowForgotPass && (
				<Box textAlign='end' pr='16px' mt='4px'>
					<Link
						as={NextLink}
						href='pass-recovery'
						color='accent'
						fontSize='14px'
						fontWeight='400'
						lineHeight='1.5'
					>
						Forgot your password?
					</Link>
				</Box>
			)}
		</FormControl>
	);
};

export default FormikField;
