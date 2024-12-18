import { useRouter } from 'next/router';

import { Box, Flex, Text } from '@chakra-ui/react';

import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { authSelectors } from 'store/auth';
import { register } from 'store/auth/auth-operations';
import { setInviteToken } from 'store/auth/auth-slice';
import * as Yup from 'yup';

import CustomButton from '@/components/Buttons/CustomButton';

import FormikField from '../FormikField/FormikField';
import SocialAuth from '../SocialAuth/SocialAuth';

const SignUp = ({ toggleAuth, setIsModal, accentColor, btnTextColor }) => {
	const { inviteToken } = useSelector(state => state.auth);
	const isLoading = useSelector(authSelectors.getIsLoading);
	const [errorMsg, setErrorMsg] = useState('');
	const [isShowPass, setIsShowPass] = useState(false);
	const router = useRouter();
	const isWebPage = router.pathname.includes('music');
	const dispatch = useDispatch();
	const validationSchema = Yup.object().shape({
		firstName: Yup.string().typeError('Name should be a string').required('Required'),
		lastName: Yup.string().typeError('Name should be a string').required('Required'),
		email: Yup.string().email('Enter correct email').required('Required'),
		password: Yup.string().typeError('Password should be a string').required('Required'),
	});

	const handleSubmit = async values => {
		const res = await dispatch(
			register({
				userData: {
					email: values.email,
					firstName: values.firstName,
					lastName: values.lastName,
					password: values.password,
				},
				inviteToken,
			}),
		);

		if (res?.payload?.activateToken) {
			toggleAuth();
			setIsModal(true);
			if (inviteToken) {
				dispatch(setInviteToken(null));
			}
		} else {
			setErrorMsg(res?.payload.error);
		}
	};

	return (
		<>
			<Formik
				initialValues={{
					firstName: '',
					lastName: '',
					email: '',
					password: '',
				}}
				onSubmit={values => {
					handleSubmit(values);
				}}
				validateOnBlur
				validationSchema={validationSchema}
			>
				{({ values, errors, touched, handleChange, handleBlur }) => (
					<Form style={{ position: 'relative' }}>
						<Flex gap='8px' flexDir='column' mb='40px'>
							<Flex>
								<FormikField
									label='First name'
									name='firstName'
									placeholder='John'
									type='text'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.firstName}
									// errors={errors.firstName}
									touched={touched.firstName}
								/>
								<FormikField
									label='Last name'
									name='lastName'
									placeholder='Smith'
									type='text'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.lastName}
									// errors={errors.lastName}
									touched={touched.lastName}
									ml='16px'
								/>
							</Flex>

							<FormikField
								label='Email'
								name='email'
								placeholder='Your email'
								type='email'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.email}
								// errors={errors.email}
								touched={touched.email}
							/>
							<FormikField
								label='Password'
								id='password'
								name='password'
								placeholder='Your password'
								type='password'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.password}
								// errors={errors.password}
								touched={touched.password}
								isShowPass={isShowPass}
								setIsShowPass={setIsShowPass}
								isShowForgotPass={isWebPage ? false : true}
							/>
						</Flex>

						<CustomButton
							type='submit'
							w='100%'
							color={btnTextColor}
							bgColor={accentColor}
							isSubmiting={isLoading}
						>
							Sign Up
						</CustomButton>
						{errorMsg && (
							<Text
								pos='absolute'
								color={accentColor || 'accent'}
								left='50%'
								bottom='-15px'
								transform='translate(-50%,100%)'
								fontWeight='400'
								fontSize='16px'
								w='100%'
							>
								{errorMsg}
							</Text>
						)}
					</Form>
				)}
			</Formik>
			<Flex my='40px' alignItems='center'>
				<Box h='1px' bgColor='stroke' w='100%'></Box>
				<Text fontSize='16px' fontWeight='400' px='8px'>
					or
				</Text>
				<Box h='1px' bgColor='stroke' w='100%'></Box>
			</Flex>
			<SocialAuth setErrorMsg={setErrorMsg} />
		</>
	);
};

export default SignUp;
