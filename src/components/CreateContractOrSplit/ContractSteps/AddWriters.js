import { Box, Flex, Heading, Icon, Text, useToast } from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import NextButton from '@/components/Buttons/NextButton/NextButton';
import UserCard from '@/components/Releases/UserCard/UserCard';

import ArrowDownIcon from '@/assets/icons/base/arrow-down.svg';
import ArrowUpIcon from '@/assets/icons/base/arrow-up.svg';

import SearchWriters from '../SearchWriters/SearchWriters';

const ListTitle = ({ title, onClick, isViewAll, isAdditionalBtn }) => {
	return (
		<Flex justify='space-between' mb='4px' align='center'>
			<Heading color='black' fontSize='18px' fontWeight='500'>
				{title}
			</Heading>
			{isAdditionalBtn && (
				<>
					{isViewAll ? (
						<Flex as='button' onClick={onClick} px='12px' py='8px'>
							<Icon as={ArrowUpIcon} boxSize='24px' color='accent' mr='10px' />
							<Text color='accent' fontSize='16px' fontWeight='500'>
								Hide
							</Text>
						</Flex>
					) : (
						<Flex as='button' onClick={onClick} px='12px' py='8px'>
							<Icon as={ArrowDownIcon} boxSize='24px' color='accent' mr='10px' />
							<Text color='accent' fontSize='16px' fontWeight='500'>
								View all
							</Text>
						</Flex>
					)}
				</>
			)}
		</Flex>
	);
};
const AddWriters = ({
	activeContractWriters,
	localSplitTracks,
	ownership,
	setOwnership,
	setCurrentStep,
	usersToSplit,
	setUsersToSplit,
	initialInvitedUsersToBap,
	invitedUsersToBap,
	setInvitedUsersToBap,
	setIsSelectedSplitChecked,
	isSelectedSplitChecked,
	members,
	setMembers,
	artists,
	setArtists,
	initialMembers,

	setNewUserToInviteToBap,
}) => {
	const { selectedSplit } = useSelector(state => state.user.selectedRelease);
	const [searchList, setSearchList] = useState([]);
	const [isShowInvite, setIsShowInvite] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [showAllMembers, setShowAllMembers] = useState(false);
	const [showAllInvitedUsers, setShowAllInvitedUsers] = useState(false);
	const [showAllFeaturedArtists, setShowAllFeaturedArtists] = useState(false);
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
	const uniqueArtists = localSplitTracks
		.filter(el => el.selected)
		.flatMap(track => track.featureArtists)
		.reduce((acc, curr) => {
			const isDuplicate = acc.some(artist => artist.email === curr.email);
			if (!isDuplicate) {
				acc.push(curr);
			}
			return acc;
		}, []);

	function compareUsersByEmail(initialUsers) {
		// Создаем новый массив, содержащий только уникальные email из первого массива
		const emails = selectedSplit.splitUsers.map(obj => obj.email);
		const isInSelectedSplit = [];
		const notInSelectedSplit = [];
		initialUsers.forEach(user => {
			if (emails.includes(user.email)) {
				isInSelectedSplit.push(user);
				setOwnership(prev => ({
					...prev,
					[user.email]: 0,
				}));
			} else {
				notInSelectedSplit.push(user);
			}
		});
		return { isInSelectedSplit, notInSelectedSplit };
	}

	const addAnotherUserToAgreement = user => {
		const isAlreadyAdded = usersToSplit.find(el => el.email === user.email);
		if (isAlreadyAdded) {
			getToast('error', 'Error', 'Current user is already added');
			return;
		}

		setUsersToSplit(prev => [...prev, { ...user, userId: user.id }]);
		setSearchList([]);
		setSearchValue('');
		setOwnership(prev => ({
			...prev,
			[user.email]: 0,
		}));
	};

	const addWriterToAgreement = user => {
		setUsersToSplit(prev => [...prev, user]);
		setMembers(prev => prev.filter(el => el.email !== user.email));

		setOwnership(prev => ({
			...prev,
			[user.email]: 0,
		}));
	};
	const addArtistToAgreement = user => {
		setUsersToSplit(prev => [...prev, user]);
		setArtists(prev => prev.filter(el => el.email !== user.email));
		setOwnership(prev => ({
			...prev,
			[user.email]: 0,
		}));
	};

	const addInvitedUserToAgreement = user => {
		setUsersToSplit(prev => [...prev, user]);
		setInvitedUsersToBap(prev => prev.filter(el => el.email !== user.email));
		setOwnership(prev => ({
			...prev,
			[user.email]: 0,
		}));
	};

	const removeFromAgreement = user => {
		const isUserFromActiveContract = activeContractWriters?.find(el => {
			return el.ownership !== '0' && el.email === user.email;
		});
		if (isUserFromActiveContract) {
			const name = user.firstName + ' ' + user.lastName;
			getToast(
				'error',
				`Can't remove ${name} from contract`,
				'This writer is part of an active contract. You can give him a 0% ownership in the next step',
			);
			return;
		}

		const isMember = initialMembers?.find(el => el.email === user.email);
		const isArtist = uniqueArtists.find(el => el.email === user.email);
		const isInvitedUser = initialInvitedUsersToBap.find(el => el.email === user.email);
		if (isMember) {
			setMembers(prev => [...prev, user]);
		} else if (isArtist) {
			setArtists(prev => [...prev, user]);
		} else if (isInvitedUser) {
			setInvitedUsersToBap(prev => [...prev, user]);
		} else {
			setNewUserToInviteToBap(prev => prev.filter(el => el.email !== user.email));
		}

		setUsersToSplit(prev => prev.filter(el => el.email !== user.email));
		const updatedOwnership = Object.fromEntries(
			Object.entries(ownership).filter(([key]) => key !== user.email),
		);

		setOwnership(updatedOwnership);
	};

	useEffect(() => {
		if (selectedSplit?.splitUsers?.length > 0 && !isSelectedSplitChecked) {
			let activeUsers = [];
			if (initialMembers?.length > 0) {
				const membersRes = compareUsersByEmail(initialMembers);
				if (membersRes.isInSelectedSplit.length > 0) {
					setUsersToSplit(prev => [...prev, ...membersRes.isInSelectedSplit]);
					activeUsers = [...activeUsers, ...membersRes.isInSelectedSplit];
				}
				setMembers(membersRes.notInSelectedSplit);
			}
			if (artists?.length > 0) {
				const artistsRes = compareUsersByEmail(artists);
				if (artistsRes.isInSelectedSplit.length > 0) {
					setUsersToSplit(prev => [...prev, ...artistsRes.isInSelectedSplit]);
					activeUsers = [...activeUsers, ...artistsRes.isInSelectedSplit];
				}
				setArtists(artistsRes.notInSelectedSplit);
			}
			if (initialInvitedUsersToBap?.length > 0) {
				const invitedUsersRes = compareUsersByEmail(initialInvitedUsersToBap);
				if (invitedUsersRes.isInSelectedSplit.length > 0) {
					setUsersToSplit(prev => [...prev, ...invitedUsersRes.isInSelectedSplit]);
					activeUsers = [...activeUsers, ...invitedUsersRes.isInSelectedSplit];
				}
				setInvitedUsersToBap(invitedUsersRes.notInSelectedSplit);
			}

			if (selectedSplit.splitUsers.length > activeUsers.length) {
				const anotherUsers = selectedSplit.splitUsers.filter(item1 => {
					return activeUsers.every(item2 => item1.email !== item2.email);
				});
				setUsersToSplit(prev => [...prev, ...anotherUsers]);
			}

			setIsSelectedSplitChecked(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSplit?.splitUsers]);

	const usersToSplitFromMajorLab = usersToSplit.filter(el => el.firstName && el.lastName);
	const usersToSplitPending = usersToSplit.filter(el => !el.firstName || !el.lastName);

	const allUsers = [...initialMembers, ...artists, ...initialInvitedUsersToBap, ...usersToSplit];

	return (
		<Flex flexDir='column' justify='space-between' h='100%'>
			<Flex>
				<Box w='50%' minW='300px'>
					{members?.length > 0 && (
						<Box mb='16px'>
							<ListTitle
								title='Members of the B.A.P.'
								onClick={() => {
									setShowAllMembers(!showAllMembers);
								}}
								isAdditionalBtn={members?.length > 3}
								isViewAll={showAllMembers}
							/>
							<Flex as='ul' flexDir='column' gap='4px' mb='20px'>
								{members.slice(0, showAllMembers ? members.length : 3).map(member => (
									<UserCard
										key={`${member.email}member`}
										onSelect={() => {
											addWriterToAgreement(member);
										}}
										user={member}
									/>
								))}
							</Flex>
						</Box>
					)}
					{/* {artists?.length > 0 && (
						<Box mb='16px'>
							<ListTitle
								title='Featured artists'
								onClick={() => {
									setShowAllFeaturedArtists(!showAllFeaturedArtists);
								}}
								isAdditionalBtn={artists?.length > 2}
								isViewAll={showAllFeaturedArtists}
							/>

							<Flex as='ul' flexDir='column' gap='4px' mb='20px'>
								{artists.slice(0, showAllFeaturedArtists ? artists.length : 2).map(artist => (
									<UserCard
										key={`${artist?.email}artist`}
										onSelect={() => {
											addArtistToAgreement(artist);
										}}
										user={artist}
									/>
								))}
							</Flex>
						</Box>
					)} */}
					<SearchWriters
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						addAnotherUserToAgreement={addAnotherUserToAgreement}
						isShowInvite={isShowInvite}
						setIsShowInvite={setIsShowInvite}
						searchList={searchList}
						setSearchList={setSearchList}
						setNewUserToInviteToBap={setNewUserToInviteToBap}
						allUsers={allUsers}
					/>
					{invitedUsersToBap?.length > 0 && (
						<Box>
							<ListTitle
								title='Invited writers'
								onClick={() => {
									setShowAllInvitedUsers(!showAllInvitedUsers);
								}}
								isAdditionalBtn={invitedUsersToBap?.length > 2}
								isViewAll={showAllInvitedUsers}
							/>
							<Flex as='ul' flexDir='column' gap='4px' mb='20px'>
								{invitedUsersToBap
									.slice(0, showAllInvitedUsers ? invitedUsersToBap.length : 2)
									.map(user => (
										<UserCard
											key={nanoid()}
											onSelect={() => {
												addInvitedUserToAgreement(user);
											}}
											user={user}
											isInvitedUser={true}
										/>
									))}
							</Flex>
						</Box>
					)}
				</Box>
				{usersToSplit.length > 0 && (
					<Box w='50%' ml='24px'>
						<Heading fontSize='18px' color='black' fontWeight='500' mb='4px'>
							You choose&nbsp;
							{usersToSplit.length > 1 && `(${usersToSplit.length})`}
						</Heading>
						{usersToSplitFromMajorLab.length > 0 && (
							<Flex as='ul' flexDir='column' gap='4px' mb='20px'>
								{usersToSplitFromMajorLab.map(user => (
									<UserCard
										key={`${user?.userId}MajorLab`}
										onDelete={() => {
											removeFromAgreement(user);
										}}
										user={user}
									/>
								))}
							</Flex>
						)}
						{usersToSplitPending.length > 0 && (
							<>
								<Text color='secondary' fontSize='16px' fontWeight='500' mt='16px' mb='4px'>
									Invited writers
								</Text>
								<Flex as='ul' flexDir='column' gap='4px' mb='20px'>
									{usersToSplitPending.map(user => (
										<UserCard
											key={nanoid()}
											onDelete={() => {
												removeFromAgreement(user);
											}}
											user={user}
											isInvitedUser={true}
										/>
									))}
								</Flex>
							</>
						)}
					</Box>
				)}
			</Flex>

			{usersToSplit.length > 0 && (
				<NextButton
					onClickHandler={() => {
						setCurrentStep(3);
					}}
				/>
			)}
		</Flex>
	);
};

export default AddWriters;
