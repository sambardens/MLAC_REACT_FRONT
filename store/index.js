import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import analyticsReducer from './analytics/analytics-slice';
import { audioReducer } from './audio';
import authReducer from './auth/auth-slice';
import { downloadsReducer } from './downloads';
import { dropMenuReducer } from './dropMenu';
import genresReducer from './genres/genres-slice';
import incomeReducer from './income/income-slice';
import landingUserReducer from './landing/landing-slice';
import { linksReducer } from './links';
import shopReducer from './shop/shop-slice';
import shopUserReducer from './shop/shop-user-slice';
import userReducer from './slice';

// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

const authPersistConfig = {
	key: 'auth',
	storage,
	whitelist: ['jwtToken', 'inviteToken'],
};

const userPersistConfig = {
	key: 'user',
	storage,
	whitelist: ['deleteToken', 'takeoverToken'],
};

const rootReducer = combineReducers({
	auth: persistReducer(authPersistConfig, authReducer),
	user: persistReducer(userPersistConfig, userReducer),
	landing: landingUserReducer,
	shop: shopReducer,
	shopUser: shopUserReducer,
	links: linksReducer,
	audio: audioReducer,
	dropMenu: dropMenuReducer,
	downloads: downloadsReducer,
	income: incomeReducer,
	analytics: analyticsReducer,
	genres: genresReducer,
});

const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
	devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

export default store;
