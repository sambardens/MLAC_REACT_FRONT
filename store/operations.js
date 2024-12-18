import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import axios from 'axios';
import getSignatureImage from 'src/functions/serverRequests/contracts/getSignatureImage';
import createSplitRequest from 'src/functions/serverRequests/splits/createSplit';
import addFeatureArtistList from 'src/functions/serverRequests/track/addFeatureArtistList';
import getPersmissions from 'src/functions/utils/bap/getPersmissions';
import checkTrack from 'src/functions/utils/checkTrack';
import getNormalyzedGenres from 'src/functions/utils/genres/getNormalyzedGenres';
import getImageSrc from 'src/functions/utils/getImageSrc';
import getUniqueWritersInRelease from 'src/functions/utils/getUniqueWritersInRelease';
import prepareContract from 'src/functions/utils/prepareContract';
import prepareSplit from 'src/functions/utils/prepareSplit';
import checkIsDuplicateRelease from 'src/functions/utils/release/checkIsDuplicateRelease';
import sortByDate from 'src/functions/utils/sort/sortByDate';

export const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_URL,
	withCredentials: true,
});
export const setToken = token => {
	if (token) {
		instance.defaults.headers.Authorization = `Bearer ${token}`;
	} else {
		instance.defaults.headers.Authorization = '';
	}
};

export const getUserInfo = createAsyncThunk(
	'user/info',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await instance.get('/api/users/info/');
			const balance = Math.round(parseFloat(data.user.balance) * 100) / 100;
			const updatedUser = {
				...data.user,
				balance,
			};
			if (updatedUser?.avatar) {
				const avatarSrc = getImageSrc(data?.user?.thumbnail || data?.user?.avatar, false);
				return { success: true, user: { ...updatedUser, avatarSrc } };
			}
			return { success: true, user: updatedUser };
		} catch (error) {
			console.log('error', error);
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
	{
		condition: (_, { getState }) => {
			const { jwtToken } = getState().auth;
			if (!jwtToken) {
				return false;
			}
			setToken(jwtToken);
			return true;
		},
	},
);

export const saveUserAddress = createAsyncThunk(
	'user/saveUserAddress',
	async (addressData, { rejectWithValue }) => {
		try {
			const { data } = await instance.put('/api/users/settings', addressData);
			const settings = {
				streetAddressOne: data?.settings?.streetAddressOne,
				streetAddressTwo: data?.settings?.streetAddressTwo,
				city: data?.settings?.city,
				regionState: data?.settings?.regionState,
				postCodeZipCode: data?.settings?.postCodeZipCode,
				country: data?.settings?.country,
			};
			return {
				success: data?.success,
				settings,
			};
		} catch (error) {
			console.log('saveUserAddress error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const saveUserData = createAsyncThunk(
	'user/saveUserData',
	async (userData, { rejectWithValue }) => {
		try {
			const { data } = await instance.put(`/api/users/settings`, userData);
			return { success: data?.success, userData };
		} catch (error) {
			console.log('saveUserData error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const deleteUserAvatar = createAsyncThunk(
	'user/deleteUserAvatar',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await instance.delete(`/api/users/avatar`);
			return data;
		} catch (error) {
			console.log('deleteUserAvatar error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getTracksToReleaseWithArtistLogo = createAsyncThunk(
	'user/getTracksToReleaseWithArtistLogo',
	async (releaseId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/tracks/${releaseId}`);

			const updatedTracks = data.tracks.map(track => {
				const price = Math.round(parseFloat(track.price) * 100) / 100;

				const featureArtists = track?.featureArtists.map(artist => {
					const avatarSrc = getImageSrc(artist.avatarMin, false);
					return { ...artist, avatarSrc };
				});
				const evearaTrackId = track?.evearaTrackId ? Number(track?.evearaTrackId) : null;
				const { info, trackFull, trackPreview, ...trackInfo } = track;

				return {
					...trackInfo,
					price,
					featureArtists,
					evearaTrackId,
					trackFull: trackFull
						? `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${trackFull}`
						: '',
					trackPreview: trackPreview
						? `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${trackPreview}`
						: '',
				};
			});

			return { success: data.success, tracks: updatedTracks };
		} catch (error) {
			console.log('getTracksToReleaseWithArtistLogo error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

// export const getTracksToSpotifyRelease = createAsyncThunk(
// 	'user/getTracksToSpotifyRelease',
// 	async (releaseSpotifyId, { rejectWithValue }) => {
// 		try {
// 			const { data } = await instance.get(`/api/spotify/albums/${releaseSpotifyId}/tracks`);

// 			const uniqueTracks = data.artistAlbum.reduce((acc, curr) => {
// 				const isDuplicate = acc.some(track => track.name === curr.name);
// 				if (!isDuplicate) {
// 					acc.push(curr);
// 				}
// 				return acc;
// 			}, []);
// 			const tracks = uniqueTracks.map(el => ({
// 				trackInfo: {
// 					name: el.name,
// 					type: el.type ? el.type.charAt(0).toUpperCase() + el.type.slice(1) : '',
// 				},
// 				preview: el?.preview_url,
// 				spotifyLink: el?.external_urls?.spotify,
// 			}));
// 			return { success: data.success, tracks };
// 		} catch (error) {
// 			console.log('getTracksToSpotifyRelease error: ', error);
// 			return rejectWithValue({ error: error?.response?.data?.message || error.message });
// 		}
// 	},
// );

export const handleCreateRelease = createAsyncThunk(
	'user/createRelease',
	async ({ bapId, formData, genresData, isExisting }, { rejectWithValue }) => {
		try {
			const contentType = isExisting ? 'application/json' : 'multipart/form-data';
			const { data } = await instance.post(`/api/release/${bapId}`, formData, {
				headers: {
					contentType,
				},
			});
			if (data?.success) {
				let release = {
					...data.release,
					releaseDate: data.release?.releaseDate?.slice(0, 10),
				};
				if (release?.logo) {
					const logo = getImageSrc(release.logo, false);
					const logoMin = getImageSrc(release?.thumbnail, false);
					release = { ...release, logo, logoMin };
				}
				if (genresData) {
					release = { ...release, ...genresData };
				}
				return { success: true, release };
			}
			return { success: false };
		} catch (error) {
			console.log('handleCreateRelease error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const handleEditRelease = createAsyncThunk(
	'user/editRelease',
	async ({ releaseData, releaseId, genresData }, { rejectWithValue }) => {
		try {
			const { data } = await instance.put(`/api/release/${releaseId}`, releaseData);
			let release = {
				...data.releases,
				releaseDate: data.releases.releaseDate.slice(0, 10),
				distributeDate: data.releases?.distributeDate?.slice(0, 10),
			};
			if (release?.logo) {
				const logo = getImageSrc(release.logo, false);
				const logoMin = getImageSrc(release?.thumbnail, false);
				release = { ...release, logo, logoMin };
			}
			if (genresData) {
				release = { ...release, ...genresData };
			}
			return {
				success: data.success,
				release,
			};
		} catch (error) {
			console.log('handleEditRelease error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const handleSaveReleaseLogo = createAsyncThunk(
	'user/saveReleaseLogo',
	async ({ id, formData }, { rejectWithValue }) => {
		try {
			const { data } = await instance.put(`/api/release/${id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			let release = data.releases;
			if (release?.logo) {
				const logo = getImageSrc(release.logo, false);
				const logoMin = getImageSrc(release?.thumbnail, false);
				release = { ...release, logo, logoMin };
			}
			return release;
		} catch (error) {
			console.log('handleSaveLogo error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const handleEditTrack = createAsyncThunk(
	'user/editTrack',
	async ({ track, trackData }, { rejectWithValue }) => {
		try {
			await instance.put(`/api/tracks/settings?uniqueName=${track.uniqueName}`, trackData);
			return track;
		} catch (error) {
			console.log('editTrack error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const handleEditTrackInfo = createAsyncThunk(
	'user/editTrackInfo',
	async (track, { rejectWithValue }) => {
		const {
			uniqueName,
			originalName,
			price,
			createdAt,
			updatedAt,
			releaseId,
			bapId,
			featureArtists,
			trackFull,
			trackPreview,
			id,
			error,
			...formData
		} = track;
		try {
			await instance.put(`/api/tracks/settings?uniqueName=${track.uniqueName}`, formData);
			return track;
		} catch (error) {
			console.log('editTrackInfo error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);
export const editTracksPriceOrPosition = createAsyncThunk(
	'user/editTracksPriceOrPosition',
	async ({ tracksData, updatedTracks }, { rejectWithValue }) => {
		console.log('updatedTracks: ', updatedTracks);
		try {
			const { data } = await instance.put('/api/tracks/many', tracksData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const tracks = [...updatedTracks].sort((a, b) => a.position - b.position);

			return {
				success: data.success,
				tracks,
			};
		} catch (error) {
			console.log('editTracksPriceOrPosition error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const deleteTrack = createAsyncThunk(
	'user/deleteTrack',
	async ({ releaseId, trackId, releaseTracks, releaseSpotifyId }, { rejectWithValue }) => {
		try {
			const { data } = await instance.delete(`/api/tracks/release/${releaseId}?trackId=${trackId}`);
			if (data?.success) {
				const updatedTracks = checkTrack({
					releaseSpotifyId,
					releaseTracks: [...releaseTracks.filter(el => el.id !== trackId)],
				});
				return { success: true, releaseTracks: updatedTracks };
			}
			return { success: false, releaseTracks };
		} catch (error) {
			console.log('deleteTrack error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const removeSubscribe = createAsyncThunk(
	'remove-subscribe-from-list',
	async (options, { rejectWithValue }) => {
		try {
			await instance.post(`/api/mailing/subscribe`, options);
			return { success: true, userId: options.userId };
		} catch (error) {
			console.log('removeSubscribe error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getMailListById = createAsyncThunk(
	'bap-mailing-list',
	async (bapId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/mailing/${bapId}`);
			return { success: true, data };
		} catch (error) {
			console.log('getMailListById error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getOneSplit = createAsyncThunk(
	'user/getOneSplit',
	async (splitId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/splits/${splitId}`);
			const res = {
				success: data.success,
				split: {
					...data.split,
					splitUsers: data.split.splitUsers.map(el => ({ ...el, credits: [] })),
				},
			};
			return res;
		} catch (error) {
			console.log('getOneSplit error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const inviteFeaturedArtistToTrack = createAsyncThunk(
	'user/inviteFeaturedArtistToTrack',
	async ({ trackId, artist }, { rejectWithValue }) => {
		try {
			const { data } = await instance.post(`/api/artists/${trackId}`, artist);

			const avatarSrc = data.featureArtist?.avatarMin
				? getImageSrc(data.featureArtist?.avatarMin, false)
				: '';
			return {
				success: data.success,
				trackId,
				featureArtist: {
					...data.featureArtist,
					avatarSrc,
					appleMusicId: data.featureArtist?.appleMusicId || '',
					soundCloudId: data.featureArtist?.soundCloudId || '',
				},
			};
		} catch (error) {
			console.log('inviteFeaturedArtistToTrack error: ', error);

			return rejectWithValue(error.response.data);
		}
	},
);

export const editFeaturedArtist = createAsyncThunk(
	'user/editFeaturedArtist',
	async ({ artistId, artist }, { rejectWithValue }) => {
		try {
			const { data } = await instance.put(`/api/artists/edit?artistId=${artistId}`, artist);

			const avatarSrc = data.featureArtist?.avatarMin
				? getImageSrc(data.featureArtist?.avatarMin, false)
				: '';
			return {
				success: data.success,
				featureArtist: {
					...data.featureArtist,
					avatarSrc,
					appleMusicId: data.featureArtist?.appleMusicId || '',
					soundCloudId: data.featureArtist?.soundCloudId || '',
				},
			};
		} catch (error) {
			console.log('editFeaturedArtist error: ', error);

			return rejectWithValue(error.response.data);
		}
	},
);

export const cancelInviteFeaturedArtistToTrack = createAsyncThunk(
	'user/cancelInviteFeaturedArtistToTrack',
	async ({ notificationId, user }, { rejectWithValue }) => {
		try {
			await instance.delete(`/api/notifications/${notificationId}`);
			return user;
		} catch (error) {
			console.log('cancelInviteFeaturedArtistToTrack error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const deleteFeatureArtistFromTrack = createAsyncThunk(
	'user/deleteFeatureArtistFromTrack',
	async ({ trackId, artistId }, { rejectWithValue }) => {
		try {
			await instance.delete(`/api/artists?trackId=${trackId}&artistId=${artistId}`);

			return { success: true, trackId, artistId };
		} catch (error) {
			console.log('deleteFeatureArtistFromTrack error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getOneContract = createAsyncThunk(
	'user/getOneContract',
	async ({ contractId, axiosPrivate }, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/contracts/${contractId}`);
			const updatedSplitUsers = await Promise.all(
				data.contract.splitUsers.map(async el => {
					if (el.signature) {
						const signatureSrc = await getSignatureImage({ signatureUrl: el.signature }, axiosPrivate);
						return { ...el, signatureSrc, credits: [] };
					}
					return { ...el, credits: [] };
				}),
			);
			const res = {
				success: data.success,
				contract: {
					...data.contract,
					splitUsers: updatedSplitUsers,
					contractId: data.contract.id,
					id: data.contract.splitId,
				},
			};
			return res;
		} catch (error) {
			console.log('getOneContract error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getDealsByReleaseId = createAsyncThunk(
	'user/getDealsByReleaseId',
	async ({ releaseId, userId, creatorOrAdmin }, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/contracts/splits/pending?releaseId=${releaseId}`);
			const updatedSplits = data.splits.map(el => {
				const { contractId, ...split } = el;
				return { ...split, splitId: split.id };
			});

			const contracts = data.contracts.map(el => {
				const { tracks, users, ...contract } = el;
				const splitTracks = tracks.map(el => ({ ...el, credits: el.credits || [] }));
				return prepareContract({
					contract: { ...contract, splitTracks, splitUsers: users },
					userId,
					allDeals: [...data.contracts, ...updatedSplits],
					creatorOrAdmin,
				});
			});

			const splits = updatedSplits.map(el => {
				const { tracks, users, id, ...split } = el;
				const splitTracks = tracks.map(el => ({ ...el, credits: el.credits || [] }));
				return prepareSplit({
					split: { ...split, splitTracks, splitUsers: users, splitId: id },
					userId,
					allDeals: [...contracts],
					creatorOrAdmin,
				});
			});

			const splitsAndContracts = sortByDate([...contracts, ...splits]);
			const writers = getUniqueWritersInRelease(splitsAndContracts);

			const writersWithLogo = writers.map(user => {
				if (user.userAvatar) {
					const avatarFromServer = getImageSrc(user.userAvatar, false);
					return { ...user, avatarSrc: avatarFromServer };
				}
				return user;
			});
			return { splitsAndContracts, writers: writersWithLogo };
		} catch (error) {
			console.log('getDealsByReleaseId error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getDealsByBapId = createAsyncThunk(
	'user/getDealsByBapId',
	async ({ bapId, userId, creatorOrAdmin }, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/contracts/splits/pending?bapId=${bapId}`);
			if (data?.success) {
				const updatedSplits = data.splits.map(el => {
					const { contractId, ...split } = el;
					return { ...split, splitId: split.id };
				});
				const contracts = data.contracts.map(el => {
					const { tracks, users, ...contract } = el;
					return prepareContract({
						contract: { ...contract, splitTracks: tracks, splitUsers: users },
						userId,
						allDeals: [...data.contracts, ...updatedSplits],
						creatorOrAdmin,
					});
				});
				const splits = updatedSplits.map(el => {
					const { tracks, users, id, ...split } = el;
					return prepareSplit({
						split: { ...split, splitTracks: tracks, splitUsers: users, splitId: id },
						userId,
						allDeals: [...contracts],
						creatorOrAdmin,
					});
				});

				return {
					success: true,
					splitsAndContracts: [...contracts, ...splits],
				};
			}
			return { success: false, splitsAndContracts: [] };
		} catch (error) {
			console.log('getDealsByBapId: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getMyDeals = createAsyncThunk(
	'user/getMyDeals',
	async (userId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/contracts/splits/pending?userId=${userId}`);
			if (data?.success) {
				const updatedSplits = data.splits.map(el => {
					const { contractId, ...split } = el;
					return { ...split, splitId: split.id };
				});
				const contracts = data.contracts.map(el => {
					const { tracks, users, ...contract } = el;
					return prepareContract({
						contract: { ...contract, splitTracks: tracks, splitUsers: users },
						userId,
						allDeals: [...data.contracts, ...updatedSplits],
					});
				});

				const splits = updatedSplits.map(el => {
					const { tracks, users, id, ...split } = el;
					return prepareSplit({
						split: { ...split, splitTracks: tracks, splitUsers: users, splitId: id },
						userId,
						allDeals: [...contracts],
					});
				});

				return {
					success: true,
					allSplitsAndContracts: [...contracts, ...splits],
				};
			}
			return { success: false, allSplitsAndContracts: [] };
		} catch (error) {
			console.log('getMyDeals: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const createContract = createAsyncThunk(
	'user/createContract',
	async (
		{ userId, releaseId, trackIds, ownership, releaseName, bapName, bapId, allDeals, creatorOrAdmin },
		{ rejectWithValue },
	) => {
		try {
			const newSplit = await createSplitRequest({ releaseId, trackIds, ownership });

			if (!newSplit.success) return { success: false };
			const { splitId } = newSplit;
			const { data } = await instance.post(`/api/contracts/${splitId}`);
			const contract = prepareContract({
				contract: {
					contractId: data.contracts.id,
					splitTracks: data.contracts.tracksSplit,
					splitUsers: data.contracts.splitUsers,
					createdAt: data.contracts.createdAt,
					releaseName,
					releaseId,
					creatorBapId: userId,
					bapId,
					bapName,
					splitId,
					completed: false,
				},
				userId,
				allDeals,
				creatorOrAdmin,
			});

			const res = {
				success: data.success,
				contract,
			};
			return res;
		} catch (error) {
			console.log('createContract error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const createDealReference = createAsyncThunk(
	'user/createDealReference',
	async ({ contract, userId, allDeals }, { rejectWithValue }) => {
		try {
			const { data } = await instance.post(`/api/splits/reference/${contract.splitId}`);
			const newContract = prepareContract({
				contract: {
					...contract,
					splitId: data.split.id,
					referenceSplitId: data.split.refferenceId,
					contractId: data.contract.id,
					createdAt: data.contract.createdAt,
					referenceContractId: data.contract.referenceContractId,
					completed: false,
					splitTracks: contract.splitTracks.map(el => ({
						...el,
						splitId: data.split.id,
					})),
					splitUsers: contract.splitUsers
						.filter(el => el.ownership !== '0')
						.map(el => ({
							...el,
							splitId: data.split.id,
							signature: null,
							signatureSrc: null,
						})),
				},
				userId,
				allDeals,
				creatorOrAdmin: true,
			});

			const updatedAllDeals = [
				{ ...newContract },
				...allDeals.map(el => {
					if (el?.contractId === newContract.referenceContractId) {
						const res = { ...el, recreateMode: false, showMore: false };
						return res;
					} else return el;
				}),
			];
			return {
				success: true,
				contract: newContract,
				updatedAllDeals,
			};
		} catch (error) {
			console.log('createDealReference error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const convertSplitToContract = createAsyncThunk(
	'user/convertSplitToContract',
	async (
		{
			deal,
			isReleasePage = false,
			isContractsAndSplitsPage = false,
			isMyContractsAndSplitsPage = false,
			userId,
			allDeals,
			creatorOrAdmin,
		},
		{ rejectWithValue },
	) => {
		try {
			const { data } = await instance.post(`/api/contracts/${deal.splitId}`);
			const currentSplit = allDeals.find(el => !el.contractId && el.splitId === deal.splitId);

			const contract = prepareContract({
				contract: {
					...deal,
					contractId: data.contracts.id,
					splitTracks: data.contracts.tracksSplit,
					splitUsers: data.contracts.splitUsers,
					createdAt: data.contracts.createdAt,
					completed: false,
				},
				userId,
				allDeals,
				creatorOrAdmin,
			});
			const split = prepareSplit({
				split: currentSplit,
				userId,
				allDeals: [...allDeals, contract],
				creatorOrAdmin,
			});

			const res = {
				success: data.success,
				contract,
				split,
				isReleasePage,
				isContractsAndSplitsPage,
				isMyContractsAndSplitsPage,
			};
			return res;
		} catch (error) {
			console.log('convertSplitToContract error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const createSplit = createAsyncThunk(
	'user/createSplit',
	async (
		{
			releaseId,
			trackIds,
			ownership,
			releaseName,
			bapName,
			bapId,
			userId,
			allDeals = [],
			creatorOrAdmin,
			isSelectedSplit = true,
		},
		{ rejectWithValue },
	) => {
		try {
			const { data: res } = await instance.post(`/api/splits/${releaseId}`, {
				trackIds,
				onlyContract: false,
			});
			if (!res.success) return { success: false };
			const splitId = res.result.split.id;
			const createdAt = res.result.split.createdAt;
			const splitTracks = res.result.tracksSplit;
			const onlyContract = res.result.split.onlyContract;
			const { data } = await instance.post(`/api/splits/ownership/${splitId}`, {
				ownership,
			});
			const split = prepareSplit({
				split: {
					splitTracks,
					splitUsers: data.splitUsers,
					createdAt,
					splitId,
					onlyContract,
					releaseId,
					releaseName,
					bapId,
					bapName,
					creatorBapId: userId,
				},
				userId,
				allDeals,
				creatorOrAdmin,
			});
			const result = {
				success: data.success,
				split,
				isSelectedSplit,
			};

			return result;
		} catch (error) {
			console.log('createSplit error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const editOwnership = createAsyncThunk(
	'user/editOwnership',
	async ({ ownership, deal, userId, allDeals }, { rejectWithValue }) => {
		try {
			const { data } = await instance.post(`/api/splits/ownership/${deal.splitId}`, {
				ownership,
			});
			const dealData = {
				...deal,
				splitUsers: data.splitUsers,
			};
			const updatedDeal = deal?.contractId
				? prepareContract({ contract: dealData, userId, allDeals, creatorOrAdmin: true })
				: prepareSplit({ split: dealData, userId, allDeals, creatorOrAdmin: true });
			return {
				success: data.success,
				result: updatedDeal,
			};
		} catch (error) {
			console.log('editOwnership error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const deleteDeal = createAsyncThunk(
	'user/deleteDeal',
	async ({ splitId, referenceContractId }, { rejectWithValue }) => {
		try {
			const { data } = await instance.delete(`/api/splits/${splitId}`);
			return { success: data?.success, splitId, referenceContractId };
		} catch (error) {
			console.log('deleteDeal error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const deleteOnlyContract = createAsyncThunk(
	'user/deleteOnlyContract',
	async ({ contractId, splitId }, { rejectWithValue }) => {
		try {
			const { data } = await instance.delete(`/api/contracts/${contractId}`);
			return { success: data?.success, contractId, splitId };
		} catch (error) {
			console.log('deleteOnlyContract error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const createLandingPage = createAsyncThunk(
	'user/createLandingPage',
	async ({ releaseId, landingData }, { rejectWithValue }) => {
		try {
			const { data } = await instance.post(`/api/landing/page/${releaseId}`, landingData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			if (data?.success) {
				const logo = getImageSrc(data?.landingPage?.logo, false);
				return { success: true, landingPage: { ...data.landingPage, logo } };
			}
			return data;
		} catch (error) {
			console.log('createLandingPage error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message });
		}
	},
);

export const editLandingPage = createAsyncThunk(
	'user/editLandingPage',
	async ({ landingPageId, landingData }, { rejectWithValue }) => {
		try {
			const { data } = await instance.put(`/api/landing/page/${landingPageId}`, landingData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			if (data?.success) {
				const logo = getImageSrc(data?.landingPage?.logo, false);
				return { success: true, landingPage: { ...data.landingPage, logo } };
			}
			return data;
		} catch (error) {
			console.log('editLandingPage error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const addTrackToSplit = createAsyncThunk(
	'user/addTrackToSplit',
	async ({ trackIds, deal, userId, allDeals }) => {
		try {
			const { data } = await instance.post(`/api/tracks/split/${deal.splitId}`, { trackIds });
			if (data?.success) {
				const updatedDeal = deal.contractId
					? prepareContract({
							contract: {
								...deal,
								splitUsers: deal.splitUsers.map(el => ({
									...el,
									signature: null,
									signatureSrc: null,
								})),
							},
							userId,
							allDeals,
							creatorOrAdmin: true,
					  })
					: prepareSplit({ split: deal, userId, allDeals, creatorOrAdmin: true });

				return {
					success: true,
					deal: updatedDeal,
				};
			}
			return data;
		} catch (error) {
			console.log('addTrackToSplit error: ', error);
		}
	},
);

export const getLandingPagesByReleaseId = createAsyncThunk(
	'user/getLandingPagesByReleaseId',
	async (releaseId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/landing/pages/?releaseId=${releaseId}`);
			if (data?.success && data?.landingPage?.length > 0) {
				const landingWithSrc = data.landingPage.map(el => {
					const logo = getImageSrc(el?.logo, false);
					const releaseLogo = getImageSrc(el?.releaseThumbnail || el?.releaseLogo, false);

					return { ...el, logo, releaseLogo };

					return el;
				});

				return { success: true, landingPage: landingWithSrc };
			}
			return data;
		} catch (error) {
			console.log('getLandingPagesByReleaseId error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getLandingPagesByBapId = createAsyncThunk(
	'user/getLandingPagesByBapId',
	async (bapId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/landing/pages/?bapId=${bapId}`);
			if (data?.success && data?.landingPage?.length > 0) {
				const landingWithSrc = data.landingPage.map(el => {
					const logo = getImageSrc(el?.logo, false);
					const releaseLogo = getImageSrc(el?.releaseThumbnail || el?.releaseLogo, false);
					return { ...el, logo, releaseLogo };
				});
				return { success: true, landingPage: landingWithSrc };
			}
			return data;
		} catch (error) {
			console.log('getLandingPagesByBapId: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getShopsByBapId = createAsyncThunk(
	'user/getShopsByBapId',
	async (bapId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/shops?bapId=${bapId}`);
			if (data?.shops?.length > 0) {
				const uniqueShops = Object.values(
					data?.shops?.reduce((acc, shop) => {
						acc[shop.id] = shop;
						return acc;
					}, {}),
				);
				const shopsWithSrc = uniqueShops.map(el => {
					if (el?.logo) {
						const logo = getImageSrc(el?.logo, false);
						return { ...el, logo };
					}
					return el;
				});
				return { success: true, shops: shopsWithSrc };
			}
			return data;
		} catch (error) {
			console.log('getShopsByBapId: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

// export const getShopsByReleaseId = createAsyncThunk(
// 	'user/getShopsByReleaseId',
// 	async (releaseId, { rejectWithValue }) => {
// 		try {
// 			const { data } = await instance.get(`/api/shops?releaseId=${releaseId}`);
// 			if (data?.success && data?.shops?.length > 0) {
// 				const shopsWithSrc = data.shops.map(el => {
// 					if (el?.logo) {
// 						const logo = getImageSrc(el?.logo, false);
// 						return { ...el, logo };
// 					}
// 					return el;
// 				});
// 				return { success: true, shops: shopsWithSrc };
// 			}
// 			return data;
// 		} catch (error) {
// 			console.log('getShopsByReleaseId: ', error);
// 			return rejectWithValue({ error: error?.response?.data?.message || error.message });
// 		}
// 	},
// );

export const getOneLandingPage = createAsyncThunk(
	'user/getLandingPageByid',
	async (landingId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/landing/page/?id=${landingId}`);
			if (data?.success) {
				const logo = getImageSrc(data.landingPage?.logo, false);
				const favicon = getImageSrc(data.landingPage?.favicon, false);
				const design =
					data.landingPage?.design?.length === 3
						? [...data.landingPage?.design]
								.map(el => {
									const { updatedAt, createdAt, landingPageId, ...res } = el;
									return { ...res, italic: res?.italic || '' };
								})
								.sort((a, b) => a.landingDesignTypeId - b.landingDesignTypeId)
						: [];
				const trackIdForStreaming = data.landingPage?.trackIdForStreaming
					? Number(data.landingPage?.trackIdForStreaming)
					: null;

				return {
					success: true,
					landingPage: { ...data.landingPage, logo, favicon, design, trackIdForStreaming },
				};
			}
			return data;
		} catch (error) {
			console.log('getLandingPageByid: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const deleteLandingPageInRelease = createAsyncThunk(
	'user/deleteLandingPageInRelease',
	async (landingId, { rejectWithValue }) => {
		try {
			await instance.delete(`/api/landing/page/${landingId}`);
			return { success: true, id: landingId };
		} catch (error) {
			console.log('deleteLandingPageInRelease: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const deleteLandingPageInBap = createAsyncThunk(
	'user/deleteLandingPageInBap',
	async (landingId, { rejectWithValue }) => {
		try {
			await instance.delete(`/api/landing/page/${landingId}`);
			return { success: true, id: landingId };
		} catch (error) {
			console.log('deleteLandingPageInBap: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

// export const deleteShopInRelease = createAsyncThunk(
// 	'user/deleteShopInRelease',
// 	async (shopId, { rejectWithValue }) => {
// 		try {
// 			await instance.delete(`/api/shops/${shopId}`);
// 			return { success: true, id: shopId };
// 		} catch (error) {
// 			console.log('deleteShopInRelease: ', error);
// 			return rejectWithValue({ error: error?.response?.data?.message || error.message });
// 		}
// 	},
// );

export const deleteShopInBap = createAsyncThunk(
	'user/deleteShopInBap',
	async (shopId, { rejectWithValue }) => {
		try {
			await instance.delete(`/api/shops/${shopId}`);
			return { success: true, id: shopId };
		} catch (error) {
			console.log('deleteShopInBap: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const addSignatureOrDispute = createAsyncThunk(
	'user/addSignatureOrDispute',
	async (
		{ formData, contractId, image = false, axiosPrivate, deal, allDeals, creatorOrAdmin },
		{ rejectWithValue },
	) => {
		try {
			const { data } = await instance.put(`/api/contracts/signature/${contractId}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			console.log('addSignatureOrDispute data: ', data);
			const userId = data.contractUser?.userId;
			if (data.success) {
				const signatureUrl = data.contractUser?.signature;
				if (signatureUrl) {
					let signatureSrc;
					if (image) {
						signatureSrc = image;
					} else {
						signatureSrc = await getSignatureImage({ signatureUrl }, axiosPrivate);
					}

					const notSignedUsers = deal.splitUsers.filter(user => user.signature === null);
					const isNewActiveContract = notSignedUsers.length === 1;

					let completed = false;
					if (isNewActiveContract) {
						completed = true;
					}
					const updatedDeal = {
						...deal,
						splitUsers: deal.splitUsers.map(user =>
							user.userId === userId ? { ...user, signatureSrc, signature: signatureUrl } : user,
						),
						completed,
					};
					const contract = prepareContract({ contract: updatedDeal, userId, allDeals, creatorOrAdmin });
					const isOriginalContractExpired = isNewActiveContract && Boolean(contract.referenceContractId);
					let secondContract = null;
					if (data?.oldContract) {
						const { tracks, users, ...oldContract } = data?.oldContract;
						secondContract = prepareContract({
							contract: { ...oldContract, splitUsers: users, splitTracks: tracks },
							userId,
							allDeals: [...allDeals, contract],
							creatorOrAdmin,
						});
					}
					return {
						success: true,
						contract,
						isOriginalContractExpired,
						oldContractStatus: {
							completed: false,
							statusText: 'Expired',
							recreateMode: false,
							status: 2,
						},
						secondContract,
						isNewActiveContract,
					};
				}
				const updatedContract = {
					...deal,
					isCancelled: userId,
					splitUsers: deal.splitUsers.map(user => ({ ...user, signatureSrc: null, signature: null })),
				};
				const contract = prepareContract({
					contract: updatedContract,
					userId,
					allDeals,
					creatorOrAdmin,
				});
				let newCancelled = null;
				let updatedSplit = null;
				if (updatedContract.onlyContract === false) {
					newCancelled = { splitId: nanoid(), contractId: nanoid() } || data?.contractUser?.newCancelled;

					const updatedDeals = [];
					let split;
					allDeals.forEach(el => {
						if (!el.contractId && el.splitId === contract.splitId) {
							split = el;
						}

						if (el.contractId !== contract.contractId) {
							updatedDeals.push(el);
						}
					});
					updatedSplit = prepareSplit({
						split,
						userId,
						allDeals: updatedDeals,
						creatorOrAdmin,
					});
				}
				return { success: true, contract, newCancelled, updatedSplit };
			}
			return { success: false };
		} catch (error) {
			console.log('addSignatureOrDispute: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const updateBapFromSpotifyAndAudd = createAsyncThunk(
	'user/updateBapFromSpotifyAndAudd',
	async (
		{ bapId, newBapData, urlAvatar, contentType = 'multipart/form-data' },
		{ rejectWithValue },
	) => {
		const newData = { ...newBapData };
		if (urlAvatar) {
			newData.urlAvatar = urlAvatar;
		}
		try {
			const { data: res } = await instance.put(`/api/baps/info/${bapId}`, newData, {
				headers: {
					'Content-Type': contentType,
				},
			});

			if (res?.success) {
				return {
					success: true,
					bapId,
					newBapData: {
						...newBapData,

						src: getImageSrc(res?.bap?.avatar),
						srcMin: res?.bap?.avatar ? getImageSrc(res?.bap?.thumbnail, false) : '',
						bapAvatar: res?.bap?.avatar,
						thumbnail: res?.bap?.thumbnail,
					},
				};
			}
			return { success: false };
		} catch (error) {
			console.log('updateBapFromSpotifyAndAudd: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const createBap = createAsyncThunk(
	'user/createBap',
	async (formData, { rejectWithValue }) => {
		try {
			const { data } = await instance.post(`/api/baps`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			return {
				isNew: false,
				isEdited: false,
				isCreator: true,
				isFullAdmin: true,
				bapId: data.bap.id,
				bapName: data.bap.name,
				role: data.bap.role,
				bapMembers: [],
				creatorId: data.bap.creatorId,
				updatedAt: data.bap.updatedAt,
				createdAt: data.bap.createdAt,
				bapDescription: null,
				bapArtistBio: null,
				src: getImageSrc(),
				spotifyId: null,
				designId: null,
				facebookPixel: null,
				genres: {
					mainGenre: null,
					secondaryGenre: null,
					subGenres: [],
				},
				releases: [],
			};
		} catch (error) {
			console.log('createBap: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getBapGenres = createAsyncThunk(
	'user/getBapGenres',
	async (bapId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/genres/${bapId}`);
			return getNormalyzedGenres(data?.genresBap);
		} catch (error) {
			console.log('getBapGenres: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getBapMembers = createAsyncThunk(
	'user/getBapMembers',
	async ({ bapId, userId }, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/baps/members/${bapId}`);
			const bapMembers = data.members.map(el => {
				const isFullAdmin = Boolean(el?.isFullAdmin);
				const isCreator = Boolean(el?.isCreator);
				if (el.avatar) {
					const avatarSrc = getImageSrc(el?.thumbnail || el.avatar, false);
					return {
						...el,
						avatarSrc,
						isFullAdmin,
						isCreator,
					};
				}
				return { ...el, isFullAdmin, isCreator };
			});
			const [isFullAdmin, isCreator] = getPersmissions(bapMembers, userId);
			return { success: data.success, data: { bapMembers, isFullAdmin, isCreator } };
		} catch (error) {
			console.log('getBapMembers: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getBapReleases = createAsyncThunk(
	'user/getBapReleases',
	async (bapId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/release/${bapId}`);
			if (data.success && data?.releases?.length > 0) {
				const releases = data?.releases?.map(el => {
					const {
						subGenresIds,
						mainGenreId,
						secondaryGenreId,
						mainGenere,
						secondGeneres,
						subGenres,
						distributeDate,

						...info
					} = el;

					const genres = getNormalyzedGenres({
						mainGenere,
						secondGeneres,
						subGenres,
					});
					const release = {
						...info,
						...genres,
						evearaGenreIds: info.evearaGenreIds || [],
						distributeDate: distributeDate?.slice(0, 10),
					};
					if (release?.logo) {
						const logo = getImageSrc(release.logo, false);
						const logoMin = getImageSrc(release?.thumbnail, false);
						return { ...release, logo, logoMin };
					}
					return release;
				});
				const updatedReleases = checkIsDuplicateRelease(releases);
				return { success: true, releases: updatedReleases };
			}
			return data;
		} catch (error) {
			console.log('getBapReleases: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const saveBapGenres = createAsyncThunk(
	'user/saveBapGenres',
	async ({ bapId, genres }, { rejectWithValue }) => {
		try {
			const genresData = {
				mainGenereId: genres.mainGenre.id,
				secondaryGenereId: genres.secondaryGenre?.id || null,
				sub_generes_ids: genres.subGenres.map(genre => genre.id),
			};

			await instance.post(`/api/genres/${bapId}`, genresData);
			return { genres, isEdited: false };
		} catch (error) {
			console.log('saveBapGenres: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const editBapInfo = createAsyncThunk(
	'user/editBapInfo',
	async (
		{
			name,
			description,
			artistBio,
			bapImageFile,
			bapImageSrc,
			bapId,
			designId,
			spotifyId,
			facebookPixel,
			changePixel = false,
			spotifyUri,
			deezerId,
			napsterId,
			appleMusicId,
			country,
		},
		{ rejectWithValue },
	) => {
		try {
			const mainData = new FormData();
			mainData.append('name', name);
			mainData.append('description', description || '');
			mainData.append('artist_bio', artistBio || '');
			mainData.append('designId', designId || '');
			mainData.append('country', country || '');
			mainData.append('facebookPixel', facebookPixel || '');
			spotifyId && mainData.append('spotifyId', spotifyId);
			spotifyUri && mainData.append('spotifyUri', spotifyUri);
			deezerId && mainData.append('deezerId', deezerId);
			napsterId && mainData.append('napsterId', napsterId);
			appleMusicId && mainData.append('appleMusicId', appleMusicId);

			!changePixel &&
				(!bapImageSrc || bapImageSrc === '/assets/images/logo-primary.png') &&
				mainData.append('removeAvatar', true);
			if (
				bapImageSrc?.includes('https://i.scdn.co/') ||
				bapImageSrc?.includes('https://export-download.canva')
			) {
				mainData.append('urlAvatar', `${bapImageSrc}`);
			}

			if (bapImageFile) {
				mainData.append('avatar', bapImageFile);
			}
			const { data } = await instance.put(`/api/baps/info/${bapId}`, mainData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			const newUpdatedBap = {
				isEdited: false,
				bapId: data?.bap.id,
				bapName: data?.bap.name,
				bapAvatar: data?.bap.avatar,
				bapDescription: data?.bap.description,
				bapArtistBio: data?.bap.artist_bio,
				src: getImageSrc(data?.bap?.avatar),
				srcMin: getImageSrc(data?.bap?.thumbnail, false),
				spotifyId: data?.bap?.spotifyId || null,
				spotifyUri: data?.bap?.spotifyUri || '',
				deezerId: data?.bap?.deezerId || null,
				napsterId: data?.bap?.napsterId || null,
				appleMusicId: data?.bap?.appleMusicId || null,
				designId: data?.bap?.designId,
				facebookPixel: data?.bap?.facebookPixel,
				country: data?.bap?.country,
				soundCloudId: data?.bap?.soundCloudId || '',
			};
			return newUpdatedBap;
		} catch (error) {
			console.log('editBapInfo error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const editBapSomeFields = createAsyncThunk(
	'user/editBapSomeFields',
	async ({ bapId, bapData }, { rejectWithValue }) => {
		try {
			const { data } = await instance.put(`/api/baps/info/${bapId}`, bapData);

			const newUpdatedBap = {
				isEdited: false,
				bapId: data?.bap.id,
				bapName: data?.bap.name,
				bapAvatar: data?.bap.avatar,
				bapDescription: data?.bap.description,
				bapArtistBio: data?.bap.artist_bio,
				src: getImageSrc(data?.bap?.avatar),
				srcMin: getImageSrc(data?.bap?.thumbnail, false),
				spotifyId: data?.bap?.spotifyId || null,
				spotifyUri: data?.bap?.spotifyUri || '',
				deezerId: data?.bap?.deezerId || null,
				napsterId: data?.bap?.napsterId || null,
				appleMusicId: data?.bap?.appleMusicId || null,
				designId: data?.bap?.designId,
				facebookPixel: data?.bap?.facebookPixel,
				country: data?.bap?.country,
				soundCloudId: data?.bap?.soundCloudId || '',
			};
			return newUpdatedBap;
		} catch (error) {
			console.log('editBapInfo error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const createWithdrawal = createAsyncThunk(
	'user/createWithdrawal',
	async (amount, { rejectWithValue }) => {
		try {
			const { data } = await instance.post(`/api/withdrawals`, {
				amount,
			});

			console.log('createWithdrawal data >>>>>: ', data);
			return data;
		} catch (error) {
			console.log('createWithdrawal: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getUserSubscription = createAsyncThunk(
	'user/getUserSubcribes',
	async (userId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/mailing/subscribes/${userId}`);
			return data;
		} catch (error) {
			console.log('getUserSubcribes: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const changeSubscriptionStatus = createAsyncThunk(
	'user/changeSubscriptionStatus',
	async (options, { rejectWithValue }) => {
		instance.defaults.headers.Authorization = '';
		try {
			const { data } = await instance.post(`/api/mailing/subscribe`, options);
			console.log('changeSubscriptionStatus data: ', data);
			if (data?.message === 'The user unsubscribed') {
				return { success: true, bapId: options.bapId, type: 'remove' };
			}
			if (data?.id) {
				return { success: true, bapId: options.bapId, type: 'add' };
			}
		} catch (error) {
			console.log('removeSubscribe error: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const setUserNewEmail = createAsyncThunk(
	'user/setUserNewEmail',
	async (newEmail, { rejectWithValue }) => {
		try {
			const { data } = await instance.put('/api/users/newEmail', newEmail);
			console.log('setUserNewEmail data: ', data);
			return data;
		} catch (error) {
			console.log('setUserNewEmail: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const createReleaseByOriginalAudio = createAsyncThunk(
	'user/createReleaseByOriginalAudio',
	async ({ formData, bapName, bapSpotifyId }, { rejectWithValue }) => {
		try {
			const { data } = await instance.post(`/api/tracks/create`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			console.log('createReleaseByOriginalAudio data: ', data);
			if (data.success) {
				const { info, ...trackInfo } = data.trackInfo;
				const { additionalInfo, ...releaseInfo } = data.releaseInfo;
				if (releaseInfo?.logo) {
					releaseInfo.logo = getImageSrc(releaseInfo.logo, false);
					releaseInfo.logoMin = getImageSrc(releaseInfo?.thumbnail, false);
				}

				const featureArtists = await addFeatureArtistList({
					spotifyArtists: info?.result?.spotify?.artists || [],
					bapName,
					bapSpotifyId,
					trackId: data.trackInfo.id,
				});

				return {
					success: true,
					track: {
						...trackInfo,
						trackFull: info?.full
							? `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${info?.full}`
							: '',
						trackPreview: info?.preview
							? `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${info?.preview}`
							: '',
						type: null,
						price: 0,
						featureArtists,
					},
					release: { ...releaseInfo },
					additionalInfo,
				};
			}
			return { success: false };
		} catch (error) {
			console.log('createReleaseByOriginalAudio: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getReleaseLinks = createAsyncThunk(
	'user/getReleaseLinks',
	async (releaseSpotifyId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`api/release/${releaseSpotifyId}/tracksStreamingLings`);
			if (data?.success) {
				return {
					success: true,
					releaseLinks: data?.release?.allTracksStreamingLinks || [],
				};
			} else {
				return {
					success: false,
					releaseLinks: [],
				};
			}
		} catch (error) {
			console.log('getReleaseLinks: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const saveReleaseLinks = createAsyncThunk(
	'user/saveReleaseLinks',
	async ({ releaseSpotifyId, allTracksStreamingLinks }, { rejectWithValue }) => {
		try {
			const { data } = await instance.put(`api/release/${releaseSpotifyId}/tracksStreamingLings`, {
				allTracksStreamingLinks,
			});
			if (data?.success) {
				return {
					success: true,
					releaseLinks: data?.release?.allTracksStreamingLinks || [],
				};
			} else {
				return {
					success: false,
					releaseLinks: [],
				};
			}
		} catch (error) {
			console.log('saveReleaseLinks: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getUsersForDistribute = createAsyncThunk(
	'user/getUsersForDistribute',
	async ({ userIds, currentUserId }, { rejectWithValue }) => {
		try {
			const { data } = await instance.post('api/users', { userIds });
			if (data?.success) {
				const users = data?.users.map(el => ({
					userId: el.id,
					first_name: el.firstName,
					sur_name: el.lastName,
					email: el.email,
					avatarSrc: getImageSrc(el.thumbnail || el.avatar),
					mobile: el.phone,
					paymentEmail: el.paymentEmail,
					uuidEveara: el.uuidEveara,
					street: el.streetAddressOne,
					house: el.streetAddressTwo,
					city: el.city,
					state: el.regionState,
					zip: el.postCodeZipCode ? Number(el.postCodeZipCode) : '',
					country: el.country,
				}));

				const userIndex = users.findIndex(user => user.userId === currentUserId);
				if (userIndex !== -1) {
					const currentUser = users[userIndex];
					users.splice(userIndex, 1);
					users.unshift(currentUser); // Перемещаем пользователя в начало массива
				}
				return {
					success: true,
					users,
				};
			} else {
				return {
					success: false,
					users: [],
				};
			}
		} catch (error) {
			console.log('getUsersForDistribute: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const addCredit = createAsyncThunk(
	'user/addCredit',
	async ({ creditData, userData, axiosPrivate }, { rejectWithValue }) => {
		const controller = new AbortController();
		try {
			const { data } = await axiosPrivate.post('/api/credits', creditData, {
				signal: controller.signal,
			});
			return {
				success: data.success,
				credit: { ...creditData, ...userData },
			};
		} catch (error) {
			console.log('addCredit: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);
