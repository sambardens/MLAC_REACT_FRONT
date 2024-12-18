import Image from 'next/image';

import { Box, Flex, Text } from '@chakra-ui/react';

import ContainerLoader from '@/components/Loaders/ContainerLoader';
import UserAvatar from '@/components/User/UserAvatar';

const ArtistCardToTrack = ({ artist, user, onClickHandler, isLoadingArtist }) => {
	const handleAdd = () => {
		if (!artist?.isDublicate) {
			onClickHandler();
		}
	};
	const getName = () => {
		const name = artist?.name?.split(' ');

		const firstName = name[0]?.charAt(0)?.toUpperCase();
		const lastName = name?.length > 1 ? name[1]?.charAt(0)?.toUpperCase() : '';
		return `${firstName}${lastName}`;
	};
	const isLoading = isLoadingArtist === artist.spotifyId;
	return (
		<>
			{isLoading ? (
				<ContainerLoader w='40px' minH='56px' />
			) : (
				<Flex
					w='100%'
					px='8px'
					alignItems='center'
					onClick={handleAdd}
					_hover={{ bgColor: artist?.isDublicate ? 'transparent' : '#D2D2D2' }}
					cursor={artist?.isDublicate ? 'initial' : 'pointer'}
					minH='56px'
				>
					{artist && (
						<>
							<Flex>
								{artist?.avatar ? (
									<Image
										src={artist.avatar}
										alt={artist.name}
										width={40}
										height={40}
										style={{ width: '40px', height: '40px', borderRadius: '8px' }}
									/>
								) : (
									<Flex
										borderRadius='8px'
										bg='#7192b6'
										bgColor='stroke'
										w='40px'
										height='40px'
										align='center'
										justify='center'
									>
										<Text fontSize='16px' fontWeight='600' textAlign='center' color='white'>
											{getName()}
										</Text>
									</Flex>
								)}
								<Box ml='16px' h='40px'>
									<Text fontSize='14px' fontWeight='400'>
										{artist.name}
									</Text>
									<Text fontSize='14px' fontWeight='400'>
										Followers: {artist.followers}
									</Text>
								</Box>
							</Flex>
							{artist?.isDublicate ? (
								<Text
									w='120px'
									ml='auto'
									px='8px'
									fontWeight='500'
									fontSize='14px'
									color='accent'
									pointerEvents='none'
									textAlign='center'
								>
									Already added
								</Text>
							) : (
								<>
									{artist?.onMajorLabl && (
										<Text
											w='120px'
											ml='auto'
											px='8px'
											py='4px'
											bgColor='accent'
											fontWeight='500'
											fontSize='14px'
											color='white'
											borderRadius='31px'
											pointerEvents='none'
											textAlign='center'
										>
											On Major Labl
										</Text>
									)}
								</>
							)}
						</>
					)}
					{user && (
						<>
							<UserAvatar user={user} size='40px' fontSize='18px' />
							<Text
								ml='16px'
								fontSize='14px'
								fontWeight='400'
							>{`${user.firstName} ${user.lastName}`}</Text>
						</>
					)}
				</Flex>
			)}
		</>
	);
};

export default ArtistCardToTrack;
