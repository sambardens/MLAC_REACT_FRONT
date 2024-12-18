import Image from 'next/image';

import { Box, Flex, Text } from '@chakra-ui/react';

import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getAppleMusicId from 'src/functions/serverRequests/spotify/getAppleMusicId';
import { inviteFeaturedArtistToTrack } from 'store/operations';

import ArtistEditMode from './ArtistEditMode';

const SelectedFeatureArtist = ({
	trackId,
	selectedArtist,
	setSelectedArtist,
	setIsOpenSearch,
	handleCancelArtist,
}) => {
	const axiosPrivate = useAxiosPrivate();
	const dispatch = useDispatch();

	const AddArtistToTrack = async () => {
		const appleMusicId = await getAppleMusicId({
			artistSpotifyId: selectedArtist.spotifyId,
			artistName: selectedArtist.name,
			axiosPrivate,
		});
		const { followers, ...artistData } = selectedArtist;
		const artist = { ...artistData, appleMusicId };

		const res = await dispatch(inviteFeaturedArtistToTrack({ trackId, artist }));
		if (res?.payload?.success) {
			setIsOpenSearch(false);
		} else {
			toast({
				position: 'top',
				title: 'Error',
				description: res?.payload?.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const getName = () => {
		const name = selectedArtist?.name?.split(' ');
		const firstName = name[0]?.charAt(0)?.toUpperCase();
		const lastName = name?.length > 1 ? name[1]?.charAt(0)?.toUpperCase() : '';
		return `${firstName}${lastName}`;
	};

	return (
		<Flex flexDir='column' gap='12px'>
			<Flex minH='56px' px='8px' alignItems='center'>
				<Flex>
					{selectedArtist?.avatar ? (
						<Image
							src={selectedArtist.avatar}
							alt={selectedArtist.name}
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
							{selectedArtist.name}
						</Text>
						<Text fontSize='14px' fontWeight='400'>
							Followers: {selectedArtist.followers}
						</Text>
					</Box>
				</Flex>
			</Flex>
			<ArtistEditMode
				selectedArtist={selectedArtist}
				setSelectedArtist={setSelectedArtist}
				onSave={AddArtistToTrack}
				onCancel={handleCancelArtist}
				isNew={true}
				isDisabled={!selectedArtist.country}
			/>
		</Flex>
	);
};

export default SelectedFeatureArtist;
