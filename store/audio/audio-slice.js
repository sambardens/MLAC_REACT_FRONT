import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	currentTrack: null,
	fullPlayerCurrentTrack: null,
	currentPlaylist: [],
	playMode: '',
	isPlayingSingleTrack: false,
	isPlayAllTracks: false,
	currentIndex: 0,
};

export const audioSlice = createSlice({
	name: 'audio',
	initialState,
	reducers: {
		setFullPlayerCurrentTrack: (state, action) => {
			state.fullPlayerCurrentTrack = action.payload;
		},
		setCurrentTrack: (state, action) => {
			state.currentTrack = action.payload;
		},
		setCurrentIndex: (state, { payload }) => {
			state.currentIndex = payload;
		},
		startPlaySingleTrack: state => {
			state.isPlayingSingleTrack = true;
			state.isPlayAllTracks = false;
		},
		pauseSingleTrack: state => {
			state.isPlayingSingleTrack = false;
		},
		startPlayAllTracks: state => {
			state.isPlayAllTracks = true;
			state.isPlayingSingleTrack = false;
			state.currentTrack = null;
		},
		pauseAllTracks: state => {
			state.isPlayAllTracks = false;
		},
		setPlaylist: (state, action) => {
			state.currentPlaylist = action.payload;
		},
		setPlayMode: (state, action) => {
			state.playMode = action.payload;
		},
		resetAudio: () => initialState,
	},
});

export const {
	setCurrentTrack,
	pauseSingleTrack,
	startPlaySingleTrack,
	setPlaylist,
	setPlayMode,
	setFullPlayerCurrentTrack,
	startPlayAllTracks,
	pauseAllTracks,
	resetAudio,
	setCurrentIndex,
} = audioSlice.actions;
export default audioSlice.reducer;
