import { Flex } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getPendingNotifications from 'src/functions/serverRequests/notifications/getPendingNotifications';
import getPreparedPendingInvites from 'src/functions/utils/notifications/getPreparedPendingInv';

import { MemberCard } from '@/components/BapInfo/Members/components/MemberCard';
import AddBapMemberModal from '@/components/Modals/AddBapMemberModal';
import MemberModal from '@/components/Modals/MemberModal';

import BoardLayout from './BoardLayout';

const MembersBoard = ({ isLoading }) => {
	const axiosPrivate = useAxiosPrivate();
	const { selectedBap } = useSelector(state => state.user);
	const [isOpenMemberModal, setIsOpenMemberModal] = useState(false);
	const [currentMember, setCurrentMember] = useState(null);
	const [isAddMemberModal, setIsMemberModal] = useState(false);
	const [isLoadingMembers, setIsLoadingMembers] = useState(false);
	const [pendingInvitations, setPendingInvitations] = useState([]);

	const handleOpenMemberModal = async () => {
		setIsLoadingMembers(true);
		setIsMemberModal(true);
		const allNotifications = await getPendingNotifications(selectedBap?.bapId, axiosPrivate);
		const membersEmails = selectedBap?.bapMembers?.map(user => user.email);
		const invitedUsers = allNotifications?.filter(user => !membersEmails.includes(user.email));
		const res = getPreparedPendingInvites(invitedUsers);

		setPendingInvitations(res);

		setIsLoadingMembers(false);
	};
	return (
		<>
			{isOpenMemberModal && (
				<MemberModal closeModal={() => setIsOpenMemberModal(false)} currentMember={currentMember} />
			)}

			{isAddMemberModal && (
				<AddBapMemberModal
					closeModal={() => setIsMemberModal(false)}
					pendingInvitations={pendingInvitations}
					isLoadingMembers={isLoadingMembers}
				/>
			)}

			<BoardLayout onClick={handleOpenMemberModal} title={'Members'} ariaLabel='member'>
				{!isLoading && selectedBap?.bapMembers?.length > 0 && (
					<Flex flexDir={'column'} justifyContent={'center'} mt='16px' as='ul'>
						{selectedBap?.bapMembers?.map(member => {
							return (
								<MemberCard
									isList={true}
									key={member?.userId}
									setCurrentMember={setCurrentMember}
									setIsOpenMemberModal={setIsOpenMemberModal}
									member={member}
									w='100%'
								/>
							);
						})}
					</Flex>
				)}
			</BoardLayout>
		</>
	);
};

export default MembersBoard;
