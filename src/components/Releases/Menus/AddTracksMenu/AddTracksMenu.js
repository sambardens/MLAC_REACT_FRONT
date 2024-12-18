import { Box, Flex, Text, useToast } from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getNewReleaseInfoByOriginalAudio from 'src/functions/serverRequests/audd/getNewReleaseInfoByOriginalAudio';
import addFeatureArtistList from 'src/functions/serverRequests/track/addFeatureArtistList';
import checkTrack from 'src/functions/utils/checkTrack';
import checkTrackType from 'src/functions/utils/checkTrackType';
import compareObjects from 'src/functions/utils/compareObjects';
import {
	editTracksPriceOrPosition,
	handleEditRelease,
	instance,
	saveReleaseLinks,
} from 'store/operations';
import { addTracksToRelease, setCheckedTracksOfRelease, setReleaseSelectedMenu } from 'store/slice';
import { transliterate as tr } from 'transliteration';

import NextButton from '@/components/Buttons/NextButton/NextButton';

import Track from '../../Track/Track';
import TrackOnLoading from '../../TrackOnLoading/TrackOnLoading';
import TrackWithError from '../../TrackWithError/TrackWithError';
import ReleaseUploadTrackButton from '../../UploadButtons/ReleaseUploadTrackButton';
import MenuTitle from '../MenuTitle/MenuTitle';
import WarningMessage from '../SellDirectMenu/WarningMessage/WarningMessage';

import ChooseSpotifyReleaseOrTrack from './components/ChooseSpotifyReleaseOrTrack';
import ChooseTrackVariants from './components/ChooseTrackVariants';

const AddTracksMenu = ({ isTrackMenuValid, artistWithoutCountry }) => {
	const { selectedRelease, selectedBap } = useSelector(state => state.user);
	const [trackFormData, setTrackFormData] = useState([]);
	const [tracksOnLoading, setTracksOnLoading] = useState([]);
	const [tracksWithError, setTracksWithError] = useState([]);
	const [isOpenSpotifyRelease, setIsOpenSpotifyRelease] = useState(false);
	const [showTrackVariants, setShowTrackVariants] = useState(false);
	const [trackVariants, setTrackVariants] = useState(null);
	const tracks = selectedRelease.checkedTracks;
	const [versionMenuId, setVersionMenuId] = useState(null);
	const [selectedTrack, setSelectedTrack] = useState(null);
	const { mainGenres } = useSelector(state => state.genres);
	const [artistEditMode, setArtistEditMode] = useState({});
	const toast = useToast();
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();

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
	let releaseSpotifyId = selectedRelease.releaseSpotifyId;
	const handleGetNewReleaseInfo = async spotifyAlbumId => {
		const auddRes = await getNewReleaseInfoByOriginalAudio({
			spotifyAlbumId,
			mainGenres,
			axiosPrivate,
		});
		if (auddRes.success) {
			const { genres, allTracksStreamingLinks, ...releaseData } = auddRes.releaseInfo;

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
		} else {
			getToast('error', 'Error', 'Something went wrong. Can not update release information.');
		}
	};

	useEffect(() => {
		const onSaveTracks = async () => {
			const newTracksWithError = [];
			const addTrack = async ({ formData, releaseId, trackName }) => {
				try {
					const { data } = await instance.post(`/api/tracks/create/${releaseId}`, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						onUploadProgress: progressEvent => {
							const { loaded, total } = progressEvent;
							let percent = Math.floor((loaded * 100) / total);
							setTracksOnLoading(prev =>
								prev.map(el => (el.trackName === trackName ? { ...el, progress: percent } : el)),
							);
						},
					});

					if (data.success) {
						const { info, ...rest } = data.trackInfo;

						// update release information for existing release by original audio if user upload first track
						if (selectedRelease.isReleaseByOriginalAudio && selectedRelease.checkedTracks.length === 0) {
							const newData = info.result;
							const newReleaseSpotifyId = newData?.spotify?.album?.id;
							if (!newReleaseSpotifyId) {
								getToast('error', 'Error', 'Something went wrong. Can not update release information');
							}
							if (newReleaseSpotifyId && selectedRelease?.releaseSpotifyId !== newReleaseSpotifyId) {
								// eslint-disable-next-line react-hooks/exhaustive-deps
								releaseSpotifyId = newReleaseSpotifyId;
								await handleGetNewReleaseInfo(newReleaseSpotifyId);
							}
						}

						const featureArtists = await addFeatureArtistList({
							spotifyArtists: info?.result?.spotify?.artists || [],
							bapName: selectedBap.bapName,
							bapSpotifyId: selectedBap.spotifyId,
							trackId: data.trackInfo.id,
						});

						return {
							...rest,
							trackFull: info?.full
								? `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${info?.full}`
								: '',
							trackPreview: info?.preview
								? `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${info?.preview}`
								: '',
							type: null,
							price: 0,
							// evearaPreviewDuration: '15',
							// evearaPreviewStartAt: '15',
							// evearaPriceId: null,
							// evearaTrackId: null,
							featureArtists,
						};
					}
					return { success: false };
				} catch (error) {
					newTracksWithError.push({ name: trackName, error: error?.response?.data?.message });

					// toast({
					// 	position: 'top',
					// 	title: 'Error',
					// 	description: `${
					// 		error?.response?.data?.message
					// 			? `${error?.response?.data?.message}.`
					// 			: `Sorry, ${trackName} has not been uploaded.`
					// 	} Try again`,
					// 	status: 'error',
					// 	duration: 5000,
					// 	isClosable: true,
					// });
				}
			};

			const results = await Promise.allSettled(
				trackFormData.map(track =>
					addTrack({
						formData: track.formData,
						releaseId: selectedRelease.id,
						trackName: tr(track.trackName),
					}),
				),
			);

			let newTracks = results
				.filter(result => result.status === 'fulfilled' && result.value?.id)
				.map(result => result.value);

			setTracksWithError(prev => [...prev, ...newTracksWithError]);

			if (newTracks?.length > 0) {
				if (!selectedRelease.releaseSpotifyId) {
					const tracksWithType = await Promise.all(
						newTracks.map(async el => {
							const oldData = { name: el.name, type: '' };
							const newData = checkTrackType(el.name);
							const isNewData = compareObjects(newData, oldData);
							if (isNewData) {
								await instance.put(`/api/tracks/settings?uniqueName=${el.uniqueName}`, newData, {
									headers: { 'Content-Type': 'application/json' },
								});
								return { ...el, ...newData };
							} else {
								return el;
							}
						}),
					);
					newTracks = tracksWithType;
				}
				const releaseTracks = [...selectedRelease.checkedTracks, ...newTracks];

				const tracksToRelease = checkTrack({
					releaseSpotifyId,
					releaseTracks,
				});
				dispatch(addTracksToRelease(tracksToRelease));
			}
			setTrackFormData([]);
			setTracksOnLoading([]);
		};

		if (trackFormData.length > 0) {
			onSaveTracks();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trackFormData.length]);

	const onDragEnd = result => {
		if (!result.destination) {
			return;
		}
		const newItems = [...tracks];
		const [removed] = newItems.splice(result.source.index, 1);
		newItems.splice(result.destination.index, 0, removed);

		let position = 1;
		const itemsArr = [];

		newItems.forEach(item => {
			const itemWithNewPosition = {
				...item,
				position,
			};
			position += 1;
			itemsArr.push(itemWithNewPosition);
		});

		const tracksData = itemsArr?.reduce((acc, el) => {
			acc[el.uniqueName] = { position: el.position };
			return acc;
		}, {});

		dispatch(setCheckedTracksOfRelease([...itemsArr]));
		dispatch(
			editTracksPriceOrPosition({
				tracksData,
				updatedTracks: [...itemsArr],
			}),
		);
	};

	const isLoadingTracks = tracksOnLoading?.length > 0;

	const isTracks = tracks?.length > 0;
	const isTracksWithError = tracksWithError?.length > 0;

	const totalTracks = +selectedRelease?.totalTracks;
	const remainingTracks = totalTracks && totalTracks - tracks.filter(el => !el?.error).length;

	const isDisabled = selectedRelease.isDuplicate || !isTracks || tracks.find(el => el.error);
	const loadingTracksComponents = useMemo(
		() => tracksOnLoading.map(track => <TrackOnLoading key={track.trackName} track={track} />),
		[tracksOnLoading],
	);
	const handleDeleteTrackWithError = index => {
		setTracksWithError(tracksWithError.filter((el, i) => i !== index));
	};
	const tracksWithErrorComponents = useMemo(
		() =>
			tracksWithError.map((track, i) => (
				<TrackWithError
					key={nanoid()}
					track={track}
					handleDeleteTrackWithError={() => {
						handleDeleteTrackWithError(i);
					}}
				/>
			)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[tracksWithError?.length],
	);

	const getTrackText = countTracks => (countTracks === 1 ? 'track' : 'tracks');

	const handleOpenSpotify = track => {
		setIsOpenSpotifyRelease(true);
		setSelectedTrack(track);
	};
	const handlCloseSpotify = () => {
		setIsOpenSpotifyRelease(false);
		setSelectedTrack(null);
		setVersionMenuId(null);
	};

	const handleOpenTrackVariants = ({ track, variants }) => {
		setTrackVariants(variants);
		setShowTrackVariants(true);
		setSelectedTrack(track);
	};

	const handlCloseTrackVariants = () => {
		setShowTrackVariants(false);
		setSelectedTrack(null);
		setTrackVariants(null);
		setVersionMenuId(null);
	};

	// useEffect(() => {
	// 	if (selectedRelease?.checkedTracks) {
	// 		setTracks(selectedRelease?.checkedTracks);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [selectedRelease?.checkedTracks]);

	const handleNext = () => {
		if (artistWithoutCountry) {
			getToast(
				'error',
				'Country of origin is required for every featured artist.',
				`The country is missing for ${artistWithoutCountry} featured ${
					artistWithoutCountry > 1 ? 'artists' : 'artist'
				}.`,
			);
			return;
		}
		dispatch(setReleaseSelectedMenu(isTrackMenuValid ? 3 : 7));
	};

	const getVision = () => {
		if (selectedRelease.isDuplicate && tracks.length > 0) {
			return false;
		} else {
			return !totalTracks || (totalTracks && remainingTracks !== 0);
		}
	};
	const isUploadBtn = getVision();
	return (
		<>
			<Flex flexDir={'column'} justifyContent='space-between' h='100%'>
				<Box>
					<Flex justify='space-between' mb='16px'>
						<MenuTitle
							title='Add track(s)'
							text='Upload audio files from your computer. We accept (Wav, MP3 and FLAC files).'
							mb='0'
						/>
						{isUploadBtn && !isLoadingTracks && (
							<ReleaseUploadTrackButton
								setTrackFormData={setTrackFormData}
								setTracksOnLoading={setTracksOnLoading}
								remainingTracks={remainingTracks}
								lastPosition={selectedRelease?.checkedTracks.length + 1}
							/>
						)}
					</Flex>
					<Box maxW='700px'>
						{selectedRelease.isDuplicate && (
							<WarningMessage title='You have already same release. Change the track/version or delete this track and upload another to change the release.' />
						)}
						{!selectedRelease.isDuplicate && Boolean(totalTracks) && (
							<Text fontSize='14px' fontWeight='400' color='secondary' pl='12px'>
								{remainingTracks > 0 && (
									<Text as='span' fontSize='14px' fontWeight='400' color='accent'>
										This release contains {totalTracks} {getTrackText(totalTracks)}.&nbsp;
									</Text>
								)}

								{remainingTracks > 0
									? 'To start selling your music directly or to switch distribution to Major Labl please upload the original audio now.'
									: 'All tracks of current release has been uploaded'}

								{remainingTracks > 0 && (
									<Text as='span' fontSize='14px' fontWeight='400' color='accent'>
										&nbsp;{remainingTracks} {getTrackText(remainingTracks)} remaining
									</Text>
								)}
							</Text>
						)}
						{isLoadingTracks && (
							<Flex as='ul' gap='8px' flexDir='column' mt='12px'>
								{loadingTracksComponents}
							</Flex>
						)}
						{isTracks && (
							<DragDropContext onDragEnd={onDragEnd}>
								<Droppable droppableId='cardList'>
									{provided => (
										<Flex
											as='ul'
											gap='8px'
											flexDir='column'
											ref={provided.innerRef}
											{...provided.droppableProps}
											mt='12px'
										>
											{tracks?.map((el, index) => {
												return (
													<Track
														key={el?.uniqueName}
														track={el}
														index={index}
														itemId={el?.uniqueName}
														setVersionMenuId={setVersionMenuId}
														versionMenuId={versionMenuId}
														handleOpenSpotify={handleOpenSpotify}
														handleOpenTrackVariants={handleOpenTrackVariants}
														artistEditMode={artistEditMode}
														setArtistEditMode={setArtistEditMode}
													/>
												);
											})}
											{provided.placeholder}
										</Flex>
									)}
								</Droppable>
							</DragDropContext>
						)}
						{isTracksWithError && (
							<Flex as='ul' gap='8px' flexDir='column' mt='8px'>
								{tracksWithErrorComponents}
							</Flex>
						)}
					</Box>
				</Box>
				<Flex mt='16px'>
					<NextButton styles={isDisabled ? 'disabled' : 'main'} onClickHandler={handleNext} />
				</Flex>
			</Flex>
			{isOpenSpotifyRelease && (
				<ChooseSpotifyReleaseOrTrack
					selectedTrack={selectedTrack}
					handlCloseSpotify={handlCloseSpotify}
				/>
			)}
			{showTrackVariants && (
				<ChooseTrackVariants
					selectedTrack={selectedTrack}
					handlCloseTrackVariants={handlCloseTrackVariants}
					trackVariants={trackVariants}
				/>
			)}
		</>
	);
};

export default AddTracksMenu;
