import { createAsyncThunk } from '@reduxjs/toolkit';
import getPreparedPurchases from 'src/functions/utils/analytics/purchases/getPreparedPurchases';
import { instance } from 'store/operations';

export const getAnalytics = createAsyncThunk('analytics', async (params, { rejectWithValue }) => {
	try {
		const { data } = await instance.get('/api/analytics', {
			headers: {
				'Content-Type': 'application/json',
			},
			params,
		});
		const incomes = data?.analytics?.incomes?.map(el => {
			const gross = el.gross ? Math.round(parseFloat(el.gross) * 100) / 100 : 0;
			const fees = el.fees ? Math.round(parseFloat(el.fees) * 100) / 100 : 0;
			const net = el.net ? Math.round(parseFloat(el.net) * 100) / 100 : 0;
			return { ...el, gross, fees, net };
		});
		const preparedIncomes = getPreparedPurchases(incomes);
		return { analytics: data?.analytics, incomes, preparedIncomes };
	} catch (error) {
		console.log('error', error);
		return rejectWithValue({ error: error?.response?.data.message });
	}
});

export const getAnalyticsFromGoogle = createAsyncThunk(
	'analytics/analyticsFromGoogle',
	async (params, { rejectWithValue }) => {
		try {
			const { data } = await instance.get('/api/analytics/google', { params });

			return data;
		} catch (error) {
			console.log('error', error);
			return rejectWithValue({ error: error?.response?.data.message });
		}
	},
);
