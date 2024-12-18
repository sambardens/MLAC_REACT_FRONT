import { useRouter } from 'next/router';

import { Box, Flex, Heading, Text, useToast } from '@chakra-ui/react';

import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import setNewPasswordRequest from 'src/functions/serverRequests/user/setNewPasswordRequest';
import * as Yup from 'yup';

import CustomButton from '@/components/Buttons/CustomButton';

import FormikField from '../FormikField/FormikField';

const NewPassSection = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const toast = useToast();
	const [currentUrl, setCurrentUrl] = useState(undefined);
	const [isShowNewPass, setIsShowNewPass] = useState(false);
	const [isShowConfirmPass, setIsShowConfirmPass] = useState(false);
	const router = useRouter();

	const PasswordChangeSchema = Yup.object().shape({
		newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('newPassword'), null], 'Password must be match')
			.required('Required'),
	});

	useEffect(() => {
		const currentUrlArg = window.location.href;
		setCurrentUrl(currentUrlArg);
	}, []);

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
	const handleSavePass = async newPassword => {
		setIsSubmitting(true);
		try {
			const { data } = await setNewPasswordRequest(currentUrl, newPassword);
			if (data.success) {
				getToast('success', 'Success', 'Your password has been updated.');
				router.push('/');
			}
			setIsSubmitting(false);
		} catch (error) {
			setIsSubmitting(false);
			getToast('error', 'Error', 'Failed to change password. Please try again later.');
		}
	};

	return (
		<Box maxW='454px'>
			<Box mb='40px'>
				<Heading fontWeight='600' fontSize='46px' color='black' textAlign='center' mb='16px' lineHeight='1.5'>
					New password
				</Heading>

				<Text textAlign='center' color='secondary' fontSize='14px' lineHeight='1.5'>
					Create a new password, it should be at least 8 characters and contain both letters and numbers.
				</Text>
			</Box>
			<Formik
				initialValues={{ newPassword: '', confirmPassword: '' }}
				validationSchema={PasswordChangeSchema}
				onSubmit={values => {
					handleSavePass(values);
				}}
			>
				{({ values, errors, touched, handleChange, handleBlur }) => {
					console.log('Formik errors: ', errors);
					return (
						<Form>
							<Flex gap='8px' flexDir='column' mb='40px'>
								<FormikField
									label='New password'
									name='newPassword'
									placeholder='********'
									type='password'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.newPassword}
									errors={errors.newPassword}
									touched={touched.newPassword}
									isShowPass={isShowNewPass}
									setIsShowPass={setIsShowNewPass}
								/>
								<FormikField
									label='Confirm password'
									name='confirmPassword'
									placeholder='********'
									type='password'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.confirmPassword}
									errors={errors.confirmPassword}
									touched={touched.confirmPassword}
									isShowPass={isShowConfirmPass}
									setIsShowPass={setIsShowConfirmPass}
								/>
							</Flex>
							<CustomButton type='submit' styles='main' w='100%' isSubmiting={isSubmitting}>
								Save
							</CustomButton>
						</Form>
					);
				}}
			</Formik>
		</Box>
	);
};

export default NewPassSection;
