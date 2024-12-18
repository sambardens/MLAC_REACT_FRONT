import { Box, Flex, IconButton, Text } from '@chakra-ui/react';

import UserAvatar from '@/components/User/UserAvatar';

import CloseIcon from '@/assets/icons/base/close.svg';

const UserCard = ({ onSelect, onDelete, user, isInvitedUser, w, showEmail = false }) => {
	const onClick = () => {
		if (!user?.isDuplicate && onSelect) {
			onSelect();
		}
	};
	return (
		<Flex
			as='li'
			p='12px'
			borderRadius={isInvitedUser ? '10px' : '14px'}
			alignItems='center'
			bg={user?.isDuplicate ? 'bg.lightRed' : 'bg.light'}
			onClick={onClick}
			cursor={user?.isDuplicate ? 'not-allowed' : 'pointer'}
			w={w}
		>
			{user?.userId && user?.firstName ? (
				<>
					<UserAvatar user={user} size='80px' />
					<Box ml='16px'>
						<Text fontWeight='500' fontSize='18px' color='black'>
							{user?.firstName} {user?.lastName || ''}
						</Text>
						{user?.role && (
							<Text fontWeight='400' fontSize='14px' color='accent'>
								{user.role}
							</Text>
						)}
						{user?.isDuplicate && (
							<Text fontWeight='400' fontSize='14px' color='accent'>
								Already added
							</Text>
						)}
						{showEmail && (
							<Text fontWeight='400' fontSize='14px' color='secondary'>
								{user.email}
							</Text>
						)}
					</Box>

					{onDelete && (
						<IconButton
							ml='auto'
							h='24px'
							w='24px'
							aria-label={`Unselect user ${user?.firstName} `}
							icon={<CloseIcon />}
							color='secondary'
							_hover={{ color: 'accent' }}
							transition='0.3s linear'
							onClick={onDelete}
						/>
					)}
				</>
			) : (
				<>
					<Text fontWeight='500' fontSize='18px' color='black'>
						{user?.email}
					</Text>
					{onDelete && (
						<IconButton
							ml='auto'
							h='24px'
							w='24px'
							aria-label={`Unselect user with ${user?.email} `}
							icon={<CloseIcon />}
							color='secondary'
							_hover={{ color: 'accent' }}
							transition='0.3s linear'
							onClick={onDelete}
						/>
					)}
				</>
			)}
		</Flex>
	);
};

export default UserCard;
