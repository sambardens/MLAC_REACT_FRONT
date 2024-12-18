import { createSlice } from '@reduxjs/toolkit';

import { deleteTrackFromCartInShop } from './shop-operations';

const initialState = {
	id: null,
	currentStep: null,
	linkNameOnServer: '',
	linkName: '',
	isLinkNameError: false,
	bannerType: 'image',
	bannerPosition: 1,
	fbPixel: '',
	metaTitle: '',
	metaDescription: '',
	bannerSrc: '',
	logoSrc: '',
	faviconSrc: '',
	bgSrc: '',
	blur: 0,
	paletteList: null,
	selectedPalette: null,
	selectedFonts: null,
	bapReleases: [],
	selectedShopReleases: null,
	selectedRelease: null,
	cart: [],
	bapId: null,
	shopReleasesFromServer: null,
};

const shopUserSlice = createSlice({
	name: 'shopUser',
	initialState,
	reducers: {
		setUserShop: (_, { payload }) => {
			return { ...payload };
		},
		setShopSelectedRelease: (state, { payload }) => {
			state.selectedRelease = { ...payload };
		},
		setCart: (state, { payload }) => {
			state.cart = payload;
		},
		resetUserShop() {
			return { ...initialState };
		},
		clearShopCart(state) {
			state.cart = [];
		},
	},
	extraReducers: builder => {
		builder.addCase(deleteTrackFromCartInShop.fulfilled, (state, { payload }) => {
			state.cart = state.cart.filter(el => el.id !== payload.trackId);
			state.isLoading = false;
			state.isError = null;
		});
	},
});

export const { setUserShop, setShopSelectedRelease, setCart, resetUserShop, clearShopCart } =
	shopUserSlice.actions;

export default shopUserSlice.reducer;
