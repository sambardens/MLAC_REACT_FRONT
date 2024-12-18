import { createSlice } from '@reduxjs/toolkit';

import {
	addTracksToCart,
	deleteTrackFromCart,
	getCartTracks,
	getLandingPageByLinkName,
} from './landing-operations';

const initialStateDesign = [
	{
		hex: '#FFFFFF',
		font: 'Poppins',
		size: 32,
		weight: '600',
		italic: 0,
		landingDesignTypeId: 1,
	},
	{
		hex: '#282727',
		font: 'Poppins',
		size: 18,
		weight: '500',
		italic: 0,
		landingDesignTypeId: 2,
	},
	{
		hex: '#FF0151',
		font: 'Poppins',
		size: 14,
		weight: '400',
		italic: 0,
		landingDesignTypeId: 3,
	},
];

const initialStateLandingInfo = {
	id: null,
	name: '',
	favicon: '',
	logo: '',
	metaTitle: '',
	metaDescription: '',
	facebookPixel: '',
	backgroundBlur: null,
	releaseId: null,
	releaseName: '',
	releaseLogo: '',
	bapName: '',
	webpagesTypeId: null,
	sumPriceTracks: null,
	tracks: [],
	design: initialStateDesign,
	links: [],
};

const initialState = {
	landingInfo: initialStateLandingInfo,
	cart: [],
	isLoading: false,
	isError: null,
};

const landingUserSlice = createSlice({
	name: 'landing',
	initialState,
	reducers: {
		clearCart(state) {
			state.cart = [];
		},
		setLandingTracks(state, { payload }) {
			state.landingInfo = { ...state.landingInfo, tracks: payload };
		},
		setLandingInfo: (state, { payload }) => {
			state.landingInfo = {
				...payload,
				design: payload.design?.length === 3 ? [...payload.design] : [...initialStateDesign],
			};
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getLandingPageByLinkName.fulfilled, (state, { payload }) => {
				state.landingInfo = {
					...payload.landingInfo,
					design:
						payload.landingInfo?.design?.length === 3
							? [...payload.landingInfo?.design]
							: [...state.landingInfo.design],
				};
				state.isLoading = false;
				state.isError = null;
			})

			.addCase(addTracksToCart.fulfilled, (state, { payload }) => {
				state.cart = [...payload.tracks, ...state.cart];
				state.isLoading = false;
				state.isError = null;
			})
			.addCase(deleteTrackFromCart.fulfilled, (state, { payload }) => {
				state.cart = state.cart.filter(el => el.id !== payload.trackId);
				state.isLoading = false;
				state.isError = null;
			})
			.addCase(getCartTracks.fulfilled, (state, { payload }) => {
				state.cart = [...payload];
				state.isLoading = false;
				state.isError = null;
			})

			.addMatcher(handleError, (state, { payload }) => {
				state.isLoading = false;
				if (payload) {
					state.isError = payload.message || payload.error;
				} else {
					state.isError = 'No connection to database';
				}
			})
			.addMatcher(handleLoading, state => {
				state.isError = null;
				state.isLoading = true;
			});
	},
});

function handleError(action) {
	return action.type?.startsWith('landing') && action.type?.endsWith('rejected');
}
function handleLoading(action) {
	return action.type?.startsWith('landing') && action.type?.endsWith('pending');
}

export const { clearCart, setLandingTracks, setLandingInfo } = landingUserSlice.actions;

export default landingUserSlice.reducer;
