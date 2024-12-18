import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	orders: null,
	orderReleases: null,
	orderArtists: null,
	currentArtist: null,
	currentRelease: null,
	isLoading: false,
};

export const downloadsSlice = createSlice({
	name: 'downloads',
	initialState,
	reducers: {
		setIsLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setOrders: (state, action) => {
			state.orders = action.payload;
		},
		setOrderReleases: (state, action) => {
			state.orderReleases = action.payload;
		},
		setCurrentRelease: (state, action) => {
			state.currentRelease = action.payload;
		},
		setOrderArtists: (state, action) => {
			state.orderArtists = action.payload;
		},
		setCurrentArtist: (state, action) => {
			state.currentArtist = action.payload;
		},
		resetDownloadsState: () => ({ ...initialState }),
	},
});

export const {
	setIsLoading,
	setOrders,
	setOrderReleases,
	resetDownloadsState,
	setCurrentRelease,
	setOrderArtists,
	setCurrentArtist,
} = downloadsSlice.actions;
export default downloadsSlice.reducer;
