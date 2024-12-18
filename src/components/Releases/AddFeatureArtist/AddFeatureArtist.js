import { Box, Button, Flex, Icon, Text, useToast } from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getSpotifyArtistsRequest from 'src/functions/serverRequests/spotify/getSpotifyArtistsRequest';
import getMajorUsers from 'src/functions/serverRequests/user/getMajorUsers';
import { inviteFeaturedArtistToTrack } from 'store/operations';

import CustomInput from '@/components/CustomInputs/CustomInput';

import SearchIcon from '@/assets/icons/base/search.svg';
import SpotifyIcon from '@/assets/icons/social/spotify.svg';

import ArtistCardToTrack from './components/ArtistCardToTrack';
import FeatureArtistList from './components/FeatureArtistList';
import SelectedFeatureArtist from './components/SelectedFeatureArtist';

const AddFeatureArtist = ({ trackId, setIsOpenSearch, featureArtists }) => {
	const axiosPrivate = useAxiosPrivate();
	const [isLoadingArtist, setIsLoadingArtist] = useState(false);
	const { selectedBap, selectedRelease } = useSelector(state => state.user);
	const [searchType, setSearchType] = useState('Spotify');
	const [searchValue, setSearchValue] = useState('');
	const [selectedArtist, setSelectedArtist] = useState(null);
	const [artists, setArtists] = useState([]);
	const [users, setUsers] = useState([]);
	const [noResult, setNoResult] = useState(false);
	const dispatch = useDispatch();

	const toast = useToast();
	const debouncedSearchSpotify = useRef(
		debounce(async name => {
			setNoResult(false);
			const res = await getSpotifyArtistsRequest(name);
			setUsers([]);
			if (res.length === 0) {
				setNoResult(true);
			}
			const filteredArtists = selectedBap?.spotifyId
				? res.filter(el => {
						const spotifyId = el.external_urls?.spotify?.split('/artist/')[1];

						return selectedBap?.spotifyId !== spotifyId;
				  })
				: res;
			const updatedArtists = filteredArtists.map(el => {
				const { name, images, external_urls, isSynced } = el;
				const avatar = images?.length > 0 && (images[1]?.url || images[0]?.url);
				const spotifyId = external_urls?.spotify?.split('/artist/')[1];
				const followers = el.followers.total;
				const isDublicate = featureArtists.find(el => el.spotifyId === spotifyId);
				return {
					avatar,
					spotifyId,
					name,
					followers,
					onMajorLabl: isSynced,
					isDublicate: Boolean(isDublicate),
				};
			});

			setArtists(updatedArtists);
		}, 500),
	).current;

	const debouncedSearchMajorLabl = useRef(
		debounce(async inputValue => {
			setNoResult(false);
			const res = await getMajorUsers({ input: inputValue, type: 'email', axiosPrivate });

			setArtists([]);
			if (res.length === 0) {
				setNoResult(true);
			}
			setUsers(res);
		}, 500),
	).current;

	const handleChange = e => {
		const { value } = e.target;
		setSearchValue(value);

		if (value) {
			if (searchType === 'Spotify') {
				debouncedSearchSpotify(value);
			} else {
				debouncedSearchMajorLabl(value);
			}
		}
	};

	const handleSelectArtist = async newArtist => {
		const allFeatureArtists = selectedRelease.checkedTracks.map(el => el.featureArtists).flat();
		const isAddedArtist = allFeatureArtists.find(artist => artist.spotifyId === newArtist.spotifyId);
		if (isAddedArtist) {
			setIsLoadingArtist(newArtist.spotifyId);
			const artist = {
				name: isAddedArtist.name,
				spotifyId: isAddedArtist.spotifyId,
				soundCloudId: isAddedArtist.soundCloudId,
				appleMusicId: isAddedArtist.appleMusicId,
				country: isAddedArtist.country,
				avatar: isAddedArtist.avatar || '',
			};
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
			setIsLoadingArtist(null);
		} else {
			const artist = {
				name: newArtist.name,
				spotifyId: newArtist.spotifyId,
				soundCloudId: '',
				country: '',
				followers: newArtist.followers,
				avatar: newArtist.avatar || '',
			};
			setSelectedArtist(artist);
		}
	};

	useEffect(() => {
		return () => {
			debouncedSearchSpotify.cancel();
		};
	}, [debouncedSearchSpotify]);

	useEffect(() => {
		return () => {
			debouncedSearchMajorLabl.cancel();
		};
	}, [debouncedSearchMajorLabl]);

	const handleChooseSpotify = () => {
		if (searchType !== 'Spotify') {
			setSearchType('Spotify');
			setSearchValue('');
			setUsers([]);
			setNoResult(false);
		}
	};
	// const handleChooseMajorLab = () => {
	// 	if (searchType !== 'Majorlabl') {
	// 		setSearchType('Majorlabl');
	// 		setSearchValue('');
	// 		setArtists([]);
	// 		setNoResult(false);
	// 	}
	// };

	const handleClose = () => {
		setUsers([]);
		setArtists([]);
		setNoResult(false);
		setSearchValue('');
	};

	const handleCancelArtist = () => {
		handleClose();
		setSelectedArtist(null);
	};
	return (
		<Box w='100%' pos='relative'>
			{selectedArtist ? (
				<SelectedFeatureArtist
					trackId={trackId}
					setSelectedArtist={setSelectedArtist}
					selectedArtist={selectedArtist}
					setIsOpenSearch={setIsOpenSearch}
					handleCancelArtist={handleCancelArtist}
				/>
			) : (
				<Flex>
					<Box w='100%'>
						<CustomInput
							icon={SearchIcon}
							onClose={handleClose}
							showCloseIcon={searchValue.length > 0}
							mr='4px'
							placeholder={`Search artist on ${searchType === 'Spotify' ? 'Spotify' : 'Major Labl'}`}
							value={searchValue}
							onChange={handleChange}
							name='searchValue'
						/>
						{artists?.length > 0 && (
							<FeatureArtistList>
								{artists.map(artist => (
									<ArtistCardToTrack
										key={nanoid()}
										artist={artist}
										onClickHandler={() => {
											handleSelectArtist(artist);
										}}
										isLoadingArtist={isLoadingArtist}
									/>
								))}
							</FeatureArtistList>
						)}
						{/* {users?.length > 0 && (
						<FeatureArtistList>
							{users.map(user => (
								<ArtistCardToTrack
									key={user.id}
									user={user}
									onClickHandler={() => {
										AddUserToTrack(user);
									}}
								/>
							))}
						</FeatureArtistList>
					)} */}
						{noResult && (
							<Text mt='8px' pl='12px' py='13px' fontSize='18px' fontWeight='500' color='accent'>
								No result
							</Text>
						)}
					</Box>
					<Button
						aria-label='Choose search artist on Spotify'
						borderRadius='33px'
						height='56px'
						bgColor={searchType === 'Spotify' ? 'bg.secondary' : 'transparent'}
						sx={{ width: '56px', padding: '0 28px', ml: '4px' }}
						onClick={handleChooseSpotify}
					>
						<Icon as={SpotifyIcon} boxSize='32px' />
					</Button>
					{/* <Button
					aria-label='Choose search artist on Major Labl'
					borderRadius='33px'
					height='56px'
					bgColor={searchType === 'Majorlabl' ? 'bg.secondary' : 'transparent'}
					sx={{ width: '56px', padding: '0 28px' }}
					onClick={handleChooseMajorLab}
				>
					<Image
						width={40}
						height={40}
						alt='Major labl logo'
						src='/assets/images/logo-primary.png'
						style={{ minWidth: '40px', height: '40px', objectFit: 'contain' }}
					/>
				</Button> */}
				</Flex>
			)}
		</Box>
	);
};

export default AddFeatureArtist;
