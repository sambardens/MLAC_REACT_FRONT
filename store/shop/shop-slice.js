import { createSlice } from '@reduxjs/toolkit';

import { getDealsInShopByBapId } from './shop-operations';

const initialState = {
	shopId: null,
	brandKit: null,
	currentStep: 1,
	linkName: '',
	isLinkNameError: false,
	bannerType: 'image',
	bannerPosition: '1',
	fbPixel: null,
	metaTitle: null,
	metaDescription: null,
	bgImage: null,
	blur: 0,
	palette: null,
	fonts: null,
	bapReleases: [],
	selectedShopReleases: [],
	selectedRelease: null,
	cart: [],
	splitsAndContracts: [],
};

const shopSlice = createSlice({
	name: 'shop',
	initialState,
	reducers: {
		setShop: (state, action) => {
			return action.payload;
		},
		setShopId: (state, action) => {
			state.shopId = action.payload;
		},
		setBrandKit: (state, action) => {
			state.brandKit = action.payload;
		},
		setCurrentStep: (state, action) => {
			state.currentStep = action.payload;
		},
		setLinkName: (state, action) => {
			state.linkName = action.payload;
		},
		setIsLinkNameError: (state, action) => {
			state.isLinkNameError = action.payload;
		},
		setHomepageBannerType: (state, action) => {
			state.bannerType = action.payload;
		},
		setBannerPosition: (state, action) => {
			state.bannerPosition = action.payload;
		},
		setFbPixel: (state, action) => {
			state.fbPixel = action.payload;
		},
		setMetaTitle: (state, action) => {
			state.metaTitle = action.payload;
		},
		setMetaDescription: (state, action) => {
			state.metaDescription = action.payload;
		},
		setBlur: (state, action) => {
			state.blur = action.payload;
		},
		setPalette: (state, action) => {
			state.palette = action.payload;
		},
		setFonts: (state, action) => {
			state.fonts = action.payload;
		},
		setShopReleases: (state, action) => {
			state.shopReleases = action.payload;
		},
		setSelectedShopReleases: (state, action) => {
			state.selectedShopReleases = action.payload;
		},
		setSelectedRelease: (state, action) => {
			state.selectedRelease = action.payload;
		},
		setCart: (state, action) => {
			state.cart = action.payload;
		},
		resetShop() {
			return { ...initialState };
		},
	},
	extraReducers: builder => {
		builder.addCase(getDealsInShopByBapId.pending, state => {
			state.splitsAndContracts = [];
		});
		builder.addCase(getDealsInShopByBapId.fulfilled, (state, { payload }) => {
			state.splitsAndContracts = payload.splitsAndContracts;
		});
		builder.addCase(getDealsInShopByBapId.rejected, state => {
			state.splitsAndContracts = [];
		});
	},
});

export const {
	setShop,
	setShopId,
	setBrandKit,
	setCurrentStep,
	setLinkName,
	setIsLinkNameError,
	setHomepageBannerType,
	setBannerPosition,
	setFbPixel,
	setMetaTitle,
	setMetaDescription,
	setBlur,
	setPalette,
	setFonts,
	setShopReleases,
	setSelectedShopReleases,
	setSelectedRelease,
	resetShop,
	setCart,
} = shopSlice.actions;

export default shopSlice.reducer;
