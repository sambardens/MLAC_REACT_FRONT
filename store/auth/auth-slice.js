import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo } from 'store/operations';

import { handleSocialAuth, logIn, logOut, refresh } from './auth-operations';

const initialState = {
	inviteToken: null,
	jwtToken: null,
	refreshToken: null,
	isLoggedIn: false,
	isError: false,
	isLoading: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		resetAuthState() {
			return { ...initialState };
		},
		setToken: (state, action) => {
			state.jwtToken = action.payload;
		},
		setInviteToken(state, action) {
			state.inviteToken = action.payload;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(logIn.fulfilled, (state, action) => {
				state.jwtToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
				state.isLoggedIn = true;
			})
			.addCase(logOut.fulfilled, () => ({ ...initialState }))
			.addCase(logOut.rejected, () => ({ ...initialState }))

			.addCase(handleSocialAuth.fulfilled, (state, { payload }) => {
				state.jwtToken = payload.accessToken;
				state.refreshToken = payload.refreshToken;
				state.isLoggedIn = true;
			})

			.addCase(getUserInfo.fulfilled, state => {
				state.isLoggedIn = true;
			})

			.addCase(refresh.fulfilled, state => {
				state.jwtToken = payload.accessToken;
				state.refreshToken = payload.refreshToken;
			})
			.addMatcher(handleSuccess, state => {
				state.isError = null;
				state.isLoading = false;
			})
			.addMatcher(handleError, (state, { payload }) => {
				state.isLoading = false;
				state.isLoggedIn = false;
				state.jwtToken = null;
				state.refreshToken = null;
				if (payload) {
					state.isError = payload?.message || payload?.error;
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
	return action.type?.startsWith('auth') && action.type?.endsWith('rejected');
}

function handleLoading(action) {
	return action.type?.startsWith('auth') && action.type?.endsWith('pending');
}

function handleSuccess(action) {
	return action.type?.startsWith('auth') && action.type?.endsWith('fulfilled');
}

export const { resetAuthState, setToken, setInviteToken } = authSlice.actions;
export default authSlice.reducer;
