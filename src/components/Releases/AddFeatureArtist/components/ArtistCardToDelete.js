import { Box, Flex, Icon, IconButton, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getAppleMusicId from 'src/functions/serverRequests/spotify/getAppleMusicId';
import { deleteFeatureArtistFromTrack, editFeaturedArtist } from 'store/operations';

import RingLoader from '@/components/Loaders/RingLoader';
import UserAvatar from '@/components/User/UserAvatar';

import CloseIcon from '@/assets/icons/base/close.svg';
import EditIcon from '@/assets/icons/base/edit.svg';
import WarningIcon from '@/assets/icons/base/warning.svg';

import ArtistEditMode from './ArtistEditMode';

const ArtistCardToDelete = ({ artist, trackId, setArtistEditMode, showEditMode = false }) => {
	const axiosPrivate = useAxiosPrivate();
	const { selectedRelease } = useSelector(state => state.user);
	const [selectedArtist, setSelectedArtist] = useState(artist);
	const [isRemovingArtist, setIsRemovingArtist] = useState(false);
	const dispatch = useDispatch();
	const toast = useToast();
	const getToast = (status, text, title) => {
		toast({
			position: 'top',
			title,
			description: text || '',
			status,
			duration: 5000,
			isClosable: true,
		});
	};

	const handleDeleteFeatureArtist = async () => {
		setIsRemovingArtist(true);
		const res = await dispatch(
			deleteFeatureArtistFromTrack({
				trackId,
				artistId: artist.id,
			}),
			setArtistEditMode(null),
		);
		if (res?.payload?.success) {
			getToast('success', 'Featured artist has been deleted.', 'Success');
		} else {
			getToast('error', 'Failed to delete featured artist. Please try again.', 'Error');
		}
		setIsRemovingArtist(false);
	};

	const handleOpenEditMode = () => {
		setArtistEditMode({ trackId, artistId: artist.id });
	};

	const handleEditArtist = async () => {
		const artist = {
			appleMusicId: selectedArtist.appleMusicId,
			country: selectedArtist.country,
			soundCloudId: selectedArtist.soundCloudId,
		};
		if (!selectedArtist.appleMusicId) {
			const appleMusicId = await getAppleMusicId({
				artistSpotifyId: selectedArtist.spotifyId,
				artistName: selectedArtist.name,
				axiosPrivate,
			});
			artist.appleMusicId = appleMusicId;
		}

		const res = await dispatch(editFeaturedArtist({ artist, artistId: selectedArtist.id }));
		if (res?.payload?.success) {
			setArtistEditMode(null);
		} else {
			getToast('error', 'Error', res?.payload?.message);
		}
	};

	const handleCancelArtist = () => {
		setArtistEditMode(null);
	};

	const isDisabled =
		!selectedArtist.country ||
		(selectedArtist.country === artist.country &&
			selectedArtist.soundCloudId === artist.soundCloudId);

	return (
		<Box w='100%' mt={showEditMode ? '8px' : 0}>
			<Flex w='100%' align='center' justify='space-between' pl='8px'>
				<Flex align='center'>
					<UserAvatar user={artist} size='40px' fontSize='16px' />
					<Text ml='16px' fontSize='14px' fontWeight='400'>
						{artist.name}
					</Text>
				</Flex>
				{!showEditMode && (
					<Flex justify='space-between' align='center'>
						{!artist.country && <Icon as={WarningIcon} mr='8px' boxSize='24px' color='accent' />}
						<IconButton
							size='lg'
							h='56px'
							aria-label='Edit featured artist '
							icon={<EditIcon />}
							color='stroke'
							_hover={{ color: 'accent' }}
							transition='0.3s linear'
							onClick={handleOpenEditMode}
						/>

						{!selectedRelease.releaseSpotifyId && (
							<>
								{isRemovingArtist ? (
									<Flex h='56px' w='48px' align='center' justify='center'>
										<RingLoader w='24px' h='24px' />
									</Flex>
								) : (
									<IconButton
										size='lg'
										h='56px'
										aria-label='Delete featured artist of the track'
										icon={<CloseIcon />}
										color='stroke'
										_hover={{ color: 'accent' }}
										transition='0.3s linear'
										onClick={handleDeleteFeatureArtist}
									/>
								)}
							</>
						)}
					</Flex>
				)}
			</Flex>
			{showEditMode && (
				<ArtistEditMode
					isDisabled={isDisabled}
					selectedArtist={selectedArtist}
					setSelectedArtist={setSelectedArtist}
					onSave={handleEditArtist}
					onCancel={handleCancelArtist}
				/>
			)}
		</Box>
	);
};

export default ArtistCardToDelete;
