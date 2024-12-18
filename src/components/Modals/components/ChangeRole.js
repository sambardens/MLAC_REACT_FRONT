import { Box, Checkbox, Flex, FormLabel, Text, useToast } from '@chakra-ui/react';

import { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setPermissionOfUserOnBap from 'src/functions/serverRequests/bap/setPermissionOfUserOnBap';
import getPreparedMembersOfBap from 'src/functions/utils/bap/getPreparedMembersOfBap';
import { setBap } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';

// const roles = [
// 	{ id: '111', value: 'Band member', label: 'Band member' },
// 	{ id: '222', value: 'Manager', label: 'Manager' },
// 	{ id: '333', value: 'Admin', label: 'Admin' },
// ];

export const ChangeRole = ({ currentMember, closeModal }) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const selectedBap = useSelector(state => state.user.selectedBap);

	const isAdminBeforeUpdate = currentMember.isFullAdmin;

	const [isAdmin, setIsAdmin] = useState(currentMember.isFullAdmin);

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

	const handleSave = async () => {
		const isChanged = isAdminBeforeUpdate !== isAdmin;

		if (isChanged) {
			const formData = new FormData();
			formData.append('userId', `${currentMember.userId}`);
			const resData = await setPermissionOfUserOnBap(selectedBap.bapId, formData);
			const isResSuccess = resData.success;

			if (isResSuccess) {
				getToast('success', 'Success', 'Member has been changed successfully!');

				const updatedMember = { ...currentMember, ...resData.member };
				const preparedMember = getPreparedMembersOfBap([updatedMember])[0];
				const notUpdatedMembers = selectedBap.bapMembers.filter(
					member => member.userId !== currentMember.userId,
				);
				const updatedMembers = [...notUpdatedMembers, preparedMember];
				const updatedBap = { ...selectedBap, bapMembers: updatedMembers };
				dispatch(setBap(updatedBap));
				closeModal();

				return;
			}
			getToast('error', 'Error', resData?.message);
		}
	};

	return (
		<Box mt={'24px'}>
			<FormLabel mt='24px'>
				<Flex cursor={'pointer'} align='center'>
					<Checkbox
						id='change-role'
						isChecked={isAdmin}
						onChange={() => setIsAdmin(!isAdmin)}
						size='lg'
						iconColor={'white'}
						colorScheme={'checkbox'}
						borderColor='secondary'
						rounded='md'
					/>
					<Text fontSize='16px' fontWeight='500' color='black' ml='16px'>
						Is admin
					</Text>
				</Flex>
			</FormLabel>

			<Flex alignItems={'center'} justifyContent={'space-between'} mt={'24px'}>
				<CustomButton w={'150px'} h={'56px'} onClickHandler={() => handleSave()}>
					Save
				</CustomButton>

				<CustomButton styles={'light'} w={'150px'} h={'56px'} onClickHandler={closeModal}>
					Cancel
				</CustomButton>
			</Flex>
		</Box>
	);
};
