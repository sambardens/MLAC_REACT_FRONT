import Image from 'next/image';
import { useRouter } from 'next/router';

import { Box, Flex, Text, useToast } from '@chakra-ui/react';

import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import { addSignatureOrDispute } from 'store/operations';

import CustomButton from '@/components/Buttons/CustomButton';

import AddressField from '../AddressField/AddressField';
import DisputeArea from '../DisputeArea/DisputeArea';
import PaymentField from '../PaymentField/PaymentField';
import SignatureImage from '../SignatureImage/SignatureImage';
import VerifyForSignature from '../VerifyForSignature/VerifyForSignature';

const Field = ({ title, text }) => (
	<Flex align='center' justify='space-between' gap='8px'>
		<Text fontWeight='400' fontSize='16px' color='secondary' w='120px'>
			{title}
		</Text>
		<Text fontWeight='500' fontSize='18px' color='black'>
			{text}
		</Text>
	</Flex>
);

const SplitCardInModal = ({ user, contractId }) => {
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();
	const {
		phone,
		email,
		address,
		paymentEmail,
		streetAddressOne,
		streetAddressTwo,
		city,
		regionState,
		postCodeZipCode,
		country,
	} = useSelector(state => state.user.user);
	const { selectedBap, selectedRelease, allSplitsAndContracts } = useSelector(state => state.user);

	const toast = useToast();
	const canvasRef = useRef(null);
	const [addressField, setAddressField] = useState(false);
	const [verifyField, setVerifyField] = useState(false);
	const [paymentField, setPaymentField] = useState(false);
	const [signatureField, setSignatureField] = useState(false);
	const [disputeField, setDisputeField] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { pathname } = useRouter();
	const isReleasePage = pathname.includes('/releases');
	const isContractsAndSplitsPage = pathname.includes('/splits-contracts');
	const isMyContractsAndSplitsPage = pathname.includes('/my-splits-contracts');

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

	const getDealList = () => {
		let allDeals;
		if (isReleasePage) {
			allDeals = selectedRelease.splitsAndContracts;
		} else if (isContractsAndSplitsPage) {
			allDeals = selectedBap.splitsAndContracts;
		} else if (isMyContractsAndSplitsPage) {
			allDeals = allSplitsAndContracts;
		}
		return allDeals;
	};

	const handleDispute = async value => {
		setIsLoading(true);
		const formData = { content: value, isAccept: false };
		const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;

		const res = await dispatch(
			addSignatureOrDispute({
				axiosPrivate,
				formData,
				contractId,
				creatorOrAdmin,
				deal: selectedRelease.selectedSplit,
				allDeals: getDealList(),
			}),
		);
		if (res?.payload?.success) {
			getToast('Success', 'The contract is disputed, a message will be sent to  all other parties.');
			setDisputeField(false);
		} else {
			getToast('Error', 'Error. Something went wrong. Please try again.');
		}
		setIsLoading(false);
	};
	const handleSignature = async () => {
		setIsLoading(true);
		const dataUrl = canvasRef.current.toDataURL();
		const blob = await fetch(dataUrl).then(res => res.blob());
		const image = URL.createObjectURL(blob);
		// Запись в state в виде файла
		const file = new File([blob], { type: 'image/png' });
		const formData = new FormData();
		formData.append('signature', file);
		formData.append('isAccept', true);
		const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
		const res = await dispatch(
			addSignatureOrDispute({
				axiosPrivate,
				formData,
				contractId,
				creatorOrAdmin,
				deal: selectedRelease.selectedSplit,
				allDeals: getDealList(),
				image,
			}),
		);
		if (res?.payload?.success) {
			setSignatureField(false);
			getToast('Success', 'Your signature has been saved!');
		} else {
			getToast('Error', 'Error. Something went wrong. Please try again.');
		}
		setIsLoading(false);
	};

	const handleAddressSaved = () => {
		setAddressField(false);
		if (phone && paymentEmail) {
			setSignatureField(true);
		} else if (!phone) {
			setVerifyField(true);
		} else if (!paymentEmail) {
			setPaymentField(true);
		}
	};

	const handlePaymentSaved = () => {
		setPaymentField(false);
		if (phone && address) {
			setSignatureField(true);
		}
	};

	const handleVerify = () => {
		setVerifyField(false);
		if (paymentEmail && address) {
			setSignatureField(true);
		} else if (!paymentEmail) {
			setPaymentField(true);
		}
	};

	const onSignature = () => {
		if (!streetAddressOne || !city || !country) {
			setAddressField(true);
		} else if (!phone) {
			setVerifyField(true);
		} else if (!paymentEmail) {
			setPaymentField(true);
		} else {
			setSignatureField(true);
		}
	};

	const isSignatureBtn =
		contractId && !selectedRelease.selectedSplit?.isCancelled && email === user.email;
	const WaitSignature =
		contractId &&
		!selectedRelease.selectedSplit?.isCancelled &&
		email !== user.email &&
		!user.signatureSrc;
	const showBaseBtn =
		!verifyField &&
		!addressField &&
		!paymentField &&
		!signatureField &&
		!disputeField &&
		isSignatureBtn &&
		!user.signatureSrc;

	// const writers =
	// 	user?.credits?.length > 0 ? user?.credits.map(el => el.value).join(', ') : 'No credit';
	return (
		<Box as='li' p='16px' bg='bg.light' borderRadius='10px'>
			<Flex flexDir='column' gap='16px'>
				<Field
					title='Writer'
					text={
						user.firstName ? (
							`${user.firstName} ${user?.lastName || ''}`
						) : (
							<>
								{user.email}
								<Text as='span' fontWeight={400} color='secondary'>
									(pending)
								</Text>
							</>
						)
					}
				/>
				{/* <Field title='Credit' text={writers} /> */}
				<Field title='Ownership' text={`${user?.ownership}%`} />
				{user?.signatureSrc && (
					<Box bg='transparent' h='100px' pos='relative' mx='24px'>
						<Image src={user.signatureSrc} alt='signature' fill quality='100' />
					</Box>
				)}

				<>
					{WaitSignature && (
						<Text align='end' fontSize='16px' fontWeight='500' color='accent'>
							Wait signature
						</Text>
					)}
					{signatureField && (
						<SignatureImage
							handleSignature={handleSignature}
							canvasRef={canvasRef}
							setSignatureField={setSignatureField}
							isSignatureBtn={isSignatureBtn}
							isLoading={isLoading}
						/>
					)}
					{addressField && (
						<AddressField handleAddressSaved={handleAddressSaved} setAddressField={setAddressField} />
					)}
					{paymentField && (
						<PaymentField handlePaymentSaved={handlePaymentSaved} setPaymentField={setPaymentField} />
					)}
					{verifyField && <VerifyForSignature handleVerify={handleVerify} />}
					{disputeField && (
						<DisputeArea
							setDisputeField={setDisputeField}
							handleDispute={handleDispute}
							isLoading={isLoading}
						/>
					)}
					{showBaseBtn && (
						<Flex justify='flex-end'>
							<CustomButton styles='main' onClickHandler={onSignature}>
								Signature
							</CustomButton>

							{!selectedBap?.isCreator && (
								<CustomButton
									styles='trasparent'
									onClickHandler={() => {
										setDisputeField(true);
									}}
									ml='16px'
								>
									Dispute
								</CustomButton>
							)}
						</Flex>
					)}
				</>
			</Flex>
		</Box>
	);
};

export default SplitCardInModal;
