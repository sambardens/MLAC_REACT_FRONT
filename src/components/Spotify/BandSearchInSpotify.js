import { Flex, Icon, Text, useToast } from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getBapInfoFromPlatforms from 'src/functions/serverRequests/bap/getBapInfoFromPlatforms';
import getSpotifyArtistsRequest from 'src/functions/serverRequests/spotify/getSpotifyArtistsRequest';
import compareGenres from 'src/functions/utils/genres/compareGenres';
import { changeBapSocialLinks } from 'store/links/links-operations';
import { saveBapGenres, updateBapFromSpotifyAndAudd } from 'store/operations';
import { setIsAddFromSpotifyModal, setSelectedBapUpdated } from 'store/slice';

import SpotifyIcon from '@/assets/icons/social/spotify.svg';

import CustomModal from '../Modals/CustomModal';

import { ConfirmSyncToSpotify } from './ConfirmSyncToSpotify';
import { SearchArtist } from './components/SearchArtist';
import { poppins_600_32_48 } from '@/styles/fontStyles';

export const BandSearchInSpotify = ({
	setBapImageSrc,
	setBapImageFile,
	closeBandSpotifyModal,
	isBapInfoPage = true,
	setGenresData,
	setIsNewGenres,
}) => {
	const [isArtistsList, setIsArtistsList] = useState(true);
	const [selectedArtist, setSelectedArtist] = useState(null);
	const { selectedBap, selectedBapUpdated } = useSelector(state => state.user);
	const { mainGenres } = useSelector(state => state.genres);
	const { socialLinks } = useSelector(state => state.links);
	const dispatch = useDispatch();
	const [isConfirmButton, setIsConfirmButton] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [searchArr, setSearchArr] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const toast = useToast();
	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 8000,
			isClosable: true,
		});
	};

	const getArtistsFromSpotify = async text => {
		setIsLoading(true);
		const artistsFromSpotify = await getSpotifyArtistsRequest(text);

		if (artistsFromSpotify) {
			const filteredArtists = artistsFromSpotify.filter(artist => artist.followers.total <= 1000000);
			setSearchArr(filteredArtists);
			setIsLoading(false);

			return filteredArtists;
		}
	};

	useEffect(() => {
		if (selectedBapUpdated) {
			getArtistsFromSpotify(selectedBapUpdated.bapName);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const pullDataFromSpotify = async () => {
		setIsLoading(true);
		const { name, images, external_urls } = selectedArtist;

		const spotifyId = external_urls?.spotify?.split('/artist/')[1];
		const auddData = await getBapInfoFromPlatforms({
			artistId: spotifyId,
			mainGenres,
			artistName: name.toLowerCase(),
			axiosPrivate,
		});

		const socialData = [...socialLinks];
		external_urls?.spotify &&
			socialData.push({
				social: external_urls?.spotify,
			});
		auddData?.appleMusicArtistUrl &&
			socialData.push({
				social: auddData?.appleMusicArtistUrl,
			});
		const normalizedSocialData = socialData.map((el, i) => ({
			...el,
			id: el?.id || nanoid(),
			position: i + 1,
		}));

		const newBapData = {
			spotifyId,
			spotifyUri: spotifyId ? `spotify:artist:${spotifyId}` : null,
			deezerId: auddData?.deezerId || null,
			napsterId: auddData?.napsterId || null,
			appleMusicId: auddData?.appleMusicArtistId || null,
			bapName: name,
		};
		if (isBapInfoPage) {
			if (auddData?.genres?.mainGenre?.id) {
				const res = compareGenres(selectedBap?.genres, auddData?.genres);
				setIsNewGenres && setIsNewGenres(res);
				setGenresData(auddData?.genres);
			}

			const updatedBap = {
				...selectedBapUpdated,
				...newBapData,
				socialLinks: normalizedSocialData,
			};
			if (images[0]?.url) {
				updatedBap.src = images[0]?.url;
			}
			dispatch(setSelectedBapUpdated(updatedBap));
			setBapImageSrc(images[0].url);
			setBapImageFile(null);
			closeBandSpotifyModal();
		} else {
			if (normalizedSocialData.length > 0) {
				dispatch(changeBapSocialLinks({ socialData: normalizedSocialData, bapId: selectedBap.bapId }));
			}
			if (auddData?.genres) {
				dispatch(saveBapGenres({ bapId: selectedBap.bapId, genres: auddData?.genres }));
			}
			const res = await dispatch(
				updateBapFromSpotifyAndAudd({
					bapId: selectedBap.bapId,
					newBapData: { ...newBapData, name },
					urlAvatar: images[0]?.url || '',
				}),
			);
			if (res?.payload?.success) {
				// dispatch(setIsAddFromSpotifyModal(true));
				closeBandSpotifyModal(spotifyId);
			} else {
				getToast('Error', 'Something went wrong. Please try again later.');
			}
		}
		setIsLoading(false);
	};

	const debounceSearch = useRef(
		debounce(async text => {
			await getArtistsFromSpotify(text);
		}, 500),
	).current;

	const handleChange = e => {
		const { value } = e.target;
		setSearchValue(value);
		if (value) {
			debounceSearch(value);
		}
	};

	useEffect(() => {
		return () => {
			debounceSearch.cancel();
		};
	}, [debounceSearch]);

	return (
		<CustomModal closeOnOverlayClick={true} isCentered={true} closeModal={closeBandSpotifyModal}>
			<Flex flexDir={'column'}>
				<Flex alignItems={'center'}>
					<Text color={'textColor.black'} sx={poppins_600_32_48} mr={'16px'}>
						Sync to Spotify
					</Text>
					<Icon as={SpotifyIcon} boxSize='32px' />
				</Flex>

				{!selectedArtist ? (
					<SearchArtist
						searchValue={searchValue}
						handleChange={handleChange}
						searchArr={searchArr}
						isLoading={isLoading}
						setSelectedArtist={setSelectedArtist}
						setIsArtistsList={setIsArtistsList}
						closeModal={() => closeBandSpotifyModal(true)}
					/>
				) : (
					<ConfirmSyncToSpotify
						selectedArtist={selectedArtist}
						setIsConfirmButton={setIsConfirmButton}
						pullDataFromSpotify={pullDataFromSpotify}
						setSelectedArtist={setSelectedArtist}
						isConfirmButton={isConfirmButton}
						isLoading={isLoading}
					/>
				)}
			</Flex>
		</CustomModal>
	);
};
