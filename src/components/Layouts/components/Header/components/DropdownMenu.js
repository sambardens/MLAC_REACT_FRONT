import { useRouter } from 'next/router';

import { Menu, MenuButton, MenuList, useToast } from '@chakra-ui/react';

import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from 'store/auth/auth-operations';

import UserAvatar from '@/components/User/UserAvatar';

import ContractIcon from '@/assets/icons/dropdown-menu/contract.svg';
import DownloadIcon from '@/assets/icons/dropdown-menu/download.svg';
import IncomeIcon from '@/assets/icons/dropdown-menu/income.svg';
import LogoutIcon from '@/assets/icons/dropdown-menu/logout.svg';
import ProfileIcon from '@/assets/icons/dropdown-menu/profile.svg';

import DropdownMenuItem from './DropdonwMenuItem';

function DropdownMenu({ openProfile }) {
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const { user } = useSelector(state => state.user);
	const { refreshToken } = useSelector(state => state.auth);
	const router = useRouter();
	const { data: session } = useSession();
	const selectedBapUpdated = useSelector(state => state.user.selectedBapUpdated);
	const toast = useToast();
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
	const handleMenuClose = () => {
		setIsOpen(false);
	};

	const handleLogout = async () => {
		if (selectedBapUpdated?.isEdited) {
			getToast(
				'info',
				'Attention',
				'You have unsaved data in the B.A.P edit menu. Please press the Save or Cancel button before logging out.',
			);
			return;
		}

		if (session) {
			await signOut({ redirect: false }).then(() => {
				dispatch(logOut(refreshToken));
			});
		} else {
			dispatch(logOut(refreshToken));
		}
	};

	const openPage = pageName => {
		if (selectedBapUpdated?.isEdited) {
			getToast(
				'info',
				'Attention',
				'You have unsaved data in the B.A.P edit menu. Please press the Save or Cancel button before logging out.',
			);
			return;
		}
		router.push(pageName);
	};

	return (
		<Menu onClose={handleMenuClose}>
			<MenuButton onClick={() => setIsOpen(!isOpen)} overflow='hidden'>
				<UserAvatar user={user} />
			</MenuButton>
			<MenuList
				boxShadow='0px 4px 7px 5px rgba(136, 136, 136, 0.1)'
				border='none'
				borderRadius='6px'
				overflow='hidden'
				p='0'
			>
				<DropdownMenuItem
					onClick={openProfile}
					title='My profile'
					icon={ProfileIcon}
					borderBottomColor='stroke'
				/>
				<DropdownMenuItem
					onClick={() => openPage('/my-splits-contracts')}
					title='My splits & contracts'
					icon={ContractIcon}
				/>
				<DropdownMenuItem onClick={() => openPage('/my-income')} title='My income' icon={IncomeIcon} />
				<DropdownMenuItem
					onClick={() => openPage('/my-downloads')}
					title='My music'
					icon={DownloadIcon}
				/>
				<DropdownMenuItem
					onClick={handleLogout}
					title='Log Out'
					icon={LogoutIcon}
					iconColor='accent'
					borderTopColor='stroke'
				/>
			</MenuList>
		</Menu>
	);
}

export default DropdownMenu;
