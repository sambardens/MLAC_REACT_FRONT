import { Box, Flex, FormControl, FormLabel, Icon, Link, Text, useToast } from '@chakra-ui/react';

import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import editUserProfileRequest from 'src/functions/serverRequests/user/editUserProfileRequest';
import { setUser } from 'store/slice';
import * as yup from 'yup';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomModal from '@/components/Modals/CustomModal';
import { Address } from '@/components/Modals/components/Address';
import VerifyPhoneNumber from '@/components/Modals/components/VerifyPhoneNumber';

import PayPalIcon from '@/assets/icons/base/paypal.svg';

import { inputStyles } from '@/styles/inputStyles';

function EnteringMissingValuesModal({ setIsModalOpen }) {
	const axiosPrivate = useAxiosPrivate();
	const { user } = useSelector(state => state.user);
	const {
		phone,
		paymentEmail,
		streetAddressOne,
		streetAddressTwo,
		city,
		regionState,
		postCodeZipCode,
		country,
	} = user;
	const [newPhone, setNewPhone] = useState(null);
	const [isVerifiedPhone, setIsVerifiedPhone] = useState(false);
	const [paypalError, setPaypalError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
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

	const initialValues = {
		paymentEmail: paymentEmail || '',
		paymentEmailCopy: paymentEmail || '',
		streetAddressOne: streetAddressOne || '',
		streetAddressTwo: streetAddressTwo || '',
		city: city || '',
		regionState: regionState || '',
		postCodeZipCode: postCodeZipCode || '',
		country: country || '',
	};
	const noAddress = !streetAddressOne || !city || !country;
	let validationSchema;

	if (noAddress && !paymentEmail) {
		validationSchema = yup.object().shape({
			paymentEmail: yup.string().email('Enter correct email').required('Required'),
			paymentEmailCopy: yup.string().email('Enter correct email').required('Required'),
			streetAddressOne: yup.string().required('Required'),
			streetAddressTwo: yup.string(),
			city: yup.string().required('Required'),
			regionState: yup.string(),
			postCodeZipCode: yup.string().min(5, 'Must be at least 5 characters long').nullable(),
			country: yup.string().required('Required'),
		});
	} else if (noAddress) {
		validationSchema = yup.object().shape({
			streetAddressOne: yup.string().required('Required'),
			streetAddressTwo: yup.string(),
			city: yup.string().required('Required'),
			regionState: yup.string(),
			postCodeZipCode: yup.string().min(5, 'Must be at least 5 characters long').nullable(),
			country: yup.string().required('Required'),
		});
	} else if (!paymentEmail) {
		validationSchema = yup.object().shape({
			paymentEmail: yup.string().email('Enter correct email'),
		});
	}
	const handleSubmit = async formValues => {
		const isDisabled =
			(noAddress && (!formValues.streetAddressOne || !formValues.country || !formValues.city)) ||
			(!paymentEmail && !formValues.paymentEmail);

		if (isDisabled) {
			getToast('error', 'Error', 'Some required fields are not filled');
			return;
		}
		if (formValues.paymentEmail) {
			if (formValues.paymentEmail !== formValues.paymentEmailCopy) {
				setPaypalError(true);
				return;
			} else {
				setPaypalError(false);
			}
		}
		if (!phone && !isVerifiedPhone) {
			getToast('error', 'Error', 'Phone number not verified');
			return;
		}
		setIsLoading(true);
		const formData = new FormData();
		!paymentEmail && formData.append('paymentEmail', formValues.paymentEmail);
		!phone && isVerifiedPhone && formData.append('phone', newPhone);
		formData.append('streetAddressOne', formValues.streetAddressOne);
		formData.append('streetAddressTwo', formValues.streetAddressTwo);
		formData.append('city', formValues.city);
		formData.append('regionState', formValues.regionState);
		formData.append('postCodeZipCode', formValues.postCodeZipCode);
		formData.append('country', formValues.country);

		const res = await editUserProfileRequest(formData, axiosPrivate);

		if (res.success) {
			getToast('success', 'Success', 'Your profile has been successfully changed!');

			dispatch(setUser({ ...res?.settings }));

			console.log(res?.settings, 'res?.settings');

			if (
				(phone && streetAddressOne && city && country && paymentEmail) ||
				(res?.settings?.phone &&
					res?.settings?.streetAddressOne &&
					res?.settings?.city &&
					res?.settings?.country &&
					res?.settings?.paymentEmail)
			) {
				setIsModalOpen(false);
			}
		} else {
			getToast('error', 'Error', res?.message);
		}

		setIsLoading(false);
	};

	return (
		<>
			<CustomModal
				isCloseCross={false}
				closeOnOverlayClick={true}
				closeModal={() => setIsModalOpen(false)}
				isCentered={true}
				maxH='90vh'
				w='90vw'
				maxW='640px'
				p='40px 0 40px 40px'
			>
				<Box mb='16px' pr='40px'>
					<Text fontSize='24px' fontWeight='600' lineHeight={1}>
						Change profile
					</Text>
					<Text fontSize='18px' fontWeight='400' mt='12px' lineHeight={1}>
						To proceed to the next step, enter the required profile data
					</Text>
				</Box>
				<Flex flexDir={'column'} alignItems='start' w='100%'>
					<Formik
						initialValues={initialValues}
						onSubmit={handleSubmit}
						validationSchema={validationSchema}
					>
						{({ values, handleChange, handleBlur, errors, touched, setTouched }) => {
							return (
								<Form
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between',
										minHeight: '500px',
										maxHeight: 'calc(90vh - 150px)',
										overflow: 'scroll',
										paddingRight: '40px',
									}}
								>
									<Flex flexDir='column' gap='16px'>
										{noAddress && (
											<Address
												values={values}
												handleChange={handleChange}
												handleBlur={handleBlur}
												errors={errors}
												touched={touched}
												handleFocus={() => {
													setTouched({});
												}}
											/>
										)}
										{!phone && (
											<FormControl id='phone'>
												<FormLabel
													htmlFor='phone'
													mb='4px'
													pl='12px'
													fontSize='16px'
													fontWeight='400'
													color='black'
												>
													Mobile phone
												</FormLabel>
												<VerifyPhoneNumber
													setNewPhone={setNewPhone}
													setIsVerifiedPhone={setIsVerifiedPhone}
													isVerifiedPhone={isVerifiedPhone}
												/>
											</FormControl>
										)}

										{!paymentEmail && (
											<Box>
												<Flex px='12px' align='center' justify='space-between'>
													<FormLabel htmlFor='paymentEmail' fontSize='16px' fontWeight='400' mb='0'>
														Payment Details
													</FormLabel>
													<Icon as={PayPalIcon} w='150px' h='36px' />
												</Flex>
												<Text mt='4px' fontSize='12px' pl='12px'>
													To receive payment on Major Labl, you need a PayPal account. Please make sure the email
													you provide is associated with a valid PayPal account. If you don&apos;t have a PayPal
													account, you can sign up by clicking{' '}
													<Text as='span' color='accent'>
														<Link
															href='https://www.paypal.com/ky/webapps/mpp/account-selection'
															isExternal
															target='_blank'
															rel='noopener noreferrer'
														>
															here
														</Link>
													</Text>
												</Text>
												<CustomInput
													isInvalid={errors.paymentEmail && touched.paymentEmail}
													type='email'
													name='paymentEmail'
													value={values.paymentEmail}
													onChange={handleChange}
													onBlur={handleBlur}
													onFocus={() => {
														setTouched({});
													}}
													mt={'8px'}
													placeholder='Enter your payment email address'
													sx={inputStyles}
													autoComplete='off'
												/>
												{/* <FormErrorMessage>{errors.paymentEmail}</FormErrorMessage> */}
												<CustomInput
													isInvalid={errors.paymentEmailCopy && touched.paymentEmailCopy}
													type='email'
													name='paymentEmailCopy'
													value={values.paymentEmailCopy}
													onFocus={() => {
														setTouched({});
													}}
													onBlur={handleBlur}
													onChange={handleChange}
													mt={'8px'}
													placeholder='Re-Enter your payment email address'
													sx={inputStyles}
													autoComplete='off'
												/>
												{paypalError && (
													<Text fontSize='12px' fontWeight='500' mt='8px' color='accent' h='18px'>
														Error two email addresses you have entered don&apos;t match
													</Text>
												)}
											</Box>
										)}
									</Flex>

									<Flex justify='space-between' mt='16px' pb='5px' gap='16px' align='center'>
										{Object.keys(errors)?.length > 0 && (
											<Text pl='12px' color='accent'>
												*Required
											</Text>
										)}
										<Flex>
											<CustomButton isSubmiting={isLoading} w='150px' h='56px' type='submit'>
												Save
											</CustomButton>
											<CustomButton styles={'light'} ml='16px' onClickHandler={() => setIsModalOpen(false)}>
												Cancel
											</CustomButton>
										</Flex>
									</Flex>
								</Form>
							);
						}}
					</Formik>
				</Flex>
			</CustomModal>
		</>
	);
}
export default EnteringMissingValuesModal;
