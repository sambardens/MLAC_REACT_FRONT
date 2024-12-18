import { createSlice } from '@reduxjs/toolkit';

import { changeBapSocialLinks, getBapSocialLinks } from './links-operations';

const initialState = {
	socialLinks: [],
};

const linksSlice = createSlice({
	name: 'links',
	initialState,
	reducers: {
		setSocialLinks: (state, action) => {
			state.socialLinks = action.payload;
		},
		setMyLinks: (state, action) => {
			state.myLinks = action.payload;
		},
		removeLinks: () => ({ ...initialState }),
	},
	extraReducers: builder => {
		builder
			.addCase(changeBapSocialLinks.fulfilled, (state, { payload }) => {
				state.socialLinks = [...payload.socialLinks];
			})
			.addCase(getBapSocialLinks.fulfilled, (state, { payload }) => {
				state.socialLinks = [...payload.socialLinks];
			});
	},
});

export const { setSocialLinks, setMyLinks, removeLinks } = linksSlice.actions;
export default linksSlice.reducer;
