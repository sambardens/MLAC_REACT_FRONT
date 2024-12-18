import { useRouter } from 'next/router';

import { Flex, Icon, Text, useToast } from '@chakra-ui/react';

import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import BrandUnderline from '@/components/Underlines/BrandUnderline';

const NavMenuItem = ({
	menuName,
	icon,
	title,
	setIsStartPage,
	setIsUserProfileModal,
	isUserProfileModal,
}) => {
	const { push, pathname } = useRouter();
	const { selectedBapUpdated, selectedBap } = useSelector(state => state.user);
	const toast = useToast();

	const myInfoPage =
		pathname?.startsWith('/my-splits-contracts') || pathname?.startsWith('/my-income');

	const getSelectStatus = useCallback(() => {
		if (menuName === '/my-profile' && isUserProfileModal) {
			return true;
		} else if (menuName !== '/my-profile' && isUserProfileModal) {
			return false;
		} else if (pathname.includes(menuName)) {
			return true;
		} else {
			return false;
		}
	}, [isUserProfileModal, menuName, pathname]);

	const getAvalaibleStatus = useCallback(() => {
		if (!myInfoPage && selectedBap.bapId) {
			return menuName === 'bap-info' || !selectedBap.isNew;
		}
		return menuName.includes('/my-');
	}, [menuName, myInfoPage, selectedBap.bapId, selectedBap.isNew]);

	const isSelected = getSelectStatus();
	const isAvailable = getAvalaibleStatus();
	const color = isSelected ? 'accent' : 'secondary';
	const cursor = isAvailable ? 'pointer' : 'not-allowed';

	const handleSelect = () => {
		if (!isAvailable) return;
		if (selectedBapUpdated?.isEdited) {
			toast({
				position: 'top',
				title: 'Attention',
				description:
					'You have unsaved data in the bap edit menu. Please press the Save or Cancel button before moving to another menu',
				status: 'info',
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		if (menuName === '/my-profile') {
			setIsUserProfileModal(true);
			return;
		}
		if (menuName === '/releases' && setIsStartPage) {
			setIsStartPage(true);
		}

		if (menuName.includes('/my-')) {
			push(menuName);
		} else {
			push({
				pathname: `/bap/[bapId]${menuName}`,
				query: { bapId: selectedBap.bapId },
			});
		}
	};
	return (
		<Flex onClick={handleSelect} as='button' flexDir='column' cursor={cursor}>
			<Flex
				pt='16px'
				pb='12px'
				px='12px'
				color={color}
				w='100%'
				align='center'
				hover={isAvailable ? { color: 'accent' } : {}}
				transition='0.2s linear'
			>
				<Icon as={icon} boxSize='24px' mr='12px' />
				<Text fontSize='14px' fontWeight='400'>
					{title}
				</Text>
			</Flex>
			<BrandUnderline isSelected={isSelected} />
		</Flex>
	);
};

export default NavMenuItem;
