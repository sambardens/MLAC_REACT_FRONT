import { createSlice } from '@reduxjs/toolkit';

import { getGenres } from './genres-operations';

const initialState = {
	mainGenres: null,
	isLoading: false,
	isError: null,
};

const genresSlice = createSlice({
	name: 'genres',
	initialState,
	extraReducers: builder => {
		builder
			.addCase(getGenres.pending, state => {
				state.isLoading = true;
				state.isError = null;
			})
			.addCase(getGenres.fulfilled, (state, { payload }) => {
				if (payload.success) {
					state.mainGenres = payload.mainGenres;
				}
				state.isLoading = false;
				state.isError = null;
			})
			.addCase(getGenres.rejected, (state, { payload }) => {
				state.isLoading = false;
				state.isError = payload;
			});
	},
});

export default genresSlice.reducer;
