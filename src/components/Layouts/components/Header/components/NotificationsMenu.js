import { Box, Flex, Icon, IconButton, Text } from '@chakra-ui/react';

import { useRef } from 'react';
import { useEffect } from 'react';

import CloseIcon from '@/assets/icons/base/close.svg';
import notificationIcon from '@/assets/icons/base/notification.svg';

import NotCard from './NotCard';

const NotificationsMenu = ({ getNotificationsHandler, notifications, closeMenu }) => {
	const menuRef = useRef(null);

	useEffect(() => {
		const handleOutsideClick = e => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				// closeMenu();
			}
		};
		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, []);

	return (
		<Flex
			ref={menuRef}
			position={'absolute'}
			bottom='0'
			right='0'
			transform='translateY(100%)'
			zIndex={'1'}
			flexDir={'column'}
			p='16px 0px 8px'
			w='371px'
			h='calc(100vh - 80px)'
			overflow={'auto'}
			bgColor={'white'}
			boxShadow='0px 4px 7px rgba(136, 136, 136, 0.1)'
		>
			<Flex
				justifyContent={'space-between'}
				alignItems={'center'}
				p='20px'
				borderBottom={'1px solid'}
				borderColor={'stroke'}
			>
				<Flex>
					<Icon as={notificationIcon} boxSize='24px' color='secondary' />
					<Text ml='12px' fontSize={'18px'} fontWeight='500'>
						Notifications ({notifications?.length})
					</Text>
				</Flex>
				<IconButton
					onClick={closeMenu}
					icon={<CloseIcon />}
					boxSize='24px'
					color='secondary'
					_hover={{ color: 'accent' }}
					transition='0.3s linear'
					size='xs'
				/>
			</Flex>

			<Flex flexDir={'column'}>
				{notifications.map(not => (
					<Box key={not.id}>
						<NotCard not={not} getNotificationsHandler={getNotificationsHandler} />
					</Box>
				))}
			</Flex>
		</Flex>
	);
};

export default NotificationsMenu;
