import { Box, Flex, FormControl, FormLabel, Icon, Link, Text, useToast } from '@chakra-ui/react';

import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import useImageResizer from 'src/functions/customHooks/useImageResizer';
import resetPassword from 'src/functions/serverRequests/mails/resetPassword';
import editUserProfileRequest from 'src/functions/serverRequests/user/editUserProfileRequest';
import { deleteUserAvatar, setUserNewEmail } from 'store/operations';
import { setUser } from 'store/slice';
import * as yup from 'yup';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomModal from '@/components/Modals/CustomModal';

import PayPalIcon from '@/assets/icons/base/paypal.svg';

import NextButton from '../Buttons/NextButton/NextButton';
import CustomInput from '../CustomInputs/CustomInput';

import DeleteAccountModal from './DeleteAccountModal';
import { Address } from './components/Address';
import StageScale from './components/StageScale';
import UploadImageAvatar from './components/UploadImageAvatar';
import VerifyPhoneNumber from './components/VerifyPhoneNumber';

const UserProfile = ({ closeModal, goToNextModal, setIsVerificateEmailModal }) => {
	const axiosPrivate = useAxiosPrivate();
	const { user } = useSelector(state => state.user);
	const {
		firstName,
		lastName,
		email,
		paymentEmail,
		newEmail,
		streetAddressOne,
		streetAddressTwo,
		city,
		regionState,
		postCodeZipCode,
		country,
	} = user;
	const initialValues = {
		firstName: firstName || '',
		lastName: lastName || '',
		email: email || '',
		paymentEmail: paymentEmail || '',
		paymentEmailCopy: '',
		newEmail: newEmail || '',
		streetAddressOne: streetAddressOne || '',
		streetAddressTwo: streetAddressTwo || '',
		city: city || '',
		regionState: regionState || '',
		postCodeZipCode: postCodeZipCode || '',
		country: country || '',
	};
	const toast = useToast();
	const [imageFile, setImageFile] = useState(null);
	const [imageSrc, setImageSrc] = useState(user?.avatarSrc || null);
	const dispatch = useDispatch();
	const [resizedImage, resizeImage] = useImageResizer();
	const [showNewEmailField, setShowNewEmailField] = useState(Boolean(user?.newEmail));
	const [isDeleteAccountModal, setIsDeleteAccountModal] = useState(false);
	const [isPaypalEmailEditMode, setIsPaypalEmailEditMode] = useState(false);
	const [paypalError, setPaypalError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const validationSchema = yup.object().shape({
		firstName: yup.string().required('Required'),
		lastName: yup.string().required('Required'),
		email: yup.string().email('Enter correct email').required('Required'),
		paymentEmail: yup.string().email('Enter correct email'),
		paymentEmailCopy: yup.string().email('Enter correct email'),
		newEmail: yup.string().email('Enter correct email'),
		streetAddressOne: yup.string(),
		streetAddressTwo: yup.string(),
		city: yup.string(),
		regionState: yup.string(),
		postCodeZipCode: yup.string().min(5, 'Must be at least 5 characters long').nullable(),
		country: yup.string(),
	});

	const getToast = (type, text, time = 8000) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: time,
			isClosable: true,
		});
	};

	// for payPal login button
	// useEffect(() => {
	// 	// Dynamically create the script element
	// 	const script = document.createElement('script');
	// 	script.src = 'https://www.paypalobjects.com/js/external/api.js';
	// 	script.async = true;
	// 	script.onload = () => {
	// 		window.paypal.use(['login'], function (login) {
	// 			login.render({
	// 				appid: 'AagePjoIu--oJgYTaEfLnHqj2IM-a3cLwEv42ByNtiBiqqby04uhHtVWlavFrWTzm_rwMu8aJK684a1H',
	// 				authend: 'sandbox',
	// 				scopes: 'openid',
	// 				containerid: 'lippButton',
	// 				responseType: 'code',
	// 				locale: 'en-gb',
	// 				buttonType: 'LWP',
	// 				buttonShape: 'pill',
	// 				buttonSize: 'lg',
	// 				fullPage: 'true',
	// 				returnurl: 'http://localhost:3000/',
	// 			});
	// 		});
	// 	};
	// 	document.body.appendChild(script);
	// 	return () => {
	// 		document.body.removeChild(script);
	// 	};
	// }, []);

	useEffect(() => {
		imageFile && resizeImage(imageFile, 150, 150);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageFile]);

	const handleEditAvatar = async () => {
		const formdata = new FormData();
		formdata.append('avatar', imageFile);
		const res = await editUserProfileRequest(formdata, axiosPrivate);
		setImageFile(null);
		if (res.success) {
			dispatch(setUser({ ...res?.settings }));
		}
	};
	useEffect(() => {
		if (user?.isNew && imageFile) {
			handleEditAvatar();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageFile]);

	useEffect(() => {
		user?.avatarSrc && setImageSrc(user.avatarSrc);
	}, [user?.avatarSrc]);

	const handlePasswordReset = async () => {
		const res = await resetPassword(user.email);
		if (res.success === true) {
			getToast('Success', 'Check your email to change your password.');
		} else {
			getToast('Error', `${res?.message}!`);
		}
	};

	const handleSubmit = async formValues => {
		const isNewFirstName = formValues.firstName && formValues.firstName !== user.firstName;
		const isNewLastName = formValues.lastName && formValues.lastName !== user.lastName;
		const isNewEmail = formValues.newEmail && formValues.newEmail !== user.newEmail;
		const isNewPaymentEmail = formValues.paymentEmail !== (user?.paymentEmail || '');
		// address
		const isNewStreetAddressOne = formValues.streetAddressOne !== (user.streetAddressOne || '');
		const isNewStreetAddressTwo = formValues.streetAddressTwo !== (user.streetAddressTwo || '');
		const isNewCity = formValues.city !== (user.city || '');
		const isNewRegionState = formValues.regionState !== (user.regionState || '');
		const isNewPostCodeZipCode = formValues.postCodeZipCode !== (user.postCodeZipCode || '');
		const isNewCountry = formValues.country !== (user.country || '');

		const isAvatarToDelete = Boolean(user?.avatarSrc) && imageSrc === null;
		const isNeedToEditUser =
			isNewFirstName ||
			isNewLastName ||
			isNewPaymentEmail ||
			imageFile ||
			isNewStreetAddressOne ||
			isNewStreetAddressTwo ||
			isNewCity ||
			isNewRegionState ||
			isNewPostCodeZipCode ||
			isNewCountry;

		if (
			(isNewPaymentEmail || formValues.paymentEmailCopy) &&
			(formValues.paymentEmail || formValues.paymentEmailCopy) &&
			formValues.paymentEmail !== formValues.paymentEmailCopy
		) {
			setPaypalError(true);
			return;
		}
		if (isAvatarToDelete) {
			!user?.isNew && setIsLoading(true);
			const avatarDeleted = await dispatch(deleteUserAvatar());
			if (avatarDeleted?.payload?.success) {
				getToast('Success', 'Your avatar has been successfully deleted!', 3000);
			}
		}

		setPaypalError(false);
		if (isNeedToEditUser) {
			!user?.isNew && setIsLoading(true);
			const formdata = new FormData();
			isNewFirstName && formdata.append('firstName', formValues.firstName);
			isNewLastName && formdata.append('lastName', formValues.lastName);
			isNewPaymentEmail && formdata.append('paymentEmail', formValues.paymentEmail);

			// adress
			isNewStreetAddressOne && formdata.append('streetAddressOne', formValues.streetAddressOne);
			isNewStreetAddressTwo && formdata.append('streetAddressTwo', formValues.streetAddressTwo);
			isNewCity && formdata.append('city', formValues.city);
			isNewRegionState && formdata.append('regionState', formValues.regionState);
			isNewPostCodeZipCode && formdata.append('postCodeZipCode', formValues.postCodeZipCode);
			isNewCountry && formdata.append('country', formValues.country);

			imageFile && formdata.append('avatar', resizedImage);

			const res = await editUserProfileRequest(formdata, axiosPrivate);

			if (res.success) {
				!user?.isNew && getToast('Success', 'Your profile image has successfully been deleted.', 3000);
				dispatch(setUser({ ...res?.settings }));

				if (!user?.isNew) {
					closeModal();
				}
			} else {
				getToast('Error', res.message, 5000);
			}
		}
		if (isNewEmail) {
			!user?.isNew && setIsLoading(true);
			const res = await dispatch(setUserNewEmail({ newEmail: formValues.newEmail }));
			if (res?.payload.success) {
				setIsVerificateEmailModal(true);
			} else {
				getToast(
					'Error',
					`Verification message has not been sent to your new email! ${res?.payload?.error}.`,
					8000,
				);
			}
		}

		setIsLoading(false);

		if (!user?.isNew) {
			closeModal();
		}
	};

	const handleNewEmailChange = () => {
		setShowNewEmailField(!showNewEmailField);
	};

	return user?.isNew ? (
		<CustomModal
			closeModal={closeModal}
			isCentered={true}
			maxW='1170px'
			maxH='725px'
			w='90vw'
			bgImage={'/assets/images/Harry-Heart.jpg'}
		>
			<Flex flexDir={'column'} alignItems='start' w='100%' maxW={{ lg: '640px' }}>
				<Text fontSize={{ base: '20px', sm: '28px', md: '32px' }} fontWeight='600'>
					Welcome to
					<Box as='span' ml='10px' color='accent'>
						Major Labl Artist Club
					</Box>
				</Text>

				<Flex w='100%' mt='24px'>
					<StageScale isRed={true} />
					<StageScale />
					<StageScale />
				</Flex>

				<Text mt='24px' fontSize={'18px'} fontWeight={'500'}>
					1. Create profile
				</Text>

				<Text mt='8px' mb='16px' fontSize={'16px'} fontWeight={'400'} color='secondary'>
					Fill out your profile to get started
				</Text>

				<Formik initialValues={initialValues} validationSchema={validationSchema}>
					{({ values, handleChange, handleBlur, errors, touched, setTouched }) => (
						<Form style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
							<Flex
								flexDir='column'
								maxW={{ base: '100%', lg: '430px' }}
								h='100%'
								maxHeight='calc(760px - 375px)'
								overflowY='scroll'
								pr='10px'
								pb='3px'
								gap='12px'
							>
								<Flex alignItems='center'>
									<UploadImageAvatar
										imageSrc={imageSrc}
										setImageSrc={setImageSrc}
										setImageFile={setImageFile}
										firstVisit={true}
									/>
								</Flex>

								<CustomInput
									label='First name'
									type='text'
									name='firstName'
									value={values.firstName}
									onChange={handleChange}
									onBlur={e => {
										console.log('e: ', e);
										handleBlur(e);
										handleSubmit(values);
									}}
									onFocus={() => setTouched({})}
									placeholder='Enter your first name'
									isInvalid={errors.firstName && touched.firstName}
								/>

								<CustomInput
									label='Last name'
									type='text'
									name='lastName'
									value={values.lastName}
									onChange={handleChange}
									onBlur={e => {
										handleBlur(e);
										handleSubmit(values);
									}}
									onFocus={() => setTouched({})}
									placeholder='Enter your last name'
									isInvalid={errors.lastName && touched.lastName}
								/>

								<CustomInput
									label='Email'
									type='email'
									name='email'
									autoComplete='off'
									value={values.email}
									readOnly={true}
								/>

								{/* <Address
									values={values}
									handleChange={handleChange}
									handleBlur={e => {
										handleBlur(e);
										handleSubmit(values);
									}}
									handleFocus={() => setTouched({})}
									errors={errors}
									touched={touched}
								/>
								<FormControl>
									<FormLabel mb='4px' pl='12px' fontSize='16px' fontWeight='400' color='black'>
										Mobile phone
									</FormLabel>
									<VerifyPhoneNumber />
								</FormControl> */}

								{/* <FormControl id='paymentEmail' isInvalid={errors.paymentEmail && touched.paymentEmail}>
                  <Flex alignItems='center' pl='12px'>
                    <FormLabel
                      htmlFor='paymentEmail' fontSize='16px' fontWeight='400'
                      mb='0'>
											Payment Information
                    </FormLabel>
                    <Icon
                      as={PayPalIcon} ml='12px' w='100px'
                      h='24px' />
                  </Flex>

                  <CustomInput
                    type='email'
                    name='paymentEmail'
                    value={values.paymentEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    mt={'4px'}
                    placeholder='Enter your payment email address'
                  />
                  <FormErrorMessage>{errors.paymentEmail}</FormErrorMessage>
                  <Text mt='4px' fontSize={'12px'}>
										(Make sure you use your payment email address otherwise you won-t receive payments)
                  </Text>
                </FormControl> */}

								{/* <Text fontSize={'16px'} fontWeight={'400'}>
									Connect to bank account
								</Text> */}
							</Flex>
							<Flex pr={{ base: '16px', lg: '0' }} mt='24px'>
								<NextButton onClickHandler={goToNextModal} />
							</Flex>
						</Form>
					)}
				</Formik>
			</Flex>
		</CustomModal>
	) : (
		<>
			<CustomModal
				isCloseCross={false}
				closeOnOverlayClick={false}
				closeModal={closeModal}
				isCentered={true}
				maxH='90vh'
				maxW='640px'
				p='40px 0 40px 40px'
			>
				<Flex flexDir={'column'} alignItems='start' w='100%'>
					<Formik
						initialValues={initialValues}
						onSubmit={handleSubmit}
						validationSchema={validationSchema}
					>
						{({ values, handleChange, handleBlur, errors, touched, setTouched }) => {
							const isNewPaymentEmail = values.paymentEmail !== (user?.paymentEmail || '');
							const isHideDisabled =
								((isNewPaymentEmail || values?.paymentEmailCopy) &&
									values?.paymentEmail !== values?.paymentEmailCopy) ||
								errors.paymentEmail ||
								errors.paymentEmailCopy;

							return (
								<Form style={{ width: '100%' }}>
									<Flex justifyContent='space-between' pr='40px'>
										<Text fontSize={{ base: '20px', sm: '28px', md: '32px' }} fontWeight='600'>
											Profile
										</Text>
										<Flex>
											<CustomButton styles={'light'} ml='16px' onClickHandler={closeModal}>
												Cancel
											</CustomButton>
											<CustomButton isSubmiting={isLoading} w='150px' h='56px' ml='16px' type='submit'>
												Save
											</CustomButton>
										</Flex>
									</Flex>
									<Flex
										flexDir='column'
										gap='12px'
										maxH='calc(90vh - 160px)'
										mt='24px'
										overflowY='scroll'
										pr='40px'
									>
										<UploadImageAvatar
											imageSrc={imageSrc}
											setImageSrc={setImageSrc}
											setImageFile={setImageFile}
										/>
										<CustomInput
											label='First name'
											type='text'
											name='firstName'
											value={values.firstName}
											onChange={handleChange}
											onBlur={handleBlur}
											onFocus={() => setTouched({})}
											placeholder='Enter your first name'
											isInvalid={errors.firstName && touched.firstName}
										/>
										<CustomInput
											label='Last name'
											type='text'
											name='lastName'
											value={values.lastName}
											onChange={handleChange}
											onBlur={handleBlur}
											onFocus={() => setTouched({})}
											placeholder='Enter your last name'
											isInvalid={errors.lastName && touched.lastName}
										/>

										<CustomInput
											label='Email'
											type='email'
											name='email'
											onChange={handleChange}
											value={values.email}
											autoComplete='off'
											readOnly={true}
										/>
										{showNewEmailField && (
											<Box>
												<CustomInput
													label='New email'
													type='email'
													name='newEmail'
													value={values.newEmail}
													onChange={handleChange}
													onBlur={handleBlur}
													onFocus={() => setTouched({})}
													placeholder='Enter your new email address'
													isInvalid={errors.newEmail && touched.newEmail}
													autoComplete='off'
												/>
												{user.newEmail && (
													<Text fontSize='12px' fontWeight='400' pl='12px' color='accent'>
														Chech your email and confirm it
													</Text>
												)}
											</Box>
										)}
										<Flex px='2px' justify='space-between' gap='12px'>
											<CustomButton styles='light-red' w='100%' onClickHandler={handleNewEmailChange}>
												{showNewEmailField ? 'Hide new email' : 'Change email'}
											</CustomButton>
											<CustomButton styles='light-red' w='100%' onClickHandler={handlePasswordReset}>
												Reset password
											</CustomButton>
										</Flex>
										<Address
											values={values}
											handleChange={handleChange}
											handleBlur={handleBlur}
											errors={errors}
											touched={touched}
											handleFocus={() => setTouched({})}
											isTitle={false}
										/>
										<Text fontSize='12px' fontWeight='400' pl='12px'>
											Please note. Major Labl contracts require a valid address and phone number to be added.
										</Text>
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
											<VerifyPhoneNumber />
										</FormControl>
										<Box>
											<Flex align='center' justify='space-between' w='100%' pl='12px'>
												<FormLabel htmlFor='paymentEmail' fontSize='16px' fontWeight='400' mb='0'>
													Payment Details
												</FormLabel>
												<Icon as={PayPalIcon} w='150px' h='36px' />
											</Flex>

											{isPaypalEmailEditMode && (
												<Flex mt='4px' pl='12px'>
													<Text fontSize='12px'>
														To receive payment on Major Labl, you need a PayPal account. Please make sure the
														email you provide is associated with a valid PayPal account. If you don&apos;t have a
														PayPal account, you can sign up by clicking{' '}
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

													<CustomButton
														onClickHandler={() => {
															setIsPaypalEmailEditMode(false);
														}}
														minW='150px'
														ml='12px'
														styles={isHideDisabled ? 'disabled' : 'main'}
													>
														Hide
													</CustomButton>
												</Flex>
											)}
											<Flex align='center' mt='4px'>
												<CustomInput
													isInvalid={errors.paymentEmail && touched.paymentEmail}
													type='email'
													name='paymentEmail'
													value={values.paymentEmail}
													readOnly={!isPaypalEmailEditMode}
													onFocus={() => {
														setTouched({});
													}}
													onBlur={handleBlur}
													onChange={handleChange}
													placeholder={
														!isPaypalEmailEditMode
															? 'Your payment email address is empty'
															: 'Enter your payment email address'
													}
													autoComplete='off'
												/>
												{!isPaypalEmailEditMode && (
													<CustomButton
														onClickHandler={() => {
															setIsPaypalEmailEditMode(true);
														}}
														minW='150px'
														ml='12px'
													>
														Edit
													</CustomButton>
												)}
											</Flex>

											{isPaypalEmailEditMode && (
												<>
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
														autoComplete='off'
													/>
													{paypalError && (
														<Text fontSize='14px' fontWeight='500' mt='8px' color='accent' h='18px' pl='12px'>
															Error two email addresses you have entered don&apos;t match
														</Text>
													)}
												</>
											)}
										</Box>

										<CustomButton
											mt='40px'
											ml='auto'
											h='40px'
											_hover={''}
											onClickHandler={() => {
												setIsDeleteAccountModal(true);
											}}
											styles='light-red'
										>
											Delete account
										</CustomButton>
									</Flex>
								</Form>
							);
						}}
					</Formik>
				</Flex>
			</CustomModal>

			{isDeleteAccountModal && (
				<DeleteAccountModal
					closeModal={() => {
						setIsDeleteAccountModal(false);
					}}
				/>
			)}
		</>
	);
};
export default UserProfile;
