import { Box, Flex, Icon, IconButton, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import { updateTrackEveara } from 'src/functions/serverRequests/eveara/eveara';
import getTracksByTrackNameAndByArtistName from 'src/functions/serverRequests/spotify/getTracksByTrackNameAndByArtistName';
import cutTrackName from 'src/functions/utils/сutTrackName';
import { deleteTrack, handleEditRelease, handleEditTrack, instance } from 'store/operations';
import { transliterate as tr } from 'transliteration';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';
import RingLoader from '@/components/Loaders/RingLoader';

import CloseIcon from '@/assets/icons/base/close.svg';
import MoveIcon from '@/assets/icons/base/move.svg';
import PlusIcon from '@/assets/icons/base/plus.svg';
import warningIcon from '@/assets/icons/base/warning.svg';
import TrashIcon from '@/assets/icons/modal/trash.svg';
import UserIcon from '@/assets/icons/releases-contracts/user.svg';

import AddFeatureArtistMenu from '../AddFeatureArtist/AddFeatureArtist';
import ArtistCardToDelete from '../AddFeatureArtist/components/ArtistCardToDelete';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { trackTypes } from '../Menus/AddTracksMenu/trackTypes';

const Track = ({
	track,
	itemId,
	index,
	handleOpenSpotify,
	handleOpenTrackVariants,
	setVersionMenuId,
	versionMenuId,
	artistEditMode,
	setArtistEditMode,
}) => {
	const [isOpenSearch, setIsOpenSearch] = useState(false);
	const [isRemovingTrack, setIsRemovingTrack] = useState(false);
	const [isEditingName, setIsEditingName] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [state, setState] = useState({ name: '', type: '' });
	const [oldState, setOldState] = useState({ name: '', type: '' });
	const { selectedRelease, selectedBap, user } = useSelector(state => state.user);
	const { checkedTracks, id, releaseSpotifyId } = selectedRelease;
	const dispatch = useDispatch();
	const toast = useToast();
	const axiosPrivate = useAxiosPrivate();
	const [options, setOptions] = useState([]);

	useEffect(() => {
		const getOptions = () => {
			if (track.type) {
				const isNotCustom = trackTypes.find(el => el.value.toLowerCase() === track.type.toLowerCase());
				if (isNotCustom) {
					return trackTypes;
				} else {
					return [...trackTypes, { id: '7', label: track.type, value: track.type }];
				}
			}
			return trackTypes;
		};

		if (!selectedRelease?.releaseSpotifyId) {
			const newOptions = getOptions();
			setOptions(newOptions);
		}
	}, [selectedRelease?.releaseSpotifyId, track.type]);

	function isEqual() {
		const oldTrackData = {
			name: oldState.name.trim(),
			type: oldState.type,
		};
		const trackData = {
			name: state.name.trim(),
			type: state.type,
		};
		const trackDataKeys = Object.keys(trackData);
		for (let i = 0; i < trackDataKeys.length; i++) {
			const key = trackDataKeys[i];
			if (trackData[key] !== oldTrackData[key]) {
				return true;
			}
		}

		return false;
	}

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
	const handleChange = e => {
		const { value } = e.target;
		setState(prev => ({
			...prev,
			name: tr(value),
		}));
	};
	const handleSelect = target => {
		const value = target?.value;
		setState(prev => ({
			...prev,
			type: value || '',
		}));
	};

	const handleDeleteTrack = async () => {
		setIsRemovingTrack(true);
		const isTrackInSplitOrContract = selectedRelease?.splitsAndContracts
			.map(el => el.splitTracks)
			.flat()
			.find(el => el.trackId === track.id);
		if (isTrackInSplitOrContract) {
			getToast(
				'error',
				'This track is used in the split or contract.',
				"You can't delete this track from release",
			);
		} else {
			const res = await dispatch(
				deleteTrack({
					releaseId: id,
					trackId: track?.id,
					releaseTracks: selectedRelease.checkedTracks,
					releaseSpotifyId: selectedRelease.releaseSpotifyId || '',
				}),
			);
			if (res?.payload?.success) {
				getToast('success', `Track ${track?.name} has been deleted from release.`, 'Success');
				if (selectedRelease?.releasePrice) {
					if (selectedRelease.checkedTracks?.length === 2) {
						const lastTrack = selectedRelease.checkedTracks.filter(el => el.id !== track.id);

						if (lastTrack[0]?.price !== selectedRelease?.releasePrice) {
							dispatch(
								handleEditRelease({
									releaseId: selectedRelease.id,
									releaseData: { releasePrice: lastTrack[0]?.price || 0 },
								}),
							);
						}
					} else if (selectedRelease.checkedTracks?.length === 1) {
						dispatch(
							handleEditRelease({
								releaseId: selectedRelease.id,
								releaseData: { releasePrice: 0 },
							}),
						);
					}
				}

				if (track.evearaTrackId && user.uuidEveara) {
					await instance.delete(
						`/api/eveara/tracks/${track.evearaTrackId}?uuidEveara=${user.uuidEveara}`,
					);
				}
			} else {
				getToast('error', 'Track has not been deleted from release. Try again.', 'Error');
			}
		}
		setIsRemovingTrack(false);
	};

	const onDragStart = event => {
		event.stopPropagation();
	};

	const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

	useEffect(() => {
		const handleResize = () => {
			setViewportHeight(window.innerHeight);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const isTopCondition = () => {
		if (checkedTracks?.length === 1 && viewportHeight < 825) {
			return true;
		} else if (checkedTracks?.length >= 2 && checkedTracks?.length === index + 1) {
			return true;
		} else {
			return false;
		}
	};
	useEffect(() => {
		const name = track.name;
		const type = track.type;

		setState({ name, type });
		setOldState({ name, type });
	}, [track]);

	const canEditRelease =
		selectedRelease.checkedTracks.length === 1 && selectedRelease.isReleaseByOriginalAudio;
	const getTrackVariants = async () => {
		const res = await getTracksByTrackNameAndByArtistName({
			trackName: cutTrackName(track.name),
			artistName: selectedBap.bapName,
		});
		if (res.success) {
			const variants = res.tracks.filter(el => {
				if (el.id === track.spotifyId) return false;
				const isTrackFromByBap = el.artists.find(artist => artist.id === selectedBap.spotifyId);

				if (!isTrackFromByBap) return false;

				if (canEditRelease) {
					return Boolean(isTrackFromByBap);
				} else {
					const isTrackFromMyRelease = el.album.id === selectedRelease.releaseSpotifyId;
					return isTrackFromMyRelease;
				}
			});
			if (variants?.length > 0) {
				handleOpenTrackVariants({ track, variants });
			} else {
				getToast('info', "Can't find another track version");
			}
		} else {
			getToast('error', 'Something went wrong. Try again later', 'Error');
		}
	};
	const handleChangeType = async () => {
		const isNewTrackData = isEqual();
		if (isNewTrackData) {
			dispatch(handleEditTrack({ track: { ...track, ...state }, trackData: state }));
		}
	};
	const onBlurName = async () => {
		const isNewTrackData = isEqual();
		const name = state.name.trim();
		const normalizedState = { ...state, name };
		if (isNewTrackData) {
			setIsEditingName(true);
			await dispatch(
				handleEditTrack({ track: { ...track, ...normalizedState }, trackData: normalizedState }),
			);
			if (track?.evearaTrackId && selectedBap?.evearaBapId) {
				await updateTrackEveara(
					{
						trackId: track.evearaTrackId,
						trackData: { uuid: user.uuidEveara, name },
					},
					axiosPrivate,
				);
			}
			setIsEditingName(false);
		}
		setIsFocused(false);
	};
	const onFocusName = () => {
		if (!selectedRelease.releaseSpotifyId) {
			setIsFocused(true);
		}
	};
	const name = state.type ? `${state.name} - ${state.type}` : state.name;
	const isEditModeInCurrentTrack = artistEditMode?.trackId === track.id;
	const currentArtistInEditMode = track?.featureArtists.find(
		el => artistEditMode?.artistId === el.id,
	);
	return (
		<Draggable draggableId={itemId} index={index}>
			{(provided, snapshot) => (
				<Flex
					borderRadius='10px'
					bgColor='bg.light'
					p='8px 12px'
					flexDir='column'
					gap='4px'
					ref={provided.innerRef}
					{...provided.draggableProps}
					style={{
						border: snapshot.isDragging ? '1px solid #D2D2D2' : '1px solid transparent',
						...provided.draggableProps.style,
					}}
					pos='relative'
				>
					<IconButton
						{...provided.dragHandleProps}
						aria-label='Drag Icon'
						icon={<MoveIcon />}
						boxSize='24px'
						pos='absolute'
						top='24px'
						left='-32px'
						pointerEvents={selectedRelease.releaseSpotifyId ? 'none' : 'initial'}
						onClick={onDragStart}
						style={{ opacity: selectedRelease.releaseSpotifyId ? 0 : 1 }}
					/>

					{versionMenuId === track.id ? (
						<Box pl='12px'>
							<Flex align='center' justify='space-between' gap='12px'>
								<Text fontSize='16px' fontWeight='400' color='black'>
									{state?.name}
								</Text>
								<IconButton
									size='lg'
									h='56px'
									aria-label='Close menu to change track version type'
									icon={<CloseIcon />}
									color='stroke'
									_hover={{ color: 'accent' }}
									transition='0.3s linear'
									onClick={() => {
										setVersionMenuId(null);
									}}
								/>
							</Flex>
							<Box>
								<Text
									fontSize='16px'
									fontWeight='400'
									color='secondary'
									onClick={() => handleOpenSpotify(track)}
									cursor='pointer'
									mb='4px'
									_hover={{ color: 'accent' }}
									transition='0.3s linear'
								>
									Manually select track
								</Text>
								<Text
									fontSize='16px'
									fontWeight='400'
									color='secondary'
									onClick={getTrackVariants}
									cursor='pointer'
									_hover={{ color: 'accent' }}
									transition='0.3s linear'
								>
									Search from other track version
								</Text>
							</Box>
						</Box>
					) : (
						<>
							{selectedRelease.releaseSpotifyId && (
								<Text
									fontSize='14px'
									fontWeight='400'
									color='secondary'
									textAlign='end'
									onClick={() => {
										setVersionMenuId(track.id);
									}}
									cursor='pointer'
									mb='4px'
									_hover={{ color: 'accent' }}
									transition='0.3s linear'
								>
									This is the wrong track/version?
								</Text>
							)}
							{track?.error ? (
								<Box borderRadius='10px' bgColor='bg.light'>
									<Flex align='center' justify='space-between' mb='8px'>
										<Flex align='center'>
											<Icon as={warningIcon} mr='8px' boxSize='24px' color='accent' />
											<Text fontSize='14px' fontWeight='400' color='accent' lineHeight='1'>
												{track.error}
											</Text>
										</Flex>
										{isRemovingTrack ? (
											<Flex h='40px' minW='40px' align='center' justify='center'>
												<RingLoader w='24px' h='24px' />
											</Flex>
										) : (
											<Flex
												as='button'
												onClick={handleDeleteTrack}
												w='40px'
												py='8px'
												color='secondary'
												_hover={{ color: 'accent' }}
												transition='0.3s linear'
												aria-label={`Delete track ${track?.name}`}
												align='center'
												justify='center'
											>
												<Icon as={TrashIcon} boxSize='24px' />
											</Flex>
										)}
									</Flex>
									<Text fontSize='16px' fontWeight='400' color='black'>
										{track.name}
									</Text>
								</Box>
							) : (
								<>
									<Flex justify='space-between' align='center'>
										<AudioPlayer trackLink={track.trackFull} />
										{isRemovingTrack ? (
											<Flex h='56px' minW='40px' align='center' justify='center'>
												<RingLoader w='24px' h='24px' />
											</Flex>
										) : (
											<Flex
												as='button'
												onClick={handleDeleteTrack}
												minW='40px'
												h='56px'
												color='secondary'
												_hover={{ color: 'accent' }}
												transition='0.3s linear'
												aria-label={`Delete track ${track?.name}`}
												align='center'
												justify='center'
											>
												<Icon as={TrashIcon} boxSize='24px' />
											</Flex>
										)}
									</Flex>
									<Flex pos='relative'>
										{isFocused ? (
											<CustomInput
												label='Track name'
												type='text'
												name={track?.uniqueName}
												value={state.name || ''}
												onChange={handleChange}
												onBlur={onBlurName}
											/>
										) : (
											<CustomInput
												label='Track name'
												type='text'
												name={track?.uniqueName}
												value={name || ''}
												readOnly
												isCursor={!selectedRelease.releaseSpotifyId}
												onFocus={onFocusName}
											/>
										)}
										{isEditingName && (
											<Flex
												h='56px'
												minW='48px'
												align='center'
												justify='center'
												pos='absolute'
												right={0}
												bottom={0}
											>
												<RingLoader w='24px' h='24px' />
											</Flex>
										)}
									</Flex>

									{!selectedRelease?.releaseSpotifyId && (
										<CustomSelect
											label='Type'
											options={options}
											name='type'
											value={state?.type}
											placeholder='Select version type'
											onChange={handleSelect}
											onBlur={handleChangeType}
											isTop={isTopCondition()}
											isClearable
											pxDropdownIcon='12px'
											{...(checkedTracks?.length === index + 1 && { menuListTopHeight: '+ 20' })}
										/>
									)}
									{!releaseSpotifyId && !isEditModeInCurrentTrack && (
										<Flex justify='space-between' aling='center' h='56px' pl='12px'>
											<Flex align='center'>
												<Icon as={UserIcon} mr='8px' boxSize='24px' color='stroke' />
												<Text fontSize='16px' fontWeight='400' color='black'>
													Feature artist
												</Text>
											</Flex>
											{isOpenSearch ? (
												<IconButton
													size='lg'
													h='56px'
													aria-label='Close featured artists search'
													icon={<CloseIcon />}
													color='stroke'
													_hover={{ color: 'secondary' }}
													transition='0.3s linear'
													onClick={() => {
														setIsOpenSearch(false);
													}}
												/>
											) : (
												<IconButton
													size='lg'
													h='56px'
													aria-label='Open featured artists search'
													icon={<PlusIcon />}
													color='stroke'
													_hover={{ color: 'secondary' }}
													transition='0.3s linear'
													onClick={() => {
														setIsOpenSearch(true);
													}}
												/>
											)}
										</Flex>
									)}
									{isOpenSearch && (
										<AddFeatureArtistMenu
											trackId={track?.id}
											setIsOpenSearch={setIsOpenSearch}
											featureArtists={track?.featureArtists}
										/>
									)}
									{track?.featureArtists?.length > 0 && (
										<>
											{isEditModeInCurrentTrack ? (
												<ArtistCardToDelete
													artist={currentArtistInEditMode}
													trackId={track.id}
													artistEditMode={artistEditMode}
													setArtistEditMode={setArtistEditMode}
													showEditMode
												/>
											) : (
												<Flex
													as='ul'
													maxH='224px'
													overflowY='auto'
													alignItems='space-between'
													flexWrap={'wrap'}
												>
													{track?.featureArtists?.map(artist => (
														<ArtistCardToDelete
															key={artist.id}
															artist={artist}
															trackId={track.id}
															artistEditMode={artistEditMode}
															setArtistEditMode={setArtistEditMode}
														/>
													))}
												</Flex>
											)}
										</>
									)}
								</>
							)}
						</>
					)}
				</Flex>
			)}
		</Draggable>
	);
};

export default Track;
