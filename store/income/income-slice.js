import { createSlice } from '@reduxjs/toolkit';

import { getIncomeByBapId, getIncomeByUserId } from './income-operations';

const initialState = {
	filteredData: [],
	incomes: [],
	incomeGross: 0,
	isError: null,
	isLoading: false,
};

const incomeSlice = createSlice({
	name: 'income',
	initialState,
	reducers: {
		setFilteredData: (state, action) => {
			state.filteredData = action.payload;
		},
		resetIncomes: state => {
			state.incomes = [];
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getIncomeByUserId.pending, state => {
				state.isLoading = true;
				state.isError = null;
			})
			.addCase(getIncomeByUserId.fulfilled, (state, { payload }) => {
				state.incomes = payload.incomes;
				state.incomeGross = payload.incomeGross;
				state.isLoading = false;
				state.isError = null;
			})
			.addCase(getIncomeByUserId.rejected, (state, { payload }) => {
				state.isLoading = false;
				state.isError = payload.error;
			})

			.addCase(getIncomeByBapId.pending, state => {
				state.isLoading = true;
				state.isError = null;
			})
			.addCase(getIncomeByBapId.fulfilled, (state, { payload }) => {
				state.incomes = payload.incomes;
				state.incomeGross = payload.incomeGross;
				state.isLoading = false;
				state.isError = null;
			})
			.addCase(getIncomeByBapId.rejected, (state, { payload }) => {
				state.isLoading = false;
				state.isError = payload.error;
			});
	},
});

export const { setFilteredData, resetIncomes } = incomeSlice.actions;

export default incomeSlice.reducer;
