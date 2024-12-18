import { Checkbox, Flex, Text, useToast } from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';

const roles = [
	// { id: 11, value: 'Manager', label: 'Manager' },
	// { id: 12,value: 'Admin', label: 'Admin' },
	{ id: 13, value: 'Artist/Band member', label: 'Artist/Band member' },
	{ id: 14, value: 'Management/Label', label: 'Management/Label' },
];

const InviteForm = ({
	email,
	setEmail,
	setIsShowInvite,
	setSearchValue,
	addAnotherUserToAgreement,
	setNewUserToInviteToBap,
	allUsers,
}) => {
	const selectedBap = useSelector(state => state.user.selectedBap);
	// const [name, setName] = useState(null);
	const [role, setRole] = useState('');
	const [isInviteToBap, setIsInviteToBap] = useState(false);
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
	const handleChange = e => {
		setEmail(e.target.value);
	};
	const handleSelect = ({ value }) => {
		setRole(value);
	};
	const sendInviteHandler = async e => {
		e.preventDefault();

		const regex = /^(?=.{1,50}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!regex.test(email)) {
			getToast('error', 'Error', 'To send an invitation please enter a valid email address');
			return;
		}

		const isDuplicate = Boolean(allUsers.find(el => el.email === email));
		if (isDuplicate) {
			getToast('error', 'Error', 'An invitation has already been sent to this email address.');
			return;
		}
		if (isInviteToBap) {
			setNewUserToInviteToBap(prev => [{ email, role }, ...prev]);
		}
		addAnotherUserToAgreement({
			email,
			id: nanoid(),
			userId: null,
		});
		setIsShowInvite(false);
		setSearchValue('');
	};

	const handleCheck = e => {
		setIsInviteToBap(e.target.checked);
	};

	const isActive =
		(isInviteToBap && email && role) || (!isInviteToBap && email) ? 'main' : 'disabled';
	return (
		<Flex flexDir={'column'}>
			<Text color='secondary' fontSize='16px' fontWeight='400' mb='16px'>
				The user with this email is not registered with MajorLabl. Send him an invitation, after
				registration he will be able to sign a contract
			</Text>

			<Flex
				as='form'
				flexDir='column'
				gap='8px'
				width='100%'
				bg='bg.light'
				border='1px solid #D2D2D2'
				borderRadius='10px'
				p='16px'
				onSubmit={sendInviteHandler}
			>
				{/* <CustomInput
					placeholder='Enter name...'
					value={name}
					onChange={e => {
						setName(e.target.value);
					}}
					label='Name'
					name='name'
				/> */}
				<CustomInput
					placeholder='Enter email...'
					value={email}
					onChange={handleChange}
					label='Email'
					name='email'
					type='email'
				/>
				<Checkbox
					id='invite-to-bap'
					isChecked={isInviteToBap}
					onChange={handleCheck}
					colorScheme='checkbox'
					borderColor='accent'
					size='md'
					pl='12px'
				>
					<Text fontWeight='400' fontSize='16px'>
						Add user as {selectedBap.bapName} B.A.P. member?
					</Text>
				</Checkbox>
				{isInviteToBap && (
					<CustomSelect
						name='role'
						options={roles}
						onChange={handleSelect}
						value={role}
						label='Role'
						placeholder='Select role...'
					/>
				)}

				<Flex align='center' justify='end' w='100%'>
					<CustomButton styles={isActive} type='submit'>
						Send Invite
					</CustomButton>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default InviteForm;
