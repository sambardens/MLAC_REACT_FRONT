import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from 'store/operations';

export const changeBapSocialLinks = createAsyncThunk(
	'links/changeBapSocialLinks',
	async ({ socialData, bapId }, { rejectWithValue }) => {
		try {
			const nozmalizedSocialData = socialData.map(el => ({
				social: el.social,
				position: el.position,
			}));
			const { data } = await instance.put(`/api/socials/${bapId}`, {
				socialData: nozmalizedSocialData,
			});
			return {
				success: data.success,
				socialLinks:
					data?.socials?.length > 0 ? [...data.socials].sort((a, b) => a.position - b.position) : [],
			};
		} catch (error) {
			console.log('changeBapSocialLinks: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const getBapSocialLinks = createAsyncThunk(
	'links/getBapSocialLinks',
	async (bapId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/socials/${bapId}`);

			return {
				success: data.success,
				socialLinks:
					data?.socialLinks?.length > 0
						? [...data.socialLinks].sort((a, b) => a.position - b.position)
						: [],
			};
		} catch (error) {
			console.log('getBapSocialLinks: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);
