import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Icon,
	Switch,
	Text,
	useToast,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import filterUsers from 'src/functions/utils/mailing-list/filterUsers';
import getCSVContent from 'src/functions/utils/mailing-list/getCSVContent';
import { numberCorrectEnding } from 'src/functions/utils/numberCorrectEnding';
import { getMailListById, removeSubscribe } from 'store/operations';

import DeleteIcon from '@/assets/icons/all/delete.svg';
import DownloadIcon from '@/assets/icons/base/download.svg';
import SearchIcon from '@/assets/icons/base/search.svg';

import CustomButton from '../Buttons/CustomButton';
import CustomInput from '../CustomInputs/CustomInput';
import DeleteModal from '../Modals/DeleteModal';

import { SortedComponent } from './components/SortedComponent';
import UserCard from './components/UserCard';

const MailingList = () => {
	const [allUsers, setAllUsers] = useState([]);
	const [query, setQuery] = useState('');
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [isLoadingDelete, setIsLoadingDelete] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [sorted, setSorted] = useState({ byLastName: false, byEmail: false, byDate: false });
	const selectedBap = useSelector(state => state.user.selectedBap);
	const mailList = useSelector(state => state.user.selectedBap.mailList);
	const isLoading = useSelector(state => state.user.isLoading);
	const toast = useToast();
	const dispatch = useDispatch();

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
	useEffect(() => {
		if (selectedBap?.bapId) {
			dispatch(getMailListById(selectedBap.bapId));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap?.bapId]);

	const handleUsersFilter = () => {
		const filteredUsersByQuery = filterUsers(allUsers, query);
		setFilteredUsers(filteredUsersByQuery);
	};

	useEffect(() => {
		if (mailList) {
			const usersWithIsSelected = mailList.map(user => {
				return { ...user, isSelected: false };
			});
			setAllUsers(usersWithIsSelected);
			setFilteredUsers(usersWithIsSelected);
		}
	}, [mailList]);

	useEffect(() => {
		handleUsersFilter();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query, allUsers]);

	const downloadHanlder = () => {
		const csvContent = getCSVContent(filteredUsers);
		if (!csvContent) {
			getToast('error', 'Error', 'Please choose at list one user to download');
			return;
		}

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', 'customers.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const selectAllHandler = () => {
		let selectedUsers;
		if (filteredUsers.some(u => !u.isSelected)) {
			selectedUsers = filteredUsers.map(u => {
				return { ...u, isSelected: true };
			});
		} else {
			selectedUsers = filteredUsers.map(u => {
				return { ...u, isSelected: false };
			});
		}
		setFilteredUsers(selectedUsers);
	};

	const countSelectedObjects = array => {
		let count = 0;
		for (const obj of array) {
			if (obj.isSelected === true) {
				count++;
			}
		}
		return count;
	};

	const hasSelectedUsers = () => {
		return filteredUsers.some(item => item.isSelected === true);
	};

	const onDeleteMailFromList = () => {
		if (hasSelectedUsers()) {
			setIsLoadingDelete(true);
			filteredUsers.map(async item => {
				if (item.isSelected === true) {
					const options = { userId: item.userId, bapId: item.bapId };
					const res = await dispatch(removeSubscribe(options));
					if (res?.payload?.success) {
						setIsLoadingDelete(false);
						setIsOpenDeleteModal(false);
					} else {
						getToast('error', 'Error', 'Something went wrong. Please try again');
					}
				}
			});
		} else {
			getToast('error', 'Error', 'Please choose user to remove');
		}
	};

	return (
		<Flex flexDir='column' h='100%' pos='relative'>
			{isOpenDeleteModal && (
				<DeleteModal
					closeModal={() => {
						setIsOpenDeleteModal(false);
					}}
					deleteHandler={onDeleteMailFromList}
					title={`Unsubscribe ${numberCorrectEnding(countSelectedObjects(filteredUsers), [
						'user',
						'users',
					])}`}
					text={`Are you sure you want to unsubscribe ${countSelectedObjects(
						filteredUsers,
					)} ${numberCorrectEnding(countSelectedObjects(filteredUsers), ['user', 'users'])} `}
					isLoadingDelete={isLoadingDelete}
				/>
			)}
			<Flex justifyContent={'space-between'}>
				<CustomInput
					name='searchValue'
					icon={SearchIcon}
					maxW='350px'
					mr='10px'
					placeholder='Search'
					value={query}
					onChange={e => setQuery(e.target.value)}
				/>
				<Flex alignItems={'center'} gap={'10px'}>
					{hasSelectedUsers() ? (
						<CustomButton onClickHandler={() => setIsOpenDeleteModal(true)} w='200px'>
							<Text ml='8px'>
								Unsubscribe ({countSelectedObjects(filteredUsers)}{' '}
								{numberCorrectEnding(countSelectedObjects(filteredUsers), ['user', 'users'])})
							</Text>
						</CustomButton>
					) : null}

					{filteredUsers?.length !== 0 && !isLoading ? (
						<CustomButton onClickHandler={downloadHanlder} w='175px'>
							<Icon w='24px' h='24px' as={DownloadIcon} color='white' />
							<Text ml='8px'>Download CSV</Text>
						</CustomButton>
					) : null}
				</Flex>
			</Flex>
			{filteredUsers?.length !== 0 && !isLoading ? (
				<Flex alignItems={'center'} mt='12px'>
					<Button onClick={() => selectAllHandler()} pr={'50px'}>
						Select all
					</Button>
					<SortedComponent
						mailList={mailList}
						setFilteredUsers={setFilteredUsers}
						filteredUsers={filteredUsers}
					/>
				</Flex>
			) : null}
			{filteredUsers?.length !== 0 && !isLoading ? (
				<Flex flexDir={'column'} gap='2px' mt='6px'>
					{filteredUsers.map(user => (
						<Box key={user.id}>
							<UserCard user={user} setFilteredUsers={setFilteredUsers} filteredUsers={filteredUsers} />
						</Box>
					))}
				</Flex>
			) : (
				<Text
					fontSize={'18px'}
					fontWeight='600'
					position={'absolute'}
					top='50%'
					right='50%'
					transform={'translate(50%, -50%)'}
				>
					You don&apos;t have any subscribers in this B.A.P.
				</Text>
			)}
		</Flex>
	);
};

export default MailingList;
