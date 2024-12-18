import { Box, Heading, Text, useToast } from '@chakra-ui/react';

import { Form, Formik } from 'formik';
import React from 'react';
import resetPassword from 'src/functions/serverRequests/mails/resetPassword';
import * as yup from 'yup';

import CustomButton from '@/components/Buttons/CustomButton';

import FormikField from '../../FormikField/FormikField';

const PassRecoverySend = ({ setIsStartPage, setEmail, setStyles }) => {
	const validationSchema = yup.object().shape({
		email: yup.string().email('enter correct email').required('Required'),
	});
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
	const handleSendEmail = async values => {
		const data = await resetPassword(values.email);

		if (data.success === true) {
			getToast('success', 'Email sent successfully', 'Check your email to change your password!');
			setTimeout(() => {
				setStyles('main');
			}, 10000);
			setIsStartPage(false);
			setEmail(values.email);
		}

		if (data.success === false) {
			getToast('error', 'Error', data.message);
		}
	};

	return (
		<>
			<Box mb='40px'>
				<Heading
					fontWeight='600'
					fontSize='46px'
					color='black'
					textAlign='center'
					mb='16px'
					lineHeight='1.5'
				>
					Recovery password
				</Heading>

				<Text textAlign='center' color='secondary' fontSize='14px' lineHeight='1.5'>
					Enter the email you signed up with and we&apos;ll send you a link to change your password.
				</Text>
			</Box>
			<Formik
				initialValues={{
					email: '',
				}}
				onSubmit={values => {
					handleSendEmail(values);
				}}
				validateOnBlur
				validationSchema={validationSchema}
			>
				{({ values, errors, touched, handleChange, handleBlur }) => (
					<Form>
						<FormikField
							mb='40px'
							label='Email'
							name='email'
							placeholder='Your email'
							type='email'
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.email}
							errors={errors.email}
							touched={touched.email}
						/>
						<CustomButton w='100%' type='submit' styles='main'>
							Send
						</CustomButton>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default PassRecoverySend;
