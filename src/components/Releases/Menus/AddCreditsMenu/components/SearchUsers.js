import { Box, Flex, Heading, Text, useToast } from '@chakra-ui/react';

import debounce from 'lodash.debounce';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getMajorUsers from 'src/functions/serverRequests/user/getMajorUsers';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';

import SearchIcon from '@/assets/icons/base/search.svg';

import UserCardCredits from './UserCardCredits';

const options = [
	{ id: 11, value: 'name', label: 'by name' },
	{ id: 12, value: 'email', label: 'by email' },
];

const SearchUsers = ({
	addUserToTrack,
	searchValue,
	setSearchValue,
	searchList,
	setSearchList,
	allUsers,
	unregisteredUsersArr,
}) => {
	const toast = useToast();
	const axiosPrivate = useAxiosPrivate();
	const [searchCompleted, setSearchCompleted] = useState(false);
	const [name, setName] = useState('');
	const [type, setType] = useState('name');

	const debounceSearch = useRef(
		debounce(async (inputValue, type) => {
			const users = await getMajorUsers({ input: inputValue, type, axiosPrivate });
			const filteredUsers = users.filter(el => el.email === inputValue);
			const updatedUsers = filteredUsers?.map(user => {
				const isDuplicate = Boolean(allUsers.find(el => el.email === user.email));
				return { ...user, isDuplicate, userId: user.id };
			});

			if (updatedUsers?.length > 0) {
				setSearchList(updatedUsers);
				setName('');
			} else {
				setSearchList([]);
				if (type === 'name') {
					setName(inputValue);
				}
			}
			setSearchCompleted(true);
		}, 500),
	).current;

	const handleSearch = e => {
		const { value } = e.target;
		setSearchValue(value);
		if (value) {
			debounceSearch(value, type);
		} else {
			setSearchCompleted(false);
		}
	};

	useEffect(() => {
		return () => {
			debounceSearch.cancel();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const popupRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = e => {
			if (popupRef.current && !popupRef.current.contains(e.target)) {
				setSearchValue('');
				setSearchCompleted(false);
				setSearchList([]);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleClear = () => {
		setSearchValue('');
		setName('');
		setSearchList([]);
		setSearchCompleted(false);
	};

	const addUnregisteredUserToTrack = () => {
		const isDuplicate = unregisteredUsersArr.find(el => el.name === name);
		if (isDuplicate) {
			toast({
				position: 'top',
				title: 'You have already user with same name',
				status: 'info',
				duration: 5000,
				isClosable: true,
			});
			return;
		}
		addUserToTrack({ user: { name }, isNew: true, isRegistered: false });
		handleClear();
	};

	const handleSelectType = ({ value }) => {
		setType(value);
		handleClear();
	};
	return (
		<Box mb='16px'>
			<Box mb='12px'>
				<Text color='black' fontSize='16px' fontWeight='400' mb='4px' pl='12px'>
					Search existing Major Labl Artist Club users
				</Text>
				<Flex gap='12px' align='flex-end'>
					<CustomInput
						name='search'
						icon={SearchIcon}
						placeholder='Search'
						value={searchValue}
						onChange={handleSearch}
					/>
					<CustomSelect
						options={options}
						name='type'
						value={type}
						placeholder=''
						onChange={handleSelectType}
						w={'150px'}
					/>
				</Flex>

				{searchValue && searchCompleted && (
					<Box mt='16px' ref={popupRef}>
						<Heading color='secondary' fontSize='16px' fontWeight='500' mb='12px' pl='12px'>
							Search result
						</Heading>
						{searchList?.length > 0 ? (
							<Flex as='ul' flexDir='column' gap='4px' maxH='428px' overflowY='auto'>
								{searchList.map(el => (
									<UserCardCredits
										key={el.id}
										onSelect={() => {
											addUserToTrack({ user: el, isNew: true, isRegistered: true });
										}}
										user={el}
									/>
								))}
							</Flex>
						) : (
							<Text color='secondary' fontSize='14px' fontWeight='400' pl='12px'>
								The user with this {type} is not registered. You can add manually
							</Text>
						)}
					</Box>
				)}
			</Box>
			<Flex align='flex-end' gap='12px'>
				<CustomInput
					label='Add user manually'
					name='name'
					placeholder='Type name here...'
					value={name}
					onChange={e => {
						setName(e.target.value);
					}}
				/>
				<CustomButton
					onClickHandler={addUnregisteredUserToTrack}
					minW='150px'
					styles={name ? 'main' : 'disabled'}
				>
					Add
				</CustomButton>
			</Flex>
		</Box>
	);
};

export default SearchUsers;
