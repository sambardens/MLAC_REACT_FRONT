import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import debounce from 'lodash.debounce';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getMajorUsers from 'src/functions/serverRequests/user/getMajorUsers';

import CustomInput from '@/components/CustomInputs/CustomInput';

import SearchIcon from '@/assets/icons/base/search.svg';

import UserCard from '../../Releases/UserCard/UserCard';
import InviteForm from '../InviteForm/InviteForm';

const SearchWriters = ({
	addAnotherUserToAgreement,
	isShowInvite,
	setIsShowInvite,
	searchValue,
	setSearchValue,
	searchList,
	setSearchList,
	setNewUserToInviteToBap,
	allUsers,
}) => {
	const [email, setEmail] = useState('');
	const [isEmailError, setIsEmailError] = useState(true);
	const axiosPrivate = useAxiosPrivate();
	const debounceSearch = useRef(
		debounce(async inputValue => {
			const users = await getMajorUsers({ input: inputValue, type: 'email', axiosPrivate });
			const filteredUsers = users.filter(el => el.email === inputValue);
			console.log('filteredUsers: ', filteredUsers);
			const updatedUsers = filteredUsers?.map(user => {
				const isDuplicate = Boolean(allUsers.find(el => el.email === user.email));
				return { ...user, isDuplicate };
			});

			if (updatedUsers?.length > 0) {
				setSearchList(updatedUsers);
				setIsShowInvite(false);
			} else {
				setSearchList([]);
				setIsShowInvite(true);
			}
		}, 500),
	).current;

	const handleChange = e => {
		const { value } = e.target;
		setSearchValue(value);
		setEmail(value);
		if (value) {
			debounceSearch(value);
		} else {
			setIsShowInvite(false);
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
				setSearchList([]);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box mb='16px'>
			<Box mb='16px'>
				<Heading color='black' fontSize='18px' fontWeight='500' mb='4px'>
					Search existing Major Labl Artist Club users
				</Heading>
				<Text color='secondary' fontSize='16px' fontWeight='400'>
					Start typing the user&apos;s email, if there is no such user on Major Labl, you can send them
					an invitation
				</Text>
			</Box>
			<CustomInput
				name='searchValue'
				icon={SearchIcon}
				mr='10px'
				placeholder='Search'
				value={searchValue}
				onChange={handleChange}
			/>
			{searchValue && searchList?.length > 0 && (
				<Box mt='16px' ref={popupRef}>
					<Heading color='secondary' fontSize='18px' fontWeight='500' mb='16px'>
						Search result
					</Heading>
					<Flex as='ul' flexDir='column' gap='4px' maxH='428px' overflowY='auto'>
						{searchList.map(el => (
							<UserCard
								key={el.id}
								onSelect={() => {
									addAnotherUserToAgreement(el);
								}}
								user={el}
							/>
						))}
					</Flex>
				</Box>
			)}
			{isShowInvite && searchValue && (
				<Box mt='16px'>
					<Heading color='secondary' fontSize='18px' fontWeight='500' mb='16px'>
						Search result
					</Heading>
					<InviteForm
						setEmail={setEmail}
						addAnotherUserToAgreement={addAnotherUserToAgreement}
						email={email}
						setIsShowInvite={setIsShowInvite}
						setSearchValue={setSearchValue}
						setNewUserToInviteToBap={setNewUserToInviteToBap}
						allUsers={allUsers}
					/>
				</Box>
			)}
		</Box>
	);
};

export default SearchWriters;
