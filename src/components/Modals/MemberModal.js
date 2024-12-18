import { Box, Button, Flex } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import EditIcon from '@/assets/icons/modal/edit.svg';

import { MemberCard } from '../BapInfo/Members/components/MemberCard';

import CustomModal from './CustomModal';
import DeleteModal from './DeleteModal';
import { ChangeRole } from './components/ChangeRole';
import { poppins_500_16_24 } from '@/styles/fontStyles';

const MemberModal = ({ closeModal, currentMember, onDeleteUser }) => {
	const [isOpenChangeRole, setIsOpenChangeRole] = useState(false);
	const [isOpenDeleteMemberModal, setIsOpenDeleteMemberMod] = useState(false);
	const user = useSelector(state => state.user.user);
	const selectedBap = useSelector(state => state.user.selectedBap);

	return (
		<Box>
			<CustomModal closeModal={closeModal} maxW={'396px'} p={'40px 40px 20px 40px'}>
				<MemberCard member={currentMember} memberModal={true} isOpenChangeRole={isOpenChangeRole} />
				{!isOpenChangeRole && user.id !== currentMember.userId && selectedBap.isCreator && (
					<Flex justifyContent={'end'} alignItems={'center'} mt={'32px'}>
						<Button
							sx={poppins_500_16_24}
							color={'textColor.gray'}
							bg={'transparent'}
							leftIcon={<EditIcon />}
							w='124px'
							h='40px'
							// pl={'40px'}
							_hover={{}}
							_focus={{}}
							_active={{}}
							onClick={() => {
								setIsOpenChangeRole(!isOpenChangeRole);
							}}
						>
							Edit
						</Button>
					</Flex>
				)}

				{isOpenChangeRole && <ChangeRole currentMember={currentMember} closeModal={closeModal} />}
			</CustomModal>

			{isOpenDeleteMemberModal && (
				<DeleteModal
					closeModal={() => setIsOpenDeleteMemberMod(false)}
					deleteHandler={onDeleteUser}
					title={'Delete user'}
					text={'Are you sure you want to delete the user?'}
					description={
						'After deletion, the user loses access to the current B.A.P., but you can return it back'
					}
				/>
			)}
		</Box>
	);
};

export default MemberModal;
