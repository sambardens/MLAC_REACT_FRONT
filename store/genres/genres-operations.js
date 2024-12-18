import { createAsyncThunk } from '@reduxjs/toolkit';
import getNormalyzedGenresList from 'src/functions/utils/genres/getNormalyzedGenresList';
import { instance } from 'store/operations';

export const getGenres = createAsyncThunk('genres/getGenres', async (_, { rejectWithValue }) => {
	try {
		const { data } = await instance.get('/api/genres/main');
		if (data.success && data?.mainGenres) {
			return { success: true, mainGenres: getNormalyzedGenresList(data?.mainGenres) };
		}
		return { success: false };
	} catch (error) {
		console.log('getGenres: ', error);
		return rejectWithValue({ error: error?.response?.data?.message || error.message });
	}
});
