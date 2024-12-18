import { createAsyncThunk } from '@reduxjs/toolkit';
import addOneYearToDate from 'src/functions/utils/addOneYearToDate';

export const createUserAccountEveara = createAsyncThunk(
	'user/createUserAccountEveara',
	async ({ userId, userData, axiosPrivate }, { rejectWithValue }) => {
		const controller = new AbortController();
		try {
			const { data } = await axiosPrivate.post('/api/eveara/users', userData, {
				signal: controller.signal,
			});

			if (data.success) {
				return { userId, uuidEveara: data?.uuid, success: data?.success };
			} else {
				return data;
			}
		} catch (error) {
			console.log('createUserAccountEveara: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const addArtistEveara = createAsyncThunk(
	'user/addArtistEveara',
	async ({ artist, axiosPrivate }, { rejectWithValue }) => {
		const controller = new AbortController();
		const artistData = {
			bapId: artist.bapId,
			country: artist.country?.toLowerCase(),
			name: artist.bapName,
			outlets_profile: {
				spotify_profile: artist?.spotifyUri || '',
				applemusic_profile: artist?.appleMusicId || '',
				soundcloudgo_profile: artist?.soundCloudId || '',
			},
		};
		try {
			const { data } = await axiosPrivate.post('/api/eveara/artists', artistData, {
				signal: controller.signal,
			});
			const errorArr = data?.errors?.map(el => el?.message);
			const message = errorArr?.length > 0 ? errorArr.join(', ') : '';
			return {
				success: data.success,
				bapId: artist.bapId,
				evearaBapId: data?.artist_id,
				message,
			};
		} catch (error) {
			console.log('addArtistEveara error: ', error);
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);

export const addLabelEveara = createAsyncThunk(
	'user/addLabelEveara',
	async ({ name, releaseId, axiosPrivate }, { rejectWithValue }) => {
		const controller = new AbortController();

		try {
			const { data } = await axiosPrivate.post(
				'/api/eveara/labels',
				{ name, releaseId },
				{
					signal: controller.signal,
				},
			);
			const errorArr = data?.errors?.map(el => el?.message);
			const message = errorArr?.length > 0 ? errorArr.join(', ') : '';
			return {
				success: data.success,
				releaseId,
				evearaLabelId: data?.label_id,
				message,
			};
		} catch (error) {
			console.log('addLabelEveara error: ', error);
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);

export const addTracksEveara = createAsyncThunk(
	'user/addTracksEveara',
	async ({ releaseId, axiosPrivate }, { rejectWithValue }) => {
		const controller = new AbortController();

		try {
			const { data } = await axiosPrivate.post(
				'/api/eveara/tracks',
				{ releaseId },
				{
					signal: controller.signal,
				},
			);
			console.log('data /api/eveara/tracks: ', data);
			const success = data.success && Boolean(data?.tracks?.every(el => el.evearaTrackId));
			if (success) {
				return { success, tracks: data?.tracks };
			} else {
				const messages = data?.tracks?.filter(el => !el?.evearaTrackId).map(el => el.message);
				const message = messages?.length > 0 ? messages.join('. ') : '';
				return { success, message };
			}
		} catch (error) {
			console.log('addTracksEveara error: ', error);
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);

export const addAlbumEveara = createAsyncThunk(
	'user/addAlbumEveara',
	async ({ albumData, axiosPrivate }, { rejectWithValue }) => {
		const controller = new AbortController();
		try {
			const { data } = await axiosPrivate.post('/api/eveara/albums', albumData, {
				signal: controller.signal,
			});
			console.log('data addAlbumEveara: ', data);
			if (data.success) {
				return {
					success: data.success,
					releaseId: albumData.releaseId,
					evearaReleaseId: data?.release_id,
				};
			}
			return data;
		} catch (error) {
			console.log('addAlbumEveara error: ', error);
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);

export const addUserSubscriptionsEveara = createAsyncThunk(
	'user/addUserSubscriptionsEveara',
	async ({ body, axiosPrivate }, { rejectWithValue }) => {
		const controller = new AbortController();
		try {
			const { data } = await axiosPrivate.post('/api/eveara/subscriptions/user', body, {
				signal: controller.signal,
			});

			if (data.success) {
				return {
					success: data.success,
					evearaSubscriptionId: data.data[0]?.my_subscription_id,
					message: data?.message,
				};
			}
			const errorArr = data?.errors?.map(el => el?.message);
			const message = errorArr?.length > 0 ? errorArr.join(', ') : '';
			return { success: false, message };
		} catch (error) {
			console.log('addUserSubscriptionsEveara error: ', error);
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);

export const getOutletsDetailsEveara = createAsyncThunk(
	'user/getOutletsDetailsEveara',
	async ({ uuidEveara, releaseId, axiosPrivate, release_start_date }, { rejectWithValue }) => {
		const controller = new AbortController();
		try {
			const { data } = await axiosPrivate.get(
				`/api/eveara/outlets/${releaseId}?uuidEveara=${uuidEveara}`,
				{
					signal: controller.signal,
				},
			);
			if (data?.success) {
				const outlets_details = data.data
					.filter(el => el.price_code?.album_price_id && el.price_code?.track_price_id)
					.map(el => {
						return {
							store_id: el.store_id,
							store_name: el.store_name,
							release_start_date,
							release_end_date: addOneYearToDate(release_start_date),
							price_code: el.price_code,
							track_code_list: el.price_code_list.track.map(el => ({
								id: el.price_id,
								label: el.price,
								value: el.price_id,
							})),
							album_code_list: el.price_code_list.album.map(el => ({
								id: el.price_id,
								label: el.price,
								value: el.price_id,
							})),
						};
					});
				return { success: true, outlets_details };
			}
			const errorArr = data?.errors?.map(el => el?.message);
			const message = errorArr?.length > 0 ? errorArr.join(', ') : '';
			return { success: false, message };
		} catch (error) {
			console.log('addUserSubscriptionsEveara error: ', error);
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);

export const getParticipantsById = createAsyncThunk(
	'user/getParticipantsById',
	async ({ id, type, axiosPrivate }, { rejectWithValue }) => {
		const controller = new AbortController();

		const queryParameter = `?${type}=${id}`;
		try {
			const { data } = await axiosPrivate.get(`/api/eveara/participants/id${queryParameter}`, {
				signal: controller.signal,
			});
			return { ...data, type };
		} catch (error) {
			console.log('getParticipantsById error: ', error);
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);

export const addParticipantEveara = createAsyncThunk(
	'user/addParticipantEveara',
	async ({ name, userId, axiosPrivate }, { rejectWithValue }) => {
		const controller = new AbortController();
		try {
			const { data } = await axiosPrivate.post(
				'/api/eveara/participants',
				{ name, userId },
				{
					signal: controller.signal,
				},
			);

			return data;
		} catch (error) {
			console.log('addParticipantEveara error: ', error);
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);

export const distributeReleaseEveara = createAsyncThunk(
	'user/distributeReleaseEveara',
	async ({ releaseId, uuid, outlets_details, evearaPriceId, axiosPrivate }, { rejectWithValue }) => {
		const controller = new AbortController();
		try {
			const res = await axiosPrivate.patch(
				`api/eveara/outlets/${releaseId}/distribute`,
				{ outlets_details, uuid, evearaPriceId },
				{
					signal: controller.signal,
				},
			);
			return { ...res?.data, evearaPriceId };
		} catch (error) {
			console.log('distributeReleaseEveara error: ', error);
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);
