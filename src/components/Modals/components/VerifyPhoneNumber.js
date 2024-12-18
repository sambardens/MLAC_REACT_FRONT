import { Box, Flex, useToast } from '@chakra-ui/react';

import axios from 'axios';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { saveUserData } from 'store/operations';

import CustomButton from '@/components/Buttons/CustomButton';

import { authentication } from '../../../firebase-config';

import VerifyModal from './VerifyModal';

const VerifyPhoneNumber = ({
	setNewPhone = false,
	setIsVerifiedPhone = false,
	isVerifiedPhone = false,
}) => {
	const { user } = useSelector(state => state.user);
	const [phone, setPhone] = useState(user?.phone);
	const [isPhoneValid, setIsPhoneValid] = useState(user?.phone ? true : false);
	const [isVerifyModal, setIsVerifyModal] = useState(false);
	const [isPhoneVerified, setIsPhoneVerified] = useState(false);
	const [isSavingPhone, setIsSavingPhone] = useState(false);
	const [countryCode, setCountryCode] = useState('');

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

	const handlePhoneInput = (inputValue, country) => {
		setPhone(inputValue);
		setNewPhone && setNewPhone(inputValue);
		if (inputValue && country) {
			const validNumbersOfDigits = country.format.split('').filter(el => el === '.').length;
			const actualNumbersOfDigits = inputValue.length;
			const isValid = validNumbersOfDigits === actualNumbersOfDigits;
			setIsPhoneValid(isValid);
		}
	};

	const generateRecaptcha = () => {
		const recaptchaDiv = document.getElementById('recaptcha-div');
		if (recaptchaDiv) {
			recaptchaDiv.remove();
		}

		const newRecaptchaDiv = document.createElement('div');
		newRecaptchaDiv.setAttribute('id', 'recaptcha-div');
		const parentElement = document.getElementById('parent-element');
		parentElement.appendChild(newRecaptchaDiv);

		try {
			if (newRecaptchaDiv && parentElement) {
				window.recaptchaVerifier = new RecaptchaVerifier(
					'recaptcha-div',
					{
						size: 'invisible',
						callback: response => {},
						expiredCallback: () => {
							// Response expired. Ask user to solve reCAPTCHA again.
						},
					},
					authentication,
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const phoneForVerification = `+${phone}`;

	const requestOTP = () => {
		if (phoneForVerification.length >= 12) {
			setIsVerifyModal(true);
			generateRecaptcha();
			const appVerifier = window.recaptchaVerifier;
			signInWithPhoneNumber(authentication, phoneForVerification, appVerifier)
				.then(confirmationResult => {
					window.confirmationResult = confirmationResult;
				})
				.catch(error => {
					if (error.message === 'Firebase: Error (auth/too-many-requests).') {
						getToast('error', 'Error', 'Too many attempts. Try later');
						setIsVerifyModal(false);
						const recaptchaDiv = document.getElementById('recaptcha-div');
						recaptchaDiv.remove();
					}
				});
		}
	};
	useEffect(() => {
		isPhoneVerified && setIsVerifiedPhone && setIsVerifiedPhone(true);
	}, [isPhoneVerified, setIsVerifiedPhone]);

	useEffect(() => {
		if (isPhoneVerified) {
			const savePhone = async () => {
				setIsSavingPhone(true);
				const res = await dispatch(saveUserData({ phone }));
				if (res?.payload?.success) {
					getToast('success', 'Success', 'Thank you, your phone was verified and saved');
				}
				setIsPhoneVerified(false);
				setIsSavingPhone(false);
			};
			!setIsVerifiedPhone && savePhone();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPhoneVerified]);

	useEffect(() => {
		const getIpAddress = async () => {
			try {
				const { data } = await axios.get('https://ipapi.co/json');
				if (!phone && data.country_code) {
					setCountryCode(data.country_code?.toLowerCase());
				}
			} catch (error) {
				console.error("Can't get user locatioan and ip", error);
			}
		};

		getIpAddress();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Box>
			<Flex align='center'>
				<PhoneInput
					country={countryCode || 'gb'}
					value={phone}
					countryCodeEditable={false}
					onChange={(inputValue, country) => handlePhoneInput(inputValue, country)}
					isValid={phone ? isPhoneValid : true}
					inputStyle={{ width: '100%', height: '56px', borderRadius: '10px' }}
					placeholder='Enter your phone'
					readOnly={isVerifiedPhone}
					inputProps={{
						id: 'phone',
						autoComplete: 'on',
					}}
				/>

				<Flex ml='12px'>
					{(isVerifiedPhone || phone === user.phone) && isPhoneValid && (
						<CustomButton styles={'disabled'} isEditable={false} ml='auto'>
							Verified
						</CustomButton>
					)}
					{!isVerifiedPhone && (
						<>
							{isPhoneValid && phone !== user.phone && (
								<CustomButton
									styles={'main'}
									onClickHandler={requestOTP}
									ml='auto'
									isSubmiting={isSavingPhone}
								>
									Verify
								</CustomButton>
							)}

							{!isPhoneValid && (
								<CustomButton styles={'disabled'} isEditable={false} ml='auto' isSubmiting={isSavingPhone}>
									Verify
								</CustomButton>
							)}
						</>
					)}
				</Flex>

				<div id='parent-element'></div>
			</Flex>
			{isVerifyModal && (
				<VerifyModal
					closeModal={() => setIsVerifyModal(false)}
					setIsPhoneVerified={setIsPhoneVerified}
				/>
			)}
		</Box>
	);
};

export default VerifyPhoneNumber;
