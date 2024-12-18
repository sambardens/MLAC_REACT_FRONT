import { Box, Flex, Image, Text, useToast } from '@chakra-ui/react';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getBapsRequest from 'src/functions/serverRequests/bap/getBapsRequest';
import checkNotifications from 'src/functions/serverRequests/notifications/checkNotifications';
import getImageSrc from 'src/functions/utils/getImageSrc';
import { setBaps } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomModal from '@/components/Modals/CustomModal';

const InviteBapModal = ({ notification, closeModal, getNotificationsHandler }) => {
	const { senderFirstName, senderLastName, bapName, token, bapAvatar, bapSrc, typeNotificationId } =
		notification;
	const axiosPrivate = useAxiosPrivate();
	const dispatch = useDispatch();
	const toast = useToast();
	const [isSubmitingAccept, setIsSubmitingAccept] = useState(false);
	const [isSubmitingDecline, setIsSubmitingDecline] = useState(false);

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
	const inviteHandler = async boolean => {
		if (boolean) {
			setIsSubmitingAccept(true);
		} else {
			setIsSubmitingDecline(true);
		}

		const data = new FormData();
		data.append('typeNotificationId', `${typeNotificationId}`);
		if (boolean) {
			data.append('isAccept', boolean);
		}
		const resData = await checkNotifications(data, token);

		if (resData.success) {
			const bapsFromServer = await getBapsRequest(axiosPrivate);

			const bapsWithImages = bapsFromServer.map(bap => ({
				...bap,
				src: getImageSrc(bap.bapAvatar),
				srcMin: getImageSrc(bap.thumbnail, false),
			}));

			dispatch(setBaps(bapsWithImages));

			if (resData.success && boolean) {
				getToast('success', 'Success', 'You have successfully accepted the invitation to the B.A.P.!');
			}

			if (resData.success && !boolean) {
				getToast('success', 'Success', 'You have successfully declined the invitation to the B.A.P.!');
			}

			closeModal();
		}

		if (!resData.success) {
			getToast('error', 'Error', resData?.message);
		}

		getNotificationsHandler();

		if (boolean) {
			setIsSubmitingAccept(false);
		} else {
			setIsSubmitingDecline(false);
		}
	};

	return (
		<CustomModal closeModal={closeModal}>
			<Flex flexDir={'column'} mt='10px'>
				<Text fontWeight='600' fontSize={'32px'} lineHeight={'48px'}>
					Invitation to B.A.P.
				</Text>

				<Text w='100%' mt='24px' fontWeight={'400'}>
					<strong style={{ fontWeight: '500' }}>
						{senderFirstName} {senderLastName}
					</strong>
					invited you to join
					<strong style={{ fontWeight: '500' }}>{bapName} </strong>
					B.A.P.
				</Text>

				<Flex alignItems='center' mt='24px'>
					<Image src={`${bapSrc}`} w='120px' alt='B.A.P. logo' />
					<Flex flexDir='column' ml='16px'>
						<Text fontWeight={'500'} fontSize={'18px'}>
							{bapName}
						</Text>
					</Flex>
				</Flex>

				<Flex alignSelf={'end'} mt='24px'>
					<CustomButton onClickHandler={() => inviteHandler(true)} isSubmiting={isSubmitingAccept}>
						Approve
					</CustomButton>
					<CustomButton
						onClickHandler={() => inviteHandler(false)}
						isSubmiting={isSubmitingDecline}
						styles='light'
						ml='16px'
					>
						Deny
					</CustomButton>
				</Flex>
			</Flex>
		</CustomModal>
	);
};

export default InviteBapModal;
