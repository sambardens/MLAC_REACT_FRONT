import { Grid, GridItem, IconButton, Text, Tooltip } from '@chakra-ui/react';

import { formatDate } from 'src/functions/utils/formatDate';

import SelectedIcon from '@/assets/icons/base/selected.svg';
import UnselectedIcon from '@/assets/icons/base/unselected.svg';

import { poppins_400_16_24 } from '@/styles/fontStyles';

const UserCard = ({ user, setFilteredUsers, filteredUsers }) => {
	const handleUserSelection = () => {
		const notChangedUsers = filteredUsers.filter(u => u.id !== user.id);
		const changedUser = { ...user, isSelected: !user.isSelected };
		const usersWithChangedUser = [...notChangedUsers, changedUser];
		const sortedPreparedUsers = usersWithChangedUser.sort((a, b) => a.id - b.id);
		setFilteredUsers(sortedPreparedUsers);
	};

	const formattedDate = formatDate(user.createdAt);

	return (
		<Grid
			alignItems={'center'}
			templateColumns='24px 1fr 1fr 1fr 24px'
			gap={6}
			h='56px'
			p='0 12px'
			bgColor={'white'}
			borderRadius={'10px'}
			onClick={() => handleUserSelection()}
			cursor='pointer'
		>
			<GridItem>
				<IconButton
					size='xs'
					h='24px'
					color={'accent'}
					icon={user.isSelected ? <SelectedIcon /> : <UnselectedIcon />}
					mr='16px'
				/>
			</GridItem>
			<GridItem>
				<Tooltip
					hasArrow
					label={
						user.firstName.length + user.lastName.length > 20 ? `${user.firstName} ${user.lastName}` : ''
					}
					placement='auto'
					bg='bg.black'
					color='textColor.white'
					fontSize='16px'
					borderRadius={'5px'}
				>
					<Text
						color={'textColor.black'}
						maxWidth={'250px'}
						sx={poppins_400_16_24}
						overflow={'hidden'}
						textOverflow={'ellipsis'}
						whiteSpace='nowrap'
					>
						{`${user.firstName} ${user.lastName}`}
					</Text>
				</Tooltip>
			</GridItem>
			<GridItem>
				<Tooltip
					hasArrow
					label={user.email?.length > 20 && user.email}
					placement='auto'
					bg='bg.black'
					color='textColor.white'
					fontSize='16px'
					borderRadius={'5px'}
				>
					<Text
						color={'textColor.black'}
						maxWidth={'250px'}
						sx={poppins_400_16_24}
						overflow={'hidden'}
						textOverflow={'ellipsis'}
						whiteSpace='nowrap'
					>
						{user.email}
					</Text>
				</Tooltip>
			</GridItem>
			<GridItem color='secondary'>{formattedDate}</GridItem>
		</Grid>
	);
};

export default UserCard;
