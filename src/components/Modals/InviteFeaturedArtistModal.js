import { Flex, Heading, Image, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import checkNotifications from 'src/functions/serverRequests/notifications/checkNotifications';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomModal from '@/components/Modals/CustomModal';

const InviteFeaturedArtistModal = ({ notification, closeModal, getNotificationsHandler }) => {
	const { senderFirstName, senderLastName, bapName, token, bapSrc, typeNotificationId } =
		notification;

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
			if (resData?.notification?.isAccept) {
				getToast(
					'success',
					'Success',
					'You have successfully accepted the invitation to the track as a featured artist.',
				);
			}

			if (!resData?.notification?.isAccept) {
				getToast(
					'success',
					'Success',
					'You have successfully declined the invitation to the track as a featured artist.',
				);
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
				<Heading as='h3' fontWeight='600' fontSize='32px' color='black'>
					Invitation to the track
				</Heading>

				<Text mt='10px' fontSize='16px' color='black'>
					<Text as='span' fontWeight='500'>
						{senderFirstName} {senderLastName}&nbsp;
					</Text>
					<Text as='span' fontWeight='400'>
						invited you as a featured artist
					</Text>
				</Text>

				<Flex alignItems='center' mt='24px'>
					<Image src={bapSrc} w='120px' alt='B.A.P. logo' />
					<Flex flexDir='column' ml='16px'>
						<Text fontWeight='500' fontSize='18px' color='black'>
							{bapName}
						</Text>
					</Flex>
				</Flex>

				<Flex alignSelf='end' mt='24px'>
					<CustomButton
						onClickHandler={() => {
							inviteHandler(true);
						}}
						isSubmiting={isSubmitingAccept}
					>
						Approve
					</CustomButton>
					<CustomButton
						onClickHandler={() => {
							inviteHandler(false);
						}}
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

export default InviteFeaturedArtistModal;
