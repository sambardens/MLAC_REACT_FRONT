import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	dropMenu: false,
};

export const dropMenuSlice = createSlice({
	name: 'dropMenu',
	initialState,
	reducers: {
		setDropMenu: (state, action) => {
			state.dropMenu = action.payload;
		},
		resetDropMenu: () => initialState,
	},
});

export const { setDropMenu, resetDropMenu } = dropMenuSlice.actions;
export default dropMenuSlice.reducer;
