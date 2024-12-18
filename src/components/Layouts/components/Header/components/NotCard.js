import { Flex, Heading, Icon, IconButton, Image, Text } from '@chakra-ui/react';

import { useState } from 'react';
import checkNotifications from 'src/functions/serverRequests/notifications/checkNotifications';

import RingLoader from '@/components/Loaders/RingLoader';
import InviteBapModal from '@/components/Modals/InviteBapModal';
import InviteFeaturedArtistModal from '@/components/Modals/InviteFeaturedArtistModal';

import CloseIcon from '@/assets/icons/base/close.svg';

const NotCard = ({ getNotificationsHandler, not }) => {
	const [isInviteBapModal, setIsInviteBapModal] = useState(false);
	const [isInviteFeatureArtistModal, setIsInviteFeatureArtistModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const removeNotification = async () => {
		setIsLoading(true);
		const formData = new FormData();
		formData.append('typeNotificationId', not.typeNotificationId);
		const res = await checkNotifications(formData, not.token);

		if (res.success) {
			getNotificationsHandler();
		}

		setIsLoading(false);
	};

	return (
		<>
			{isInviteBapModal && (
				<InviteBapModal
					getNotificationsHandler={getNotificationsHandler}
					notification={not}
					closeModal={() => setIsInviteBapModal(false)}
				/>
			)}

			{isInviteFeatureArtistModal && (
				<InviteFeaturedArtistModal
					getNotificationsHandler={getNotificationsHandler}
					notification={not}
					closeModal={() => {
						setIsInviteFeatureArtistModal(false);
					}}
				/>
			)}

			{not.typeNotificationId === 1 && (
				<Flex
					onClick={() => setIsInviteBapModal(true)}
					flexDir={'column'}
					p='10px 20px'
					cursor={'pointer'}
					borderBottom={'1px solid'}
					borderColor={'stroke'}
				>
					<Flex justifyContent={'space-between'}>
						<Flex>
							<Image src={not.bapSrc} w='24px' h='24px' alt='B.A.P. logo' />
							<Heading as='h3' ml='8px' fontSize={'16px'} fontWeight={'500'}>
								Major Labl
							</Heading>
						</Flex>

						{/* <IconButton
								onClick={removeNotification}
								icon={<CloseIcon />}
								boxSize='24px'
								color='secondary'
								_hover={{ color: 'accent' }}
								transition='0.3s linear'
							/> */}
					</Flex>

					<Text mt='10px' fontSize='14px' color='black'>
						<Text as='span' fontWeight='500'>
							{not.senderFirstName} {not.senderLastName} &nbsp;
						</Text>
						<Text as='span' fontWeight='400'>
							invited you to the B.A.P.&nbsp;
						</Text>
						<Text as='span' fontWeight='500'>
							{not.bapName}
						</Text>
					</Text>
					<Text mt='10px' fontWeight='400' fontSize={'12px'} color='secondary'>
						{not.formattedDate}
					</Text>
				</Flex>
			)}

			{not.typeNotificationId === 3 && (
				<Flex
					onClick={() => setIsInviteFeatureArtistModal(!isInviteFeatureArtistModal)}
					flexDir={'column'}
					p='10px 20px'
					borderBottom={'1px solid'}
					borderColor={'stroke'}
					cursor={'pointer'}
				>
					<Flex justifyContent={'space-between'}>
						<Flex>
							<Image src={not.bapSrc} w='24px' h='24px' alt='B.A.P. logo' />
							<Heading as='h3' ml='8px' fontSize={'16px'} fontWeight={'500'}>
								Major Labl
							</Heading>
						</Flex>
						{!isLoading ? (
							<IconButton
								onClick={removeNotification}
								icon={<CloseIcon />}
								boxSize='24px'
								color='secondary'
								_hover={{ color: 'accent' }}
								transition='0.3s linear'
								size='xs'
							/>
						) : (
							<RingLoader w='24px' h='24px' />
						)}
					</Flex>

					<Text mt='10px' fontSize='14px' color='black'>
						<Text as='span' fontWeight='500'>
							{not.senderFirstName} {not.senderLastName} &nbsp;
						</Text>
						<Text as='span' fontWeight='400'>
							added you to the track as featured artist.
						</Text>
					</Text>

					<Text mt='10px' fontWeight='400' fontSize={'12px'} color='secondary'>
						{not.formattedDate}
					</Text>
				</Flex>
			)}

			{(not.typeNotificationId === 4 || not.typeNotificationId === 5) && (
				<Flex flexDir={'column'} p='10px 20px' borderBottom={'1px solid red'} borderColor={'stroke'}>
					<Flex justifyContent={'space-between'}>
						<Flex>
							<Image src={not.bapSrc} w='24px' h='24px' alt='B.A.P. logo' />
							<Heading as='h3' ml='8px' fontSize={'16px'} fontWeight={'500'}>
								Major Labl
							</Heading>
						</Flex>
						{!isLoading ? (
							<IconButton
								onClick={removeNotification}
								icon={<CloseIcon />}
								boxSize='24px'
								color='secondary'
								_hover={{ color: 'accent' }}
								transition='0.3s linear'
								size='xs'
							/>
						) : (
							<RingLoader w='24px' h='24px' />
						)}
					</Flex>

					<Text mt='10px' color='black' fontSize='14px'>
						{not.typeNotificationId === 5 ? (
							'The contract has been signed by all authors and become active'
						) : (
							<>
								<Text as='span' fontWeight='500'>
									{not.senderFirstName} {not.senderLastName} &nbsp;
								</Text>
								<Text as='span' fontWeight='400'>
									{not.content
										? `disagree with the terms of the contract. And send you next dispute message: ${not.content}`
										: 'added you to the contract, read the contents and sign it.'}
								</Text>
							</>
						)}
					</Text>
					<Text mt='10px' fontWeight='400' fontSize={'12px'} color='secondary'>
						{not.formattedDate}
					</Text>
				</Flex>
			)}
		</>
	);
};

export default NotCard;
