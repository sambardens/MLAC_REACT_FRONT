import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from 'store/operations';

export const getIncomeByBapId = createAsyncThunk(
	'income/getIncomeByBapId',
	async (bapId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`api/incomes?bapId=${bapId}`);
			if (data.incomes.length > 0) {
				const incomes = data.incomes.map(el => {
					const gross = Math.round(parseFloat(el.gross || 0) * 100) / 100;
					const fees = Math.round(parseFloat(el.fees || 0) * 100) / 100;
					const net = Math.round(parseFloat(el.net || 0) * 100) / 100;
					return { ...el, gross, fees, net };
				});
				return { ...data, incomes };
			}
			return data;
		} catch (error) {
			console.log('getIncomeByBapId: ', error);
			return rejectWithValue({ error: error.message });
		}
	},
);

export const getIncomeByUserId = createAsyncThunk(
	'income/getIncomeByUserId',
	async (userId, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`api/incomes?userId=${userId}`);
			if (data.incomes.length > 0) {
				const incomes = data.incomes.map(el => {
					const gross = el.gross ? Math.round(parseFloat(el.gross) * 100) / 100 : 0;
					const fees = el.fees ? Math.round(parseFloat(el.fees) * 100) / 100 : 0;
					const net = el.net ? Math.round(parseFloat(el.net) * 100) / 100 : 0;
					return { ...el, gross, fees, net };
				});
				return { ...data, incomes };
			}
			return data;
		} catch (error) {
			console.log('getIncomeByUserId: ', error);
			return rejectWithValue({ error: error.message });
		}
	},
);
