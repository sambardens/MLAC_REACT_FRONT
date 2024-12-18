import { Box, Flex, Heading, Text, useToast } from '@chakra-ui/react';

import debounce from 'lodash.debounce';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import sendInviteToBap from 'src/functions/serverRequests/notifications/sendInviteToBap';
import getMajorUsers from 'src/functions/serverRequests/user/getMajorUsers';

import CustomButton from '../Buttons/CustomButton';
import CustomInput from '../CustomInputs/CustomInput';
import CustomSelect from '../CustomInputs/CustomSelect';
import ContainerLoader from '../Loaders/ContainerLoader';
import UserCard from '../Releases/UserCard/UserCard';
import roles from '../mockData/roles';

import CustomModal from './CustomModal';
import CopyToClipboardButton from './components/CopyToClipboardButton';

const AddBapMemberModal = ({
	closeModal,
	setPendingReqsTrigger,
	pendingReqsTrigger,
	pendingInvitations,
	isLoadingMembers = false,
}) => {
	const axiosPrivate = useAxiosPrivate();
	const [input, setInput] = useState('');
	const [searchList, setSearchList] = useState(null);
	const toast = useToast();
	const { selectedBap, user } = useSelector(state => state.user);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedRole, setSelectedRole] = useState(roles[0]);

	const [isEmailError, setIsEmailError] = useState(true);
	const [inviteLink, setInviteLink] = useState(null);

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

	const debounceSearch = useRef(
		debounce(async inputValue => {
			if (!inputValue) return;
			const users = await getMajorUsers({ input: inputValue, type: 'email', axiosPrivate });
			const filteredUsers = users.filter(el => el.email === inputValue);
			const updatedUsers = filteredUsers?.map(user => {
				const isDuplicate = Boolean(selectedBap?.bapMembers.find(el => el.email === user.email));
				return { ...user, isDuplicate };
			});
			if (updatedUsers?.length > 0) {
				setSearchList(updatedUsers);
				return;
			}

			setSearchList([]);
		}, 100),
	).current;

	const handleInput = inputValue => {
		setInput(inputValue);
		setInviteLink(null);
		if (inputValue) {
			const regex = /^(?=.{1,50}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			if (regex.test(inputValue)) {
				debounceSearch(inputValue);
				setIsEmailError(false);
			} else {
				setSearchList(null);
				setIsEmailError(true);
			}
		} else {
			setSearchList(null);
		}
	};

	const sendInviteHandler = async (
		input,
		isButtonSendClicked = true,
		onCopy = false,
		isFirstRender = false,
	) => {
		const data = new FormData();
		if (isButtonSendClicked) {
			if (isEmailError) {
				getToast(
					'info',
					'Attention',
					'To send an invitation by mail, please enter valid email address.',
				);
				return;
			}
			const isDuplicate = pendingInvitations.find(el => el.email === input);
			if (isDuplicate) {
				getToast('error', 'Error', 'An invitation has already been sent to this mail.');
				return;
			}
			data.append('email', `${input}`);
			setIsLoading(true);
		}

		data.append('role', `${selectedRole?.value}`);
		setSearchList(null);
		setInput('');
		setSelectedRole(roles[0]);
		const resData = await sendInviteToBap(data, selectedBap?.bapId);

		if (resData.success) {
			const inviteTokenFromServer = resData.notification;
			setInviteLink(`https://app.majorlabl.com/accept-invite?token=${inviteTokenFromServer}`);

			if (!isButtonSendClicked) {
				!isFirstRender && onCopy();
			}

			setPendingReqsTrigger && setPendingReqsTrigger(!pendingReqsTrigger);

			if (isButtonSendClicked) {
				getToast('success', 'Success', 'Invite to B.A.P. was successfully sent!');
			}
		}

		if (!resData.success) {
			getToast('error', 'Error', resData?.message);
		}

		isButtonSendClicked && setIsLoading(false);
	};

	const filteredList = searchList ? searchList.filter(el => el.email !== user.email) : null;

	return (
		<CustomModal closeModal={closeModal} maxH='780px' max='90vw' minH='300px'>
			{isLoadingMembers ? (
				<ContainerLoader h='220px' w='130px' />
			) : (
				<Flex flexDir={'column'} maxH='85vh'>
					<Text color='secondary' fontSize='16px' fontWeight='400' mb='16px'>
						Start by entering the user&apos;s email address, if there is no such user on Major Labl Artist
						Club you can send them an invitation to join.
					</Text>
					<Flex
						position={'relative'}
						justify={'space-between'}
						align='flex-end'
						width='100%'
						display='flex'
						mb='16px'
					>
						<CustomInput
							label='Enter email'
							onChange={e => handleInput(e.target.value)}
							value={input}
							w='350px'
							placeholder={"Enter user's email"}
						/>

						<CustomSelect
							name='role'
							options={roles}
							onChange={e => setSelectedRole(e)}
							value={selectedRole.value}
							hControl='56px'
							minHeight='56px'
							w={'fit-content'}
							minW='175px'
							dropdownIconColor={'bg.black'}
							textAlign='right'
						/>
					</Flex>
					{!isEmailError && filteredList?.length > 0 && (
						<Box h='100%' overflow={'auto'}>
							<Text color='secondary' fontSize='18px' fontWeight='400' mb='16px' pl='12px'>
								Search result
							</Text>
							<Flex as='ul' flexDir='column' gap='4px' maxH='428px' overflowY='scroll'>
								{filteredList.map(el => (
									<Flex key={el.id} onClick={() => sendInviteHandler(el.email)}>
										<UserCard user={el} w='100%' showEmail={true} />
									</Flex>
								))}
							</Flex>
						</Box>
					)}
					{input.length > 0 && !isEmailError && filteredList?.length === 0 && !inviteLink && (
						<Box mb='16px'>
							<Heading color='secondary' fontSize='18px' fontWeight='500' mb='8px'>
								Search result
							</Heading>
							<Text color='secondary' fontSize='16px' fontWeight='400'>
								No users is found with this email. Send them an email to join Major Labl Artist Club.
							</Text>
						</Box>
					)}

					<Flex alignItems={'center'} justifyContent={'space-between'} w={'100%'}>
						{inviteLink && (
							<CopyToClipboardButton
								// sendInviteHandler={sendInviteHandler}
								value={inviteLink}
								p='16px 12px'
								boxShadow='1px 1px 3px 1px Gray'
								disabled={!inviteLink}
							/>
						)}

						{!isEmailError && !inviteLink && filteredList?.length === 0 && (
							<CustomButton
								onClickHandler={() => sendInviteHandler(input)}
								isSubmiting={isLoading}
								styles={!isEmailError ? 'main' : 'light'}
								ml='auto'
							>
								Send
							</CustomButton>
						)}
					</Flex>
				</Flex>
			)}
		</CustomModal>
	);
};

export default AddBapMemberModal;
