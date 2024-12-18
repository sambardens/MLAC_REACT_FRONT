import { createSlice } from '@reduxjs/toolkit';

import { getAnalytics, getAnalyticsFromGoogle } from './analitics-operations';

const initialFilters = {
	dateFilter: { selectedDateType: 'All time' },
	releaseFilter: { release: null, track: null },
};
const initialState = {
	analyticsData: null,
	analyticsDataFromGoogle: 'all',
	typeGoogleAnalytics: 'all',
	isLoading: false,
	isError: null,
	filters: initialFilters,
	purchases: {
		preparedPurchases: [],
		filteredPurchases: [],
	},
	chart: {
		chartData: [],
		chartType: 'Total purchases',
	},
};

const analyticsSlice = createSlice({
	name: 'analytics',
	initialState,
	reducers: {
		setDateFilter: (state, { payload }) => {
			state.filters = { ...state.filters, dateFilter: payload };
		},
		setReleaseFilter: (state, { payload }) => {
			state.filters = { ...state.filters, releaseFilter: payload };
		},
		setPreparedPurchases: (state, { payload }) => {
			state.purchases = { ...state.purchases, preparedPurchases: payload };
		},
		setFilteredPurchases: (state, { payload }) => {
			state.purchases = { ...state.purchases, filteredPurchases: payload };
		},
		setChartData: (state, { payload }) => {
			state.chart = { ...state.chart, chartData: payload };
		},
		setChartType: (state, { payload }) => {
			state.chart = { ...state.chart, chartType: payload };
		},
		setTypeGoogleAnalytics: (state, { payload }) => {
			state.typeGoogleAnalytics = payload;
		},
		resetAnalyticsData: state => {
			state.analyticsData = null;
		},
		resetFilters: state => {
			state.filters = { ...initialFilters };
		},
		resetReleaseFilter: state => {
			state.filters = {
				...state.filters,
				releaseFilter: { release: null, track: null },
			};
		},
		resetAnalytics: () => ({ ...initialState }),
	},

	extraReducers: builder => {
		builder
			.addCase(getAnalytics.fulfilled, (state, { payload }) => {
				state.analyticsData = { ...payload };
				state.purchases = { ...state.purchases, preparedPurchases: payload.preparedPurchases };
			})

			.addCase(getAnalyticsFromGoogle.fulfilled, (state, { payload }) => {
				console.log('payload: ', payload);
				state.analyticsDataFromGoogle = { ...payload };
				state.isLoading = false;
			})

			.addMatcher(handleSuccess, state => {
				state.isError = null;
				state.isLoading = false;
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
	return action.type?.startsWith('analytics') && action.type?.endsWith('rejected');
}

function handleLoading(action) {
	return action.type?.startsWith('analytics') && action.type?.endsWith('pending');
}

function handleSuccess(action) {
	return action.type?.startsWith('analytics') && action.type?.endsWith('fulfilled');
}

export const {
	setDateFilter,
	setReleaseFilter,
	setPreparedPurchases,
	setFilteredPurchases,
	setChartData,
	setChartType,
	setTypeGoogleAnalytics,
	resetAnalyticsData,
	resetFilters,
	resetAnalytics,
	resetReleaseFilter,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
