import { useRouter } from 'next/router';

import { Box, Flex, Text, useToast } from '@chakra-ui/react';

import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import acceptToBeFutureCreatorOfBap from 'src/functions/serverRequests/bap/acceptToBeFutureCreatorOfBap';
import confirmDeletionBap from 'src/functions/serverRequests/bap/confirmDeletionBap';
import getBapsRequest from 'src/functions/serverRequests/bap/getBapsRequest';
import checkNotifications from 'src/functions/serverRequests/notifications/checkNotifications';
import { logIn } from 'store/auth/auth-operations';
import { setInviteToken } from 'store/auth/auth-slice';
import { getBapMembers, getBapReleases } from 'store/operations';
import { resetSelectedBap, setBap, setBaps, setDeleteToken, setTakeoverToken } from 'store/slice';
import * as yup from 'yup';

import CustomButton from '@/components/Buttons/CustomButton';

import FormikField from '../FormikField/FormikField';
import SocialAuth from '../SocialAuth/SocialAuth';

export const SignIn = ({ accentColor, btnTextColor, closeModalInWeb }) => {
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();
	const router = useRouter();
	const isWebPage = router.pathname.includes('music');
	const [errorMsg, setErrorMsg] = useState('');
	const [isShowPass, setIsShowPass] = useState(false);
	const dispatch = useDispatch();
	const { selectedBap, deleteToken, takeoverToken, user } = useSelector(state => state.user);
	const { inviteToken } = useSelector(state => state.auth);
	const axiosPrivate = useAxiosPrivate();

	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 5000,
			isClosable: true,
		});
	};
	const validationSchema = yup.object().shape({
		email: yup.string().email('Enter correct email').required('Required'),
		password: yup.string().typeError('Password should be a string').required('Required'),
	});

	const acceptInviteToBapHandler = async () => {
		const formData = new FormData();
		formData.append('isAccept', true);
		const resData = await checkNotifications(formData, inviteToken);

		dispatch(setInviteToken(null));

		if (resData.success) {
			getToast('Success', 'New BAP was added to your B.A.P. list');
			return;
		}
		getToast('Error', `Failed to add a new B.A.P. to your B.A.P. list. ${resData.message}`);
	};

	const takeoverBapHandler = async () => {
		const resData = await acceptToBeFutureCreatorOfBap(takeoverToken);
		dispatch(setTakeoverToken(null));

		if (resData.success) {
			getToast('Success', `B.A.P. ${resData?.bap?.name} was taken over successfully!`);
		}

		if (!resData.success) {
			getToast('Error', `Failed to take over B.A.P.: ${resData.message}`);
		}
	};

	const updateBaps = async () => {
		const bapsWithImages = await getBapsRequest(axiosPrivate);
		dispatch(setBaps(bapsWithImages));
		dispatch(setBap(bapsWithImages[0]));
		if (bapsWithImages.every(bap => bap.bapId !== selectedBap.bapId)) {
			if (bapsWithImages.length) {
				dispatch(getBapReleases(bapsWithImages[0].bapId));
				dispatch(getBapMembers({ bapId: bapsWithImages[0].bapId, userId: user?.id }));
				router.push({
					pathname: '/bap/[bapId]/dashboard',
					query: { bapId: bapsWithImages[0]?.bapId },
				});
			} else {
				dispatch(resetSelectedBap());
				router.push('/my-splits-contracts');
			}
		}
	};

	const deleteBapHandler = async () => {
		const resData = await confirmDeletionBap(deleteToken);
		if (resData.success) {
			setTimeout(updateBaps, 120000);
			getToast('Success', 'Your B.A.P. will be removed in the next few minutes.');
		}

		if (!resData.success) {
			getToast('Error', `Failed to delete the B.A.P.: ${resData.message}`);
		}
		dispatch(setDeleteToken(null));
	};

	const handleSubmit = async values => {
		const { email, password } = values;
		try {
			setIsLoading(true);
			const res = await dispatch(logIn({ email, password }));
			if (res?.payload?.accessToken) {
				setErrorMsg('');
				if (res?.payload?.user?.isEmailConfirmed === false) {
					getToast('Error', 'Email not confirmed. Please check your email to confirm it now.');
					setIsLoading(false);
					return;
				}

				if (isWebPage) {
					closeModalInWeb();
					setIsLoading(false);
					return;
				}
				if (inviteToken) {
					await acceptInviteToBapHandler();
				}

				if (deleteToken) {
					await deleteBapHandler();
				}

				if (takeoverToken) {
					await takeoverBapHandler();
				}
				const bapsWithImages = await getBapsRequest(axiosPrivate);
				dispatch(setBaps(bapsWithImages));
				if (res?.payload?.user?.isNew) {
					router.push('/welcome');
				} else {
					if (bapsWithImages?.length) {
						router
							.push({
								pathname: '/bap/[bapId]/dashboard',
								query: { bapId: bapsWithImages[0]?.bapId },
							})
							.then(() => {
								setIsLoading(false);
							});
					} else {
						router.push('/my-splits-contracts').then(() => {
							setIsLoading(false);
						});
					}
				}
			} else {
				getToast('Error', `${res?.payload.error}`);
				setErrorMsg(res?.payload?.error);
				setIsLoading(false);
			}
		} catch (e) {
			console.log('SignIn error:', e);
			setIsLoading(false);
		}
	};

	return (
		<>
			<Formik
				initialValues={{
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
								isShowForgotPass={!isWebPage}
							/>
						</Flex>
						<CustomButton
							type='submit'
							w='100%'
							color={btnTextColor}
							bgColor={accentColor}
							isSubmiting={isLoading}
						>
							Sign in
						</CustomButton>
						{!errorMsg && (
							<Text
								pos='absolute'
								color={accentColor || 'accent'}
								left='50%'
								bottom='-5px'
								transform={'translate(-50%,100%)'}
								fontWeight='400'
								fontSize='16px'
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

			<SocialAuth
				setErrorMsg={setErrorMsg}
				deleteBapHandler={deleteBapHandler}
				acceptInviteToBapHandler={acceptInviteToBapHandler}
				takeoverBapHandler={takeoverBapHandler}
			/>
		</>
	);
};

export default SignIn;
