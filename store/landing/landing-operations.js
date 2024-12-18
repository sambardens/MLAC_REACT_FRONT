import { createAsyncThunk } from '@reduxjs/toolkit';
import getImageSrc from 'src/functions/utils/getImageSrc';
import { instance } from 'store/operations';

export const getLandingPageByLinkName = createAsyncThunk(
	'landing/getLandingPageByLinkName',
	async (linkName, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/landing/page/?name=${linkName}`);

			if (data?.success) {
				const logo = getImageSrc(data?.landingPage?.logo, false);
				const favicon = getImageSrc(data?.landingPage?.favicon, false);
				const releaseLogo = getImageSrc(data?.landingPage?.releaseLogo, false);
				const tracks =
					data.landingPage.tracks?.length > 0
						? data.landingPage.tracks.map(el => ({
								...el,
								isSelected: false,
								price: Math.round(parseFloat(el.price) * 100) / 100,
						  }))
						: [];
				console.log('getLandingPageByLinkName tracks: ', tracks);
				return {
					success: true,
					landingInfo: { ...data.landingPage, logo, favicon, releaseLogo, tracks },
				};
			}
			return data;
		} catch (error) {
			console.log('getLandingPageByLinkName: ', error);
			return rejectWithValue({ error: error.message });
		}
	},
);

export const addTracksToCart = createAsyncThunk(
	'landing/addTracksToCart',
	async ({ tracks, landingPageId }, { rejectWithValue }) => {
		try {
			const trackIds = tracks.map(el => el.id);
			await instance.post(`/api/customers/landing/page/basket/${landingPageId}`, { trackIds });
			return { success: true, tracks };
		} catch (error) {
			console.log('addTracksToCart: ', error);
			return rejectWithValue({ error: error.message });
		}
	},
);

export const deleteTrackFromCart = createAsyncThunk(
	'landing/deleteTrackFromCart',
	async ({ trackId, landingPageId }, { rejectWithValue }) => {
		const data = { trackId };
		try {
			await instance.delete(`/api/customers/landing/page/basket/${landingPageId}`, { data });
			return { success: true, trackId };
		} catch (error) {
			console.log('deleteTrackFromCart: ', error);
			return rejectWithValue({ error: error.message });
		}
	},
);

export const getCartTracks = createAsyncThunk(
	'landing/getCartTracks',
	async (landingPageId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/customers/landing/page/basket/${landingPageId}`);
			const res = data?.tracks.map(el => ({
				id: el.track.id,
				name: el.track.name,
				trackPreview: `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${el.track.preview}`,
				uniqueName: el.track.uniqueName,
				isSelected: true,
				price: Math.round(parseFloat(el.track.price) * 100) / 100,
			}));
			return res;
		} catch (error) {
			console.log('getCartTracks: ', error);
			return rejectWithValue({ error: error.message });
		}
	},
);
