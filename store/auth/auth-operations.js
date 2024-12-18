import { createAsyncThunk } from '@reduxjs/toolkit';
import { useField } from 'formik';
import getImageSrc from 'src/functions/utils/getImageSrc';
import { instance, setToken } from 'store/operations';

const LOGIN_URL = '/api/auth/signin';
const REGISTER_URL = '/api/auth/signup';
const LOGOUT_URL = '/api/auth/logout';
const SOCIAL_URL = '/api/auth/social';
const REFRESH_URL = '/api/auth/refresh';

export const register = createAsyncThunk(
	'auth/register',
	async ({ userData, inviteToken }, thunkAPI) => {
		try {
			const url = inviteToken ? `${REGISTER_URL}?token=${inviteToken}` : REGISTER_URL;
			const { data } = await instance.post(url, userData);

			return data;
		} catch (error) {
			console.log(error);
			return thunkAPI.rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const logIn = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
	try {
		const { data } = await instance.post(LOGIN_URL, credentials);

		setToken(data?.accessToken);
		if (data?.user?.avatar) {
			const avatarSrc = getImageSrc(data?.user?.thumbnail || data?.user?.avatar, false);
			return { ...data, user: { ...data.user, avatarSrc } };
		}
		return data;
	} catch (error) {
		console.log('error: ', error);
		return rejectWithValue({ error: error?.response?.data.message });
	}
});

export const logOut = createAsyncThunk('auth/logout', async (refreshToken, { rejectWithValue }) => {
	try {
		document.cookie = `refreshToken=${refreshToken}; path=/; SameSite=None; Secure; HttpOnly`;
		await instance.post(LOGOUT_URL);
		setToken('');
	} catch (error) {
		return rejectWithValue({ error: error?.response?.data.message || error.message });
	}
});

export const refresh = createAsyncThunk(
	'auth/refresh',
	async (refreshToken, { rejectWithValue }) => {
		try {
			document.cookie = `refreshToken=${refreshToken}; path=/; SameSite=None; Secure; HttpOnly`;
			const { data } = await instance.get(REFRESH_URL);
			if (data.success) {
				setToken(data?.tokens?.accessToken);
				return { jtwToken: data?.tokens, success: true };
			} else {
				setToken('');
				return { success: false };
			}
		} catch (error) {
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);

export const handleSocialAuth = createAsyncThunk(
	'auth/social',
	async (authData, { rejectWithValue }) => {
		try {
			const { data } = await instance.post(SOCIAL_URL, authData);
			setToken(data?.accessToken);
			if (data?.user?.avatar) {
				const avatarSrc = getImageSrc(data?.user?.thumbnail || data?.user?.avatar, false);
				return { ...data, user: { ...data.user, avatarSrc } };
			}
			return data;
		} catch (error) {
			return rejectWithValue({ error: error?.response?.data.message || error.message });
		}
	},
);
