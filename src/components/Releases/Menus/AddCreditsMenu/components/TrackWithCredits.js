import { Box, Flex, IconButton, Text } from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getUserName from 'src/functions/utils/getUserName';
import { addCredit } from 'store/operations';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';

import options from '@/assets/credits.json';
import CloseIcon from '@/assets/icons/base/close.svg';

import ListTitleCredits from './ListTitleCredits';
import SearchUsers from './SearchUsers';
import UserCardCredits from './UserCardCredits';

const TrackWithCredits = ({ track, n, totalTracks }) => {
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();
	const { bapMembers } = useSelector(state => state.user.selectedBap);
	const [searchList, setSearchList] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [showAllMembers, setShowAllMembers] = useState(false);

	// -------------------------- USERS LIST ----------------------------
	const [members, setMembers] = useState([]);
	const [composers, setComposers] = useState([]);
	const [unregisteredUsersArr, setUnregisteredUsersArr] = useState([]);
	const [usersArr, setUsersArr] = useState([]);

	// -----------------------------CREDITS -------------------------
	const [auddCredits, setAuddCredits] = useState({});
	const [userCredits, setUserCredits] = useState({});
	const [unregisteredUsersCredits, setUnregisteredUsersCredits] = useState({});

	const { selectedRelease } = useSelector(state => state.user);

	const handleSelect = async (selectedCredits, user) => {
		const userId = user.userId;
		const trackId = track.trackId;
		let credits = [];
		if (userCredits[userId]?.length < selectedCredits.length) {
			const selectedOption = selectedCredits.find(credit => {
				return !userCredits[userId].some(el => {
					return el.id === credit.id;
				});
			});
			credits = [...userCredits[userId], selectedOption];
			const newCredits = { ...userCredits, [userId]: credits };
			setUserCredits(newCredits);
		} else {
			const selectedOption = userCredits[userId]?.find(
				credit => !selectedCredits.some(el => el.id === credit.id),
			);
			credits = userCredits[userId].filter(el => el.id !== selectedOption.id);
			const newCredits = { ...userCredits, [userId]: credits };
			setUserCredits(newCredits);
		}
		const creditIds = credits.map(el => el.value);
		dispatch(
			addCredit({
				creditData: {
					creditIds,
					trackId,
					userId,
				},
				userData: {
					userId,
					firstName: user.firstName,
					lastName: user?.lastName || '',
					email: user?.email,
				},
				axiosPrivate,
			}),
		);
	};

	const handleSelectForUnregistered = async (selectedCredits, user) => {
		const name = user.name;
		const trackId = track.trackId;
		let credits = [];
		if (unregisteredUsersCredits[name]?.length < selectedCredits.length) {
			const selectedOption = selectedCredits.find(credit => {
				return !unregisteredUsersCredits[name].some(el => {
					return el.id === credit.id;
				});
			});
			credits = [...unregisteredUsersCredits[name], selectedOption];
			setUnregisteredUsersCredits(prev => ({
				...prev,
				[name]: credits,
			}));
		} else {
			const selectedOption = unregisteredUsersCredits[name]?.find(
				credit => !selectedCredits.some(el => el.id === credit.id),
			);
			credits = unregisteredUsersCredits[name]?.filter(el => el.id !== selectedOption.id);

			setUnregisteredUsersCredits(prev => ({
				...prev,
				[name]: credits,
			}));
		}
		const creditIds = credits.map(el => el.value);
		dispatch(
			addCredit({
				creditData: {
					creditIds,
					trackId,
					name,
				},
				userData: { name },
				axiosPrivate,
			}),
		);
	};

	useEffect(() => {
		// --------------------------- DATABASE CREDITS ----------------------------
		let initialStatetUnregisterdUsers = {};
		let initialStatetRegisterdUsers = {};
		const initialUnregisteredUsers = [];
		const initialRegisteredUsers = [];
		track.splitUsers.forEach(user => {
			initialStatetRegisterdUsers = { ...initialStatetRegisterdUsers, [user.userId]: [] };
			// initialState = { ...initialState, [user.userId]: [...user.credits] };
		});
		if (track.credits?.length > 0) {
			track.credits.forEach(el => {
				const userCredits = [];
				el.creditIds.forEach(id => {
					const newCredit = options.find(option => option.value === id);
					if (newCredit) {
						userCredits.push(newCredit);
					}
				});
				if (el.userId) {
					initialStatetRegisterdUsers = {
						...initialStatetRegisterdUsers,
						[el.userId]: userCredits,
					};
					const isDealUser = track.splitUsers.find(splitUser => splitUser.userId === el.userId);
					if (!isDealUser) {
						initialRegisteredUsers.push(el);
					}
				} else {
					initialStatetUnregisterdUsers = {
						...initialStatetUnregisterdUsers,
						[el.name]: userCredits,
					};
					initialUnregisteredUsers.push(el);
				}
			});
		}

		setUserCredits(initialStatetRegisterdUsers);
		setUnregisteredUsersCredits(initialStatetUnregisterdUsers);
		setUnregisteredUsersArr(initialUnregisteredUsers);
		setUsersArr(initialRegisteredUsers);

		// --------------------------- AUDD CREDITS ----------------------------
		const currentTrack = selectedRelease.checkedTracks.find(el => el.id === track.trackId);
		const composersArr = currentTrack?.composers?.split(', ');
		if (composersArr?.length > 0) {
			let initialStateAdditional = {};
			const composersList = composersArr.map((el, i) => ({ name: el, userId: nanoid() }));
			setComposers(composersList);
			composersList.forEach(user => {
				initialStateAdditional = { ...initialStateAdditional, [user.userId]: 'Composer' };
			});
			setAuddCredits(initialStateAdditional);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const initialMembers = [];
		bapMembers.forEach(member => {
			const isDuplicate = track.splitUsers.find(el => el.userId === member.userId);
			if (!isDuplicate) {
				initialMembers.push(member);
			}
		});
		setMembers(initialMembers);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addUserToTrack = ({ user, isNew = false, isRegistered = true }) => {
		if (isRegistered) {
			setUsersArr(prev => [...prev, user]);
			setUserCredits(prev => ({ ...prev, [user.userId]: [] }));
			if (isNew) {
				setSearchValue('');
				setSearchList([]);
			} else {
				setMembers(prev => prev.filter(el => el.userId !== user.userId));
			}
		} else {
			if (user.name) {
				setUnregisteredUsersArr(prev => [...prev, user]);
				setUnregisteredUsersCredits(prev => ({ ...prev, [user.name]: [] }));
			}
		}
	};

	const removeUserFromTrack = user => {
		setUsersArr(prev => prev.filter(el => el.userId !== user.userId));
		const isMember = bapMembers.find(el => el.userId === user.userId);
		if (isMember) {
			setMembers(prev => [...prev, user]);
		}
	};

	const removeUnregisteredUserFromTrack = user => {
		setUnregisteredUsersArr(prev => prev.filter(el => el.name !== user.name));
	};
	const isTopStandard = n === totalTracks && (track.splitUsers.length > 1 || totalTracks > 1);

	const allUsers = [...members, ...track.splitUsers, ...usersArr];

	return (
		<Box
			borderRadius='10px'
			bgColor='bg.light'
			p='16px 12px'
			as='li'
			border='1px solid'
			borderColor='bg.secondary'
		>
			<Text
				fontWeight='500'
				fontSize='16px'
				color='black'
				px='12px'
				borderBottom='1px solid'
				borderColor='accent'
				mb='16px'
			>
				{n}. {track.name}
			</Text>
			<Box mb='16px'>
				{members?.length > 0 && (
					<Box mb='16px'>
						<ListTitleCredits
							title='Members of the B.A.P.'
							onClick={() => {
								setShowAllMembers(!showAllMembers);
							}}
							isAdditionalBtn={members?.length > 2}
							isViewAll={showAllMembers}
						/>
						<Flex as='ul' flexDir='column' gap='4px' mb='20px'>
							{members.slice(0, showAllMembers ? members.length : 2).map(member => (
								<UserCardCredits
									key={`${member.userId}`}
									onSelect={() => {
										addUserToTrack({ user: member });
									}}
									user={member}
								/>
							))}
						</Flex>
					</Box>
				)}
				<SearchUsers
					searchValue={searchValue}
					setSearchValue={setSearchValue}
					addUserToTrack={addUserToTrack}
					searchList={searchList}
					setSearchList={setSearchList}
					allUsers={allUsers}
					unregisteredUsersArr={unregisteredUsersArr}
				/>
			</Box>
			<Text fontWeight='500' fontSize='16px' color='secondary' px='12px' mb='12px'>
				Participants of splits/contract:
			</Text>
			<Flex as='ul' gap='16px' flexDir='column'>
				{track.splitUsers.map((user, i) => {
					return (
						<Box as='li' key={`${user.email}${track.trackId}`}>
							<Text fontSize='16px' fontWeight='400' color='black' mb='4px' pl='12px'>
								{getUserName(user)}
							</Text>

							{user?.userId ? (
								<>
									<CustomSelect
										isMulti={true}
										placeholder='No credits'
										onChange={selectedOptions => {
											handleSelect(selectedOptions, user);
										}}
										name={user.userId}
										options={options}
										hControl='fit-content'
										selectedOptions={userCredits[user.userId]}
										value={userCredits[user.userId]}
										isTop={
											i === track.splitUsers.length - 1 &&
											composers.length === 0 &&
											usersArr.length === 0 &&
											unregisteredUsersArr.length === 0 &&
											isTopStandard
										}
									/>
								</>
							) : (
								<Text fontSize='16px' fontWeight='400' color='accent' pl='12px'>
									You can&apos;t add credits to unregistered user
								</Text>
							)}
						</Box>
					);
				})}
			</Flex>

			{(usersArr.length > 0 || composers.length > 0 || unregisteredUsersArr.length > 0) && (
				<Box mt='16px'>
					<Text fontWeight='500' fontSize='16px' color='secondary' px='12px' mb='12px'>
						Users with credits:
					</Text>
					<Flex as='ul' gap='16px' flexDir='column'>
						{usersArr.map((user, i) => {
							return (
								<Box as='li' key={`${user.email}${track.trackId}`}>
									<Flex align='center' justify='space-between' mb='4px'>
										<Text fontSize='16px' fontWeight='400' color='black' pl='12px'>
											{getUserName(user)}
										</Text>
										{userCredits[user.userId].length === 0 && (
											<IconButton
												onClick={() => removeUserFromTrack(user)}
												icon={<CloseIcon />}
												boxSize='24px'
												color='secondary'
												_hover={{ color: 'accent' }}
												transition='0.3s linear'
												size='xs'
												mr='16px'
											/>
										)}
									</Flex>

									<CustomSelect
										isMulti={true}
										placeholder='No credits'
										onChange={selectedOptions => {
											handleSelect(selectedOptions, user);
										}}
										name={user.userId}
										options={options}
										hControl='fit-content'
										selectedOptions={userCredits[user.userId]}
										value={userCredits[user.userId]}
										isTop={
											i === usersArr.length - 1 &&
											composers.length === 0 &&
											unregisteredUsersArr.length === 0 &&
											isTopStandard
										}
									/>
								</Box>
							);
						})}
						{unregisteredUsersArr.map((user, i) => {
							return (
								<Box as='li' key={`${user.name}${track.trackId}`}>
									<Flex align='center' justify='space-between' mb='4px'>
										<Text fontSize='16px' fontWeight='400' color='black' pl='12px'>
											{user.name}
										</Text>
										{unregisteredUsersCredits[user.name].length === 0 && (
											<IconButton
												onClick={() => removeUnregisteredUserFromTrack(user)}
												icon={<CloseIcon />}
												boxSize='24px'
												color='secondary'
												_hover={{ color: 'accent' }}
												transition='0.3s linear'
												size='xs'
												mr='16px'
											/>
										)}
									</Flex>

									<CustomSelect
										isMulti={true}
										placeholder='No credits'
										onChange={selectedOptions => {
											handleSelectForUnregistered(selectedOptions, user);
										}}
										name={user.name}
										options={options}
										hControl='fit-content'
										selectedOptions={unregisteredUsersCredits[user.name]}
										value={unregisteredUsersCredits[user.name]}
										isTop={i === unregisteredUsersArr.length - 1 && composers.length === 0 && isTopStandard}
									/>
								</Box>
							);
						})}
						{composers.map(user => {
							return (
								<Box as='li' key={`${user.userId}${track.trackId}`}>
									<Text fontSize='16px' fontWeight='400' color='black' mb='4px' pl='12px'>
										{user.name}
									</Text>
									<CustomInput name={user.userId} value={auddCredits[user.userId]} readOnly={true} />
								</Box>
							);
						})}
					</Flex>
				</Box>
			)}
		</Box>
	);
};

export default TrackWithCredits;
