import { Box, Flex, Image, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import { poppins_400_14_21, poppins_500_18_27 } from '@/styles/fontStyles';

export const MemberCard = ({
	setCurrentMember = false,
	setIsOpenMemberModal = false,
	member,
	memberModal = false,
	isOpenChangeRole = false,
	isList = false,
	w,
}) => {
	const toast = useToast();
	const selectedBap = useSelector(state => state.user.selectedBap);
	const [avatar, setAvatar] = useState(member?.avatarSrc || '');
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
	const selectMemberHandler = () => {
		if (selectedBap.isCreator) {
			setCurrentMember && setCurrentMember(member);
			setIsOpenMemberModal && setIsOpenMemberModal(true);
			return;
		}
		getToast('error', 'Error', 'Only the B.A.P. owner can change member data.');
	};

	const handleOnError = e => {
		if (e.target.src.includes('thumb_')) {
			const newImageSrc = e.target.src.replace('thumb_', '');
			setAvatar(newImageSrc);
		} else {
			setAvatar('');
		}
	};

	return (
		<Box
			as={isList ? 'li' : 'div'}
			w={w}
			listStyleType='none'
			_hover={{
				bg: memberModal ? 'transparent' : 'bg.secondary',
				// boxShadow: '0px 4px 7px 5px rgba(136, 136, 136, 0.1)',
				borderRadius: '14px',
				cursor: memberModal ? 'normal' : 'pointer',
			}}
			onClick={selectMemberHandler}
			transition={'300ms'}
		>
			<Flex
				p={memberModal ? '0px' : '12px'}
				minW={w || '293px'}
				h={'fit-content'}
				alignItems={'center'}
			>
				{avatar ? (
					<Box
						minW='80px'
						minH='80px'
						w='80px'
						h='80px'
						borderRadius='10px'
						bg='#7192b6'
						bgColor='stroke'
						pos='relative'
						overflow='hidden'
					>
						<Image
							alt='Member avatar'
							src={avatar}
							style={{ objectFit: 'cover' }}
							boxSize='80px'
							onError={e => {
								handleOnError(e);
							}}
						/>
					</Box>
				) : (
					<Flex
						minW='80px'
						minH='80px'
						w='80px'
						h='80px'
						borderRadius='10px'
						align='center'
						justify='center'
						bgColor='stroke'
					>
						<Text fontSize={'24px'} fontWeight='600' textAlign='center' mr='6px'>
							{member?.firstName?.charAt(0).toUpperCase()}
						</Text>
						<Text fontSize={'24px'} fontWeight='600' textAlign='center'>
							{member?.lastName?.charAt(0).toUpperCase()}
						</Text>
					</Flex>
				)}

				<Flex flexDir={'column'} ml={'12px'}>
					<Flex flexWrap={'wrap'}>
						<Text color='black' sx={poppins_500_18_27} mr='5px'>
							{member?.firstName}
						</Text>
						<Text color='black' sx={poppins_500_18_27}>
							{member?.lastName}
						</Text>
					</Flex>

					<Text color='black' sx={poppins_400_14_21} mt='8px'>
						{member.role}
					</Text>
					{(member.isCreator || member.isFullAdmin) && (
						<Text color={'textColor.red'} sx={poppins_400_14_21} mt='8px'>
							{member.isCreator ? 'Owner' : 'Admin'}
						</Text>
					)}
				</Flex>
			</Flex>
		</Box>
	);
};
