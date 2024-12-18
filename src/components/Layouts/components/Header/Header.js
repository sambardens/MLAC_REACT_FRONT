import { useRouter } from 'next/router';

import { Box, Flex, IconButton, Image, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getAllNotReviewedNotifications from 'src/functions/serverRequests/notifications/getAllNotReviewedNotifications';
import { getCurrentMenuName } from 'src/functions/utils/getCurrentMenuName';
import getFormattedDate from 'src/functions/utils/getFormattedDate';
import getImageSrc from 'src/functions/utils/getImageSrc';
import { resetAudio } from 'store/audio/audio-slice';

import VerificateEmailModal from '@/components/Auth/VerificateEmailModal/VerificateEmailModal';
import UserProfile from '@/components/Modals/UserProfileModal';

import NotificationIcon from '@/assets/icons/base/notification.svg';

import DropdownMenu from './components/DropdownMenu';
import NotificationsMenu from './components/NotificationsMenu';

const Header = ({ isDownloadPage = false, setIsUserProfileModal, isUserProfileModal }) => {
	const { pathname, back } = useRouter();
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();
	const currentMenuName = getCurrentMenuName(pathname, isUserProfileModal);
	const [isVerificateEmailModal, setIsVerificateEmailModal] = useState(false);
	const [notifications, setNotifications] = useState([]);

	const [isNotificationsMenu, setIsNotificationsMenu] = useState(false);

	const getNotificationsHandler = async () => {
		const notificationsFromServer = await getAllNotReviewedNotifications(axiosPrivate);
		const promises = notificationsFromServer?.map(not => {
			const preparedNot = {
				...not,
				bapSrc: getImageSrc(not.bapAvatar),
				formattedDate: getFormattedDate(not.createdAt, true),
			};
			return preparedNot;
		});

		if (promises) {
			const preparedNots = await Promise.all(promises);
			setNotifications([...preparedNots].reverse());
		}
	};

	useEffect(() => {
		!isDownloadPage && getNotificationsHandler();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleNotifications = () => {
		setIsNotificationsMenu(!isNotificationsMenu);
	};

	const handleLogoClick = () => {
		dispatch(resetAudio());
		back();
	};
	return (
		<Box
			position={'relative'}
			pl={!isDownloadPage ? '4px' : '0'}
			bgColor={isDownloadPage ? 'bg.main' : 'bg.secondary'}
		>
			<Flex
				justifyContent={'space-between'}
				alignItems={'center'}
				p={!isDownloadPage ? '8px 104px 8px 36px' : '8px 16px'}
				w='100%'
				h='80px'
				bgColor='bg.main'
				borderBottomLeftRadius='4px'
			>
				{isDownloadPage && (
					<Image
						src='/assets/images/logo-primary.png'
						w='100px'
						h='56px'
						alt='Major Labl Artist Club logo'
						onClick={handleLogoClick}
						cursor={'pointer'}
					/>
				)}

				<Text fontSize='18px' fontWeight='600' color='black'>
					{currentMenuName}
				</Text>

				<Flex alignItems={'center'}>
					{!isDownloadPage && (
						<IconButton
							boxSize='40px'
							icon={<NotificationIcon />}
							onClick={toggleNotifications}
							bgColor={notifications.length ? 'bg.pink' : 'white'}
							aria-label={`${isNotificationsMenu ? 'Close' : 'Open'} notifications`}
							color={notifications.length ? 'accent' : 'secondary'}
							borderRadius='50%'
						/>
					)}

					<Box position={'absolute'} zIndex={'2'} top='8px' right='16px'>
						<DropdownMenu
							openProfile={() => {
								setIsUserProfileModal(true);
							}}
						/>
					</Box>
				</Flex>
			</Flex>

			{isNotificationsMenu && (
				<NotificationsMenu
					getNotificationsHandler={getNotificationsHandler}
					notifications={notifications}
					closeMenu={() => {
						setIsNotificationsMenu(false);
					}}
				/>
			)}
			{isUserProfileModal && (
				<UserProfile
					closeModal={() => {
						setIsUserProfileModal(false);
					}}
					setIsVerificateEmailModal={setIsVerificateEmailModal}
				/>
			)}
			{isVerificateEmailModal && <VerificateEmailModal setIsModal={setIsVerificateEmailModal} />}
		</Box>
	);
};

export default Header;
