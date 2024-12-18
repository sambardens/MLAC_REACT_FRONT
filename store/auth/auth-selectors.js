const getIsLoggedIn = state => state.auth.isLoggedIn;
const getIsLoading = state => state.auth.isLoading;
const getUserToken = state => state.auth.jwtToken;
const getRefreshToken = state => state.auth.refreshToken;

const authSelectors = {
	getIsLoggedIn,
	getIsLoading,
	getUserToken,
	getRefreshToken,
};

export default authSelectors;
