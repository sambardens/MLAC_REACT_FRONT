import { Flex, IconButton, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import removeNotification from 'src/functions/serverRequests/notifications/removeNotification';
import sendInviteToBap from 'src/functions/serverRequests/notifications/sendInviteToBap';

import RingLoader from '@/components/Loaders/RingLoader';

import RestartIcon from '@/assets/icons/base/restart.svg';
import TrashIcon from '@/assets/icons/modal/trash.svg';

export const PendingInviteCard = ({
	inv,
	pendingReqsTrigger,
	setPendingReqsTrigger,
	setPendingInvitations,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const selectedBap = useSelector(state => state.user.selectedBap);
	const toast = useToast();

	const sendInviteHandler = async () => {
		const data = new FormData();
		data.append('email', `${inv.email}`);
		data.append('role', `${inv.role}`);

		const resData = await sendInviteToBap(data, selectedBap?.bapId);
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
		if (resData.success) {
			setPendingReqsTrigger(!pendingReqsTrigger);
			getToast('success', 'Success', 'An invite to join this B.A.P. was successfully resent.');
		}

		if (!resData.success) {
			const error = resData.message;

			toast({
				position: 'top',
				title: 'Error',
				description: `${error}`,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};
	const handleRemoveInvite = async () => {
		setIsLoading(true);
		const resData = await removeNotification(inv.id);

		if (resData.success) {
			setPendingInvitations(prev => prev.filter(el => el.id !== inv.id));
		}
		setIsLoading(false);
	};

	return (
		<Flex alignItems={'center'} p='10px' bg='bg.secondary' borderRadius={'10px'} gap='8px'>
			<Text fontSize='18px' color='black'>
				{inv.email}
			</Text>
			{isLoading ? (
				<Flex align='center' justify='center' w='56px'>
					<RingLoader w='24px' h='24px' />
				</Flex>
			) : (
				<>
					<IconButton
						boxSize='24px'
						minW='24px'
						aria-label={'Resent invite to BAP'}
						color='secondary'
						icon={<RestartIcon style={{ height: '24px', width: '24px' }} />}
						_hover={{ transform: 'rotate(360deg)', color: 'accent' }}
						transition='0.3s linear'
						onClick={sendInviteHandler}
					/>

					<IconButton
						boxSize='24px'
						minW='24px'
						aria-label={'Delete invite to BAP'}
						color='secondary'
						_hover={{ color: 'accent' }}
						icon={<TrashIcon style={{ height: '24px', width: '24px' }} />}
						transition='0.3s linear'
						onClick={handleRemoveInvite}
					/>
				</>
			)}
		</Flex>
	);
};
