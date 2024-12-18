import { Box, Flex, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getPendingNotifications from 'src/functions/serverRequests/notifications/getPendingNotifications';
import getPreparedPendingInvites from 'src/functions/utils/notifications/getPreparedPendingInv';
import { getBapMembers } from 'store/operations';

import MemberModal from '@/components/Modals/MemberModal';

import { MemberCard } from './components/MemberCard';
import { PendingInviteCard } from './components/PendingInviteCard';

export const MembersTab = ({
	pendingReqsTrigger,
	setPendingReqsTrigger,
	setPendingInvitations,
	pendingInvitations,
}) => {
	const { selectedBap, user } = useSelector(state => state.user);
	const axiosPrivate = useAxiosPrivate();
	const [isOpenMemberModal, setIsOpenMemberModal] = useState(false);
	const [currentMember, setCurrentMember] = useState(null);

	const dispatch = useDispatch();
	const onDeleteUser = () => {
		console.log('Delete user handler');
	};

	const getPendingInvitations = async () => {
		const membersRes = await dispatch(getBapMembers({ bapId: selectedBap.bapId, userId: user?.id }));
		if (membersRes?.payload?.success) {
			const allNotifications = await getPendingNotifications(selectedBap?.bapId, axiosPrivate);
			const membersEmails = membersRes?.payload?.data?.bapMembers?.map(user => user.email) || [];
			const invitedUsers = allNotifications?.filter(user => !membersEmails.includes(user.email));

			const res = getPreparedPendingInvites(invitedUsers);
			setPendingInvitations(res);
		}
	};

	useEffect(() => {
		if (selectedBap?.bapId && user?.id) {
			getPendingInvitations();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [axiosPrivate, pendingReqsTrigger, selectedBap?.bapId, user?.id]);

	return (
		<Box>
			{isOpenMemberModal && (
				<MemberModal
					closeModal={() => setIsOpenMemberModal(false)}
					currentMember={currentMember}
					onDeleteUser={onDeleteUser}
				/>
			)}

			<Text fontSize={'18px'} fontWeight={'600'} ml='16px'>
				Members
			</Text>

			{selectedBap?.bapMembers?.length > 0 && (
				<Flex as='ul' flexWrap={'wrap'} gap={'24px'} mt='16px'>
					{selectedBap?.bapMembers?.map(member => {
						return (
							<MemberCard
								isList={true}
								key={member?.userId}
								setCurrentMember={setCurrentMember}
								setIsOpenMemberModal={setIsOpenMemberModal}
								member={member}
							/>
						);
					})}
				</Flex>
			)}

			{pendingInvitations?.length > 0 && (
				<Box mt='24px'>
					<Text fontSize={'18px'} fontWeight={'600'}>
						Pending invites
					</Text>

					<Flex flexWrap={'wrap'} gap={'6px'} mt='16px'>
						{pendingInvitations.map(inv => {
							return (
								<PendingInviteCard
									key={inv?.id}
									inv={inv}
									pendingReqsTrigger={pendingReqsTrigger}
									setPendingReqsTrigger={setPendingReqsTrigger}
									setPendingInvitations={setPendingInvitations}
								/>
							);
						})}
					</Flex>
				</Box>
			)}
		</Box>
	);
};
