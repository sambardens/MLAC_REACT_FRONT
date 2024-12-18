import { Box, Flex, Heading, Icon, IconButton, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { MutatingDots } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import addFeatureArtistList from 'src/functions/serverRequests/track/addFeatureArtistList';
import getTrackAuddInfo from 'src/functions/serverRequests/track/getTrackAuddInfo';
import getTrackSpotifyInfo from 'src/functions/serverRequests/track/getTrackSpotifyInfo';
import handleDeleteFeatureArtist from 'src/functions/serverRequests/track/handleDeleteFeatureArtist';
import checkFeatureArtists from 'src/functions/utils/checkFeatureArtists';
import { handleEditRelease, handleEditTrackInfo, saveReleaseLinks } from 'store/operations';
import { transliterate as tr } from 'transliteration';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomModal from '@/components/Modals/CustomModal';

import DoneIcon from '@/assets/icons/base/done.svg';
import RefreshIcon from '@/assets/icons/base/refresh.svg';
import SearchIcon from '@/assets/icons/base/search.svg';

const ChooseTrackVariants = ({ handlCloseTrackVariants, selectedTrack, trackVariants }) => {
	const axiosPrivate = useAxiosPrivate();
	const { mainGenres } = useSelector(state => state.genres);
	const { selectedRelease, selectedBap } = useSelector(state => state.user);
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();
	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 5000,
			isClosable: true,
		});
	};
	const [searchValue, setSearchValue] = useState('');
	const dispatch = useDispatch();
	const { isReleaseByOriginalAudio } = selectedRelease;
	const handleChange = async e => {
		const { value } = e.target;
		const valueLatinica = tr(value);
		setSearchValue(valueLatinica);
	};

	const normalizedFilterValue = searchValue?.toLowerCase().trim();
	const filteredTracks =
		trackVariants?.length > 0 && normalizedFilterValue
			? trackVariants?.filter(release => release.name.toLowerCase().includes(normalizedFilterValue))
			: trackVariants;

	const withReleaseInfo = isReleaseByOriginalAudio && selectedRelease.checkedTracks.length === 1;
	const handleGetNewInfo = async ({ preview_url, spotifyAlbumId, spotifyTrackId }) => {
		const isNeedToEditRelease =
			withReleaseInfo && selectedRelease?.releaseSpotifyId !== spotifyAlbumId;
		setIsLoading(true);
		let newInfo = { success: false };
		if (preview_url) {
			const auddRes = await getTrackAuddInfo({
				preview_url,
				mainGenres,
				withReleaseInfo: isNeedToEditRelease,
				spotifyAlbumId,
				axiosPrivate,
			});

			if (auddRes.success && auddRes?.trackInfo?.spotifyId === spotifyTrackId) {
				newInfo = auddRes;
			}
		}

		if (!newInfo.success) {
			const spotifyRes = await getTrackSpotifyInfo({
				spotifyTrackId,
				mainGenres,
				withReleaseInfo: isNeedToEditRelease,
				spotifyAlbumId,
				axiosPrivate,
			});

			if (spotifyRes.success) {
				newInfo = spotifyRes;
			}
		}
		if (newInfo.success) {
			console.log('================CHOOSE TRACK VARIANTS===================');
			const { artistsToDelete, artistsToAdd, currentArtists } = checkFeatureArtists({
				oldArtists: selectedTrack.featureArtists,
				newArtists: newInfo.spotifyArtists,
			});
			if (artistsToDelete?.length > 0) {
				const deleteRes = await Promise.all(
					artistsToDelete.map(async el => {
						const deleteArtistRes = await handleDeleteFeatureArtist({
							trackId: selectedTrack?.id,
							artistId: el.id,
						});
						return deleteArtistRes;
					}),
				);
				const isSuccess = deleteRes.every(el => el?.success);
				if (!isSuccess) {
					getToast('Error', 'Something went wrong. Try again later');
					setIsLoading(false);
					return;
				}
			}

			if (isNeedToEditRelease) {
				const { genres, allTracksStreamingLinks, ...releaseData } = newInfo.releaseInfo;
				console.log('handleGetNewInfo releaseData: ', releaseData);
				await dispatch(
					handleEditRelease({
						releaseId: selectedRelease?.id,
						releaseData: { ...releaseData, ...genres.genresRequestBody },
						genresData: genres.genresData,
					}),
				);
				dispatch(
					saveReleaseLinks({
						releaseSpotifyId: releaseData.releaseSpotifyId,
						allTracksStreamingLinks,
					}),
				);
			}
			const featureArtists = currentArtists;

			if (artistsToAdd.length > 0) {
				const newFeatureArtists = await addFeatureArtistList({
					spotifyArtists: artistsToAdd,
					bapName: selectedBap.bapName,
					bapSpotifyId: selectedBap.spotifyId,
					trackId: selectedTrack.id,
				});
				newFeatureArtists.forEach(el => {
					featureArtists.push(el);
				});
			}
			const newTrackData = { ...selectedTrack, ...newInfo.trackInfo, featureArtists, error: null };
			await dispatch(handleEditTrackInfo(newTrackData));

			handlCloseTrackVariants();
		} else {
			getToast('Error', 'Something went wrong. Try again later');
		}

		setIsLoading(false);
	};

	return (
		<CustomModal closeModal={handlCloseTrackVariants} w='80vw' maxW='928px' h='650px' p='40px 0'>
			<Flex pr='14px' align='center' px='40px'>
				<Heading fontSize='32px' fontWeight='600'>
					Select track
				</Heading>
			</Flex>

			<Flex justifyContent='space-between' mt='16px' px='40px'>
				<CustomInput
					icon={SearchIcon}
					maxW='404px'
					placeholder='Search'
					value={searchValue}
					onChange={handleChange}
					readOnly={isLoading}
					name='searchValue'
				/>
			</Flex>

			{isLoading ? (
				<Flex alignItems={'center'} justifyContent={'center'} h='416px'>
					<MutatingDots
						height={'100'}
						width={'100'}
						color={'#db2754'}
						secondaryColor={'#db2754'}
						radius='12.5'
						ariaLabel='mutating-dots-loading'
						wrapperStyle={{}}
						wrapperClass=''
						visible={true}
					/>
				</Flex>
			) : (
				<Flex
					as='ul'
					flexDir='column'
					gap='12px'
					h='416px'
					overflowY='scroll'
					pl='40px'
					pr='33px'
					mt='24px'
				>
					{filteredTracks.map(track => {
						const isAlreadyAdded = selectedRelease.checkedTracks.find(
							el => el.spotifyId === track.id || el.name.toLowerCase() === track.name.toLowerCase(),
						);

						return (
							<Flex
								key={track?.id}
								as='li'
								align='center'
								justify='space-between'
								gap='12px'
								borderRadius='10px'
								bgColor='bg.light'
								p='8px 16px'
								border='1px solid'
								borderColor='stroke'
							>
								<Box>
									<Text fontSize='16px' fontWeight='400' color='black'>
										<Text as='span' fontSize='16px' fontWeight='400' color='secondary' mr='4px'>
											Track:
										</Text>
										{track?.name}
									</Text>
									{withReleaseInfo && (
										<Text fontSize='16px' fontWeight='400' color='black' mt='4px'>
											<Text as='span' fontSize='16px' fontWeight='400' color='secondary' mr='4px'>
												Release:
											</Text>
											{track?.album?.name}
										</Text>
									)}
								</Box>

								{isAlreadyAdded ? (
									<Flex w='48px' h='48px' align='center' justify='center'>
										<Icon as={DoneIcon} boxSize='24px' color='#31bf31' />
									</Flex>
								) : (
									<IconButton
										size='lg'
										aria-label='refresh track information'
										icon={<RefreshIcon style={{ height: '24px', width: '24px', fill: '#909090' }} />}
										color='secondary'
										transition='0.3s linear'
										onClick={() => {
											handleGetNewInfo({
												preview_url: track?.preview_url,
												spotifyAlbumId: track?.album?.id,
												spotifyTrackId: track?.id,
											});
										}}
									/>
								)}
							</Flex>
						);
					})}
				</Flex>
			)}
		</CustomModal>
	);
};

export default ChooseTrackVariants;
