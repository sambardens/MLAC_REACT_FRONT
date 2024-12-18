import { Box, Flex, Image, Text } from '@chakra-ui/react';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import acceptInvite from 'src/functions/serverRequests/InvitationsNew/acceptInvite';
import getBapsRequest from 'src/functions/serverRequests/bap/getBapsRequest';
import getImageSrc from 'src/functions/utils/getImageSrc';
import { setBaps } from 'store/slice';

import CustomButton from '../CustomButton';

const InviteCard = ({ notification, closeModal, getNotificationsHandler }) => {
	const { senderFirstName, senderLastName, bapName, token, bapSrc } = notification;
	const axiosPrivate = useAxiosPrivate();
	const dispatch = useDispatch();
	const [isSubmitingAccept, setIsSubmitingAccept] = useState(false);
	const [isSubmitingDecline, setIsSubmitingDecline] = useState(false);

	const inviteHandler = async boolean => {
		if (boolean) {
			setIsSubmitingAccept(true);
		} else {
			setIsSubmitingDecline(true);
		}
		const isAccept = await acceptInvite(token, boolean);

		if (isAccept) {
			const bapsFromServer = await getBapsRequest(axiosPrivate);

			const bapsWithImages = bapsFromServer.map(bap => ({
				...bap,
				src: getImageSrc(bap.bapAvatar),
				srcMin: getImageSrc(bap.thumbnail, false),
			}));

			dispatch(setBaps(bapsWithImages));
		}

		getNotificationsHandler();
		if (boolean) {
			setIsSubmitingAccept(false);
		} else {
			setIsSubmitingDecline(false);
		}
	};

	return (
		<Flex mt='10px' alignItems={'center'}>
			<Image src={`${bapSrc}`} w='75px' h='75px' alt='B.A.P. logo' />
			<Flex flexDir='column' ml='10px'>
				<Text>
					{`${senderFirstName} ${senderLastName} has invited you to join ${bapName} B.A.P. on Major Labl Artist Club.`}
				</Text>

				{/* <Text mb='10px'>
        `Role: ${notification.role}`
        </Text> */}

				<Flex justifyContent={'space-between'} mt='10px'>
					<Box onClick={() => inviteHandler(false)}>
						<CustomButton isSubmiting={isSubmitingDecline}>Decline</CustomButton>
					</Box>
					<Box onClick={() => inviteHandler(true)}>
						<CustomButton isSubmiting={isSubmitingAccept}>Accept</CustomButton>
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default InviteCard;
