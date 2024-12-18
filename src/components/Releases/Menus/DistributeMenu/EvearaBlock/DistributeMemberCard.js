import { Box, Flex, Image, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import {
	addParticipantEveara,
	getUserFromEveara,
	updateUserEveara,
} from 'src/functions/serverRequests/eveara/eveara';
import compareObjects from 'src/functions/utils/compareObjects';
import { createUserAccountEveara } from 'store/operations';

import CustomButton from '@/components/Buttons/CustomButton';

const DistributeMemberCard = () => {
	const axiosPrivate = useAxiosPrivate();
	const dispatch = useDispatch();
	const toast = useToast();
	const { user } = useSelector(state => state.user);
	const [isNeedToUpdateUserData, setIsNeedToUpdateUserData] = useState(false);

	const userMajorLabl = {
		first_name: user.firstName,
		sur_name: user.lastName,
		email: user.email,
		mobile: user.phone || '',
		zip: (user.postCodeZipCode?.length >= 5 && +user.postCodeZipCode) || '',
		state: user.regionState || '',
		country: user.country || '',
		// street: userData.address.street,
		// house: userData.address.house,
		// city: userData.address.city,
	};

	const handleGetEvearaUser = async () => {
		const res = await getUserFromEveara(user.email, axiosPrivate);

		if (res?.success && res?.data[0]?.uuid) {
			const userData = res.data[0];
			console.log('handleGetEvearaUser userData: ', userData);
			const userEveara = {
				first_name: userData.first_name,
				sur_name: userData.sur_name,
				email: userData.email,
				mobile: userData.address.mobile,
				zip: userData.address.zip ? Number(userData.address.zip) : '',
				state: userData.state?.iso,
				country: userData.country?.iso,
				// street: userData.address.street,
				// house: userData.address.house,
				// city: userData.address.city,
			};

			const isNew = compareObjects(userMajorLabl, userEveara);
			if (isNew) {
				setIsNeedToUpdateUserData(isNew);
			}
		}
	};

	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : 'Success',
			description: text,
			status: type === 'Error' ? 'error' : 'success',
			duration: 5000,
			isClosable: true,
		});
	};

	const userData = {
		email: user.email,
		firstName: user.firstName,
		lastName: user?.lastName,
		address: {
			// street: user?.street || '',
			// house: user?.house || '',
			// city: user?.city || '',
			zip: (user.postCodeZipCode?.length >= 5 && +user.postCodeZipCode) || null,
			mobile: user?.phone || '',
		},
		country: user?.country?.toLowerCase(),
		state: user?.regionState?.toLowerCase(),
	};

	const handleCreateAccount = async () => {
		if (!user?.lastName) {
			getToast('Error', 'At first need to add last name');
			return;
		}

		const res = await dispatch(createUserAccountEveara({ userId: user.userId, userData }));

		if (res?.payload?.success) {
			getToast('Success', 'Distribution account has been created.');
		} else {
			getToast(
				'Error',
				res?.payload?.errors[0]?.message || 'Something has gone wrong. Try again later',
			);
		}
	};

	const handleUpdateAccount = async () => {
		const res = await updateUserEveara({ ...userData, uuidEveara: user.uuidEveara }, axiosPrivate);

		if (res?.success) {
			getToast('Success', 'Account at Eveara has been updated');
			setIsNeedToUpdateUserData(false);
		} else {
			getToast('Error', res?.errors[0]?.message || 'Something has gone wrong. Try again later');
		}
	};

	useEffect(() => {
		handleGetEvearaUser();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box bg='bg.light' borderRadius='10px' p='12px' mt='16px'>
			<Flex align='center' justify='space-between'>
				<Flex align='center' mr='8px' minW='250px'>
					{user?.avatarSrc ? (
						<Image
							src={user?.avatarSrc}
							width='60px'
							height='60px'
							alt='user image'
							borderRadius={'10px'}
						/>
					) : (
						<Flex
							width='60px'
							height='60px'
							borderRadius='10px'
							align='center'
							justify='center'
							bgColor='stroke'
						>
							<Text fontSize={'24px'} fontWeight='600' textAlign='center' mr='6px'>
								{user?.first_name?.charAt(0).toUpperCase()}
							</Text>
							<Text fontSize={'24px'} fontWeight='600' textAlign='center'>
								{user?.sur_name?.charAt(0).toUpperCase()}
							</Text>
						</Flex>
					)}

					<Flex flexDir={'column'} ml={'12px'}>
						<Flex flexWrap={'wrap'}>
							<Text color='black' fontSize='14px' fontWeight='500' mr='5px'>
								{user?.firstName}
							</Text>
							{user?.lastName && (
								<Text color='black' fontSize='14px' fontWeight='500'>
									{user?.lastName}
								</Text>
							)}
						</Flex>

						{/* <Text color='black' fontSize='14px' fontWeight='400' mt='4px'>
							{user.role}
						</Text> */}
						{/* {(user.isCreator || user.isFullAdmin) && (
					<Text color={'textColor.red'} fontSize='14px' fontWeight='400' mt='4px'>
						{user.isCreator ? 'Owner' : 'Admin'}
					</Text>
				)} */}
					</Flex>
				</Flex>

				<Text fontWeight='400' fontSize='16px' color='black' mr='16px'>
					{user?.uuidEveara
						? 'You already have an account at Eveara'
						: "You don't have an account at Eveara"}
				</Text>
			</Flex>
			{!user?.uuidEveara && (
				<Flex align='center' justify='space-between' mt='8px'>
					<Text fontWeight='400' fontSize='16px' color='black' mr='16px'>
						You don&apos;t have at Eveara account yet. Would you like to create?
					</Text>
					<CustomButton onClickHandler={handleCreateAccount} minW='150px'>
						Create account
					</CustomButton>
				</Flex>
			)}
			{isNeedToUpdateUserData && (
				<Flex align='center' justify='space-between' mt='8px'>
					<Text fontWeight='400' fontSize='14px' color='black' mr='16px'>
						Your name at Eveara is different than on Major labl. Would you like to change?
					</Text>
					<CustomButton onClickHandler={handleUpdateAccount} minW='150px'>
						Update account
					</CustomButton>
				</Flex>
			)}
		</Box>
	);
};

export default DistributeMemberCard;
