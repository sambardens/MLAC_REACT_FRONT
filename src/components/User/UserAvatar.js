import { Box, Image, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';

const UserAvatar = ({ user, size = '64px', fontSize = '24px' }) => {
	const [avatar, setAvatar] = useState('');

	const getName = () => {
		const name = user?.name?.split(' ');
		const firstName = name[0]?.charAt(0)?.toUpperCase();
		const lastName = name?.length > 1 ? name[1]?.charAt(0)?.toUpperCase() : '';
		return `${firstName}${lastName}`;
	};

	const handleOnError = e => {
		if (e.target.src.includes('thumb_')) {
			const newImageSrc = e.target.src.replace('thumb_', '');
			setAvatar(newImageSrc);
		} else {
			setAvatar('');
		}
	};

	useEffect(() => {
		setAvatar(user?.avatarSrc);
	}, [user?.avatarSrc]);
	return (
		<>
			<Box
				minW={size}
				minH={size}
				boxSize={size}
				borderRadius='10px'
				bg='#7192b6'
				bgColor='stroke'
				pos='relative'
				overflow='hidden'
			>
				{avatar ? (
					<Image
						alt='User avatar'
						src={avatar}
						objectFit='cover'
						w={size}
						h={size}
						onError={e => {
							handleOnError(e);
						}}
					/>
				) : (
					<>
						{user?.name ? (
							<Text
								position='absolute'
								top='50%'
								right='50%'
								transform='translate(50%, -50%)'
								fontSize={fontSize}
								fontWeight='600'
								textAlign='center'
								color='white'
							>
								{getName()}
							</Text>
						) : (
							<Text
								position='absolute'
								top='50%'
								right='50%'
								transform='translate(50%, -50%)'
								fontSize={fontSize}
								fontWeight='600'
								textAlign='center'
								color='white'
							>
								{user?.firstName?.charAt(0).toUpperCase()}
								{user?.lastName?.charAt(0).toUpperCase()}
								{!user?.firstName && !user?.lastName && user?.email?.charAt(0).toUpperCase()}
							</Text>
						)}
					</>
				)}
			</Box>
		</>
	);
};

export default UserAvatar;
