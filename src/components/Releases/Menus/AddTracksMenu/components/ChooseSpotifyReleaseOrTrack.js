import { Flex, Heading, Icon, IconButton, Text, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { MutatingDots } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getReleasesByUserSpotifyId from 'src/functions/serverRequests/spotify/getReleasesByUserSpotifyId';
import getTracksBySpotifyAlbumId from 'src/functions/serverRequests/spotify/getTracksBySpotifyAlbumId';
import addFeatureArtistList from 'src/functions/serverRequests/track/addFeatureArtistList';
import getTrackAuddInfo from 'src/functions/serverRequests/track/getTrackAuddInfo';
import getTrackSpotifyInfo from 'src/functions/serverRequests/track/getTrackSpotifyInfo';
import handleDeleteFeatureArtist from 'src/functions/serverRequests/track/handleDeleteFeatureArtist';
import checkFeatureArtists from 'src/functions/utils/checkFeatureArtists';
import { handleEditRelease, handleEditTrackInfo, saveReleaseLinks } from 'store/operations';
import { transliterate as tr } from 'transliteration';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomModal from '@/components/Modals/CustomModal';

import DoneIcon from '@/assets/icons/base/done.svg';
import RefreshIcon from '@/assets/icons/base/refresh.svg';
import SearchIcon from '@/assets/icons/base/search.svg';
import SpotifyIcon from '@/assets/icons/social/spotify.svg';

import SpotifyReleaseCardVersionType from './SpotifyReleaseCardVersionType';

const ChooseSpotifyReleaseOrTrack = ({ handlCloseSpotify, selectedTrack }) => {
	const axiosPrivate = useAxiosPrivate();
	const { mainGenres } = useSelector(state => state.genres);
	const { selectedBap, selectedRelease } = useSelector(state => state.user);
	const { isReleaseByOriginalAudio } = selectedRelease;
	const [isLoading, setIsLoading] = useState(false);
	const [releases, setReleases] = useState([]);
	const [releaseTracks, setReleaseTracks] = useState(null);

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

	const handleChange = async e => {
		const { value } = e.target;
		const valueLatinica = tr(value);
		setSearchValue(valueLatinica);
	};

	const handleGetSpotifyReleases = async id => {
		setIsLoading(true);
		const res = await getReleasesByUserSpotifyId(id, axiosPrivate);
		if (res?.success) {
			setReleases(res.artistAlbum);
		} else {
			getToast('Error', 'Can not get releases from Spotify. Try again later');
		}
		setIsLoading(false);
	};

	const normalizedFilterValue = searchValue?.toLowerCase().trim();
	const filteredTracks =
		releaseTracks?.length > 0 && normalizedFilterValue
			? releaseTracks?.filter(release => release.name.toLowerCase().includes(normalizedFilterValue))
			: releaseTracks;

	const filteredReleases =
		releases?.length > 0 && normalizedFilterValue
			? releases?.filter(release => release.name.toLowerCase().includes(normalizedFilterValue))
			: releases;

	const getReleaseTracks = async releaseSpotifyId => {
		setIsLoading(true);
		const response = await getTracksBySpotifyAlbumId(releaseSpotifyId);
		if (response?.success) {
			setReleaseTracks(response.tracks);
		} else {
			getToast('Error', 'Something went wrong. Try again later');
		}
		setIsLoading(false);
	};

	const isShowSpotifyReleases =
		!selectedRelease?.releaseSpotifyId ||
		(selectedRelease?.releaseSpotifyId &&
			isReleaseByOriginalAudio &&
			selectedRelease.checkedTracks?.length === 1);
	useEffect(() => {
		if (selectedBap?.spotifyId) {
			if (isShowSpotifyReleases) {
				handleGetSpotifyReleases(selectedBap?.spotifyId);
			} else if (selectedRelease?.releaseSpotifyId) {
				getReleaseTracks(selectedRelease.releaseSpotifyId);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap?.spotifyId, selectedRelease.checkedTracks?.length]);

	const resetRelease = () => {
		setReleaseTracks(null);
		setSearchValue('');
	};
	const handleGetNewInfo = async ({ preview_url, spotifyAlbumId, spotifyTrackId }) => {
		const withReleaseInfo =
			isReleaseByOriginalAudio &&
			selectedRelease.checkedTracks.length === 1 &&
			selectedRelease?.releaseSpotifyId !== spotifyAlbumId;
		setIsLoading(true);
		let newInfo = { success: false };
		if (preview_url) {
			const auddRes = await getTrackAuddInfo({
				preview_url,
				mainGenres,
				withReleaseInfo,
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
				withReleaseInfo,
				spotifyAlbumId,
				axiosPrivate,
			});
			console.log('spotifyRes: ', spotifyRes);
			if (spotifyRes.success) {
				newInfo = spotifyRes;
			}
		}
		if (newInfo.success) {
			console.log('================CHOOSE SPOTIFY RELEASE OR TRACK===================');
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
			if (withReleaseInfo) {
				const { genres, allTracksStreamingLinks, ...releaseData } = newInfo.releaseInfo;
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
			handlCloseSpotify();
		} else {
			getToast('Error', 'Something went wrong. Try again later');
		}

		setIsLoading(false);
	};

	return (
		<CustomModal closeModal={handlCloseSpotify} w='80vw' maxW='928px' h='650px' p='40px 0'>
			<Flex pr='14px' align='center' px='40px'>
				<Heading fontSize='32px' fontWeight='600'>
					{releaseTracks ? 'Select track' : 'Choose release from Spotify'}
				</Heading>
				{!releaseTracks && <Icon as={SpotifyIcon} ml='16px' boxSize='32px' />}
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
				{releaseTracks && isShowSpotifyReleases && (
					<CustomButton onClickHandler={resetRelease} w='250px' styles={isLoading ? 'disabled' : 'main'}>
						Choose another release
					</CustomButton>
				)}
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
				<>
					{releaseTracks ? (
						<Flex
							as='ul'
							p='8px'
							flexDir='column'
							gap='8px'
							h='416px'
							overflowY='scroll'
							pl='40px'
							pr='33px'
							mt='24px'
						>
							{filteredTracks.map(track => {
								const isAlreadyAdded = selectedRelease.checkedTracks.find(el => el.spotifyId === track.id);
								return (
									<Flex
										key={track?.id}
										as='li'
										align='center'
										justify='space-between'
										gap='12px'
										borderRadius='10px'
										bgColor='bg.light'
										px='12px'
										minH='48px'
									>
										<Text fontSize='16px' fontWeight='400' color='black'>
											{track?.name}
										</Text>
										{isAlreadyAdded ? (
											<Flex w='48px' h='48px' align='center' justify='center'>
												<Icon as={DoneIcon} boxSize='24px' color='#31bf31' />
											</Flex>
										) : (
											<IconButton
												size='lg'
												aria-label='refresh track information'
												icon={<RefreshIcon style={{ height: '24px', width: '24px' }} />}
												color='secondary'
												_hover={{ color: 'accent' }}
												transition='0.3s linear'
												onClick={() => {
													handleGetNewInfo({
														preview_url: track?.preview_url,
														spotifyAlbumId: track.spotifyAlbumId,
														spotifyTrackId: track.id,
													});
												}}
											/>
										)}
									</Flex>
								);
							})}
						</Flex>
					) : (
						<>
							{releases?.length > 0 ? (
								<>
									{filteredReleases.length > 0 ? (
										<Flex
											as='ul'
											align='space-between'
											gap='16px'
											w='100%'
											flexWrap='wrap'
											h='416px'
											overflowY='scroll'
											pl='40px'
											pr='33px'
											mt='24px'
										>
											{filteredReleases?.map(release => (
												<SpotifyReleaseCardVersionType
													key={release?.id}
													release={release}
													getReleaseTracks={getReleaseTracks}
												/>
											))}
										</Flex>
									) : (
										<Flex justify='center' align='center' h='416px' pr='14px'>
											<Text mt='20px' color='black' fontSize='18px' fontWeight='600' textAlign='center'>
												Can not find release
											</Text>
										</Flex>
									)}
								</>
							) : (
								<Flex justify='center' align='center' h='416px' pr='14px'>
									<Text mt='20px' color='black' fontSize='18px' fontWeight='600' textAlign='center'>
										There are no releases at Spotify
									</Text>
								</Flex>
							)}
						</>
					)}
				</>
			)}
		</CustomModal>
	);
};

export default ChooseSpotifyReleaseOrTrack;
