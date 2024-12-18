import { Box, Flex, Text, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editBapInfo } from 'store/operations';
import { setSelectedBapUpdated } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';

import { poppins_400_16_24, poppins_500_18_27, poppins_600_18_27 } from '@/styles/fontStyles';

export const Tracking = ({ trackingEditMode, setTrackingEditMode }) => {
	const { selectedBap, selectedBapUpdated } = useSelector(state => state.user);
	const [isLoadingSaveData, setIsLoadingSaveData] = useState(false);
	const [facebookPixel, setFacebookPixel] = useState(selectedBap?.facebookPixel);
	const [isInvalid, setIsInvalid] = useState(false);
	const dispatch = useDispatch();
	const toast = useToast();

	const saveLinkHandler = async () => {
		setIsLoadingSaveData(true);

		if (facebookPixel !== selectedBapUpdated?.facebookPixel) {
			const bapData = {
				name: selectedBapUpdated.bapName?.trim(),
				description: selectedBapUpdated.bapDescription?.trim(),
				artistBio: selectedBapUpdated.bapArtistBio?.trim(),
				bapImageSrc: selectedBapUpdated.bapImageSrc,
				bapId: selectedBapUpdated.bapId,
				facebookPixel,
				changePixel: true,
			};
			const pixelRes = await dispatch(editBapInfo(bapData));
			if (pixelRes?.payload?.error) {
				toast({
					position: 'top',
					title: 'Error',
					description: 'Something went wrong, changes have not been saved. Please try again later.',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
				setIsLoadingSaveData(false);
				return;
			}
		}
		setTrackingEditMode(false);
		setIsLoadingSaveData(false);
	};
	const fbStatus = facebookPixel?.length === 0 || facebookPixel?.length === 15;

	const handleBlur = () => {
		setIsInvalid(!fbStatus);
	};

	const handleChange = e => {
		const { value } = e.target;
		const numberRegex = /^[0-9]+$/;
		if (value === '' || numberRegex.test(value)) {
			setFacebookPixel(value);
		}
	};

	const isNewPixel = fbStatus && facebookPixel !== selectedBap?.facebookPixel;
	useEffect(() => {
		dispatch(setSelectedBapUpdated({ ...selectedBapUpdated, isEdited: isNewPixel }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, isNewPixel]);

	const onCancel = () => {
		setFacebookPixel(selectedBap?.facebookPixel);
		setTrackingEditMode(false);
		dispatch(setSelectedBapUpdated({ ...selectedBapUpdated, isEdited: false }));
	};
	return (
		<Flex
			flexDir={'column'}
			h={'100%'}
			overflow={'auto'}
			mt={trackingEditMode ? '0' : '22px'}
			mr='24px'
			p='2px 2px 0 0'
		>
			<Flex align='center' justify='space-between' ml={trackingEditMode ? '12px' : '16px'} mb='24px'>
				<Text color='black' sx={poppins_600_18_27}>
					Tracking
				</Text>

				{trackingEditMode && (
					<Flex>
						<CustomButton
							isSubmiting={isLoadingSaveData}
							w={'150px'}
							styles={isNewPixel ? 'main' : 'disabled'}
							onClickHandler={saveLinkHandler}
						>
							Save
						</CustomButton>
						<CustomButton styles={'light'} w={'150px'} ml='16px' onClickHandler={onCancel}>
							Cancel
						</CustomButton>
					</Flex>
				)}
			</Flex>

			{trackingEditMode ? (
				<CustomInput
					label='Facebook Pixel'
					name='facebookPixel'
					placeholder={'Please enter a 15-digit Facebook pixel number'}
					onChange={handleChange}
					value={facebookPixel || ''}
					maxLength={15}
					minHeight='120px'
					w='475px'
					onBlur={handleBlur}
					isInvalid={isInvalid}
				/>
			) : (
				<Box pl='16px'>
					{facebookPixel ? (
						<>
							<Text as='h2' color='black' sx={poppins_500_18_27}>
								Facebook pixel
							</Text>
							<Text color='black' sx={poppins_400_16_24} mt='8px'>
								{facebookPixel}
							</Text>
						</>
					) : (
						<Text color='textColor.gray' sx={poppins_400_16_24} mt='8px'>
							You have not added a Facebook Pixel number.
						</Text>
					)}
				</Box>
			)}
		</Flex>
	);
};
