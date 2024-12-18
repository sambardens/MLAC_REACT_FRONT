const getOrders = state => state.downloads.orders;
const getOrderReleases = state => state.downloads.orderReleases;
const getCurrentRelease = state => state.downloads.currentRelease;
const getOrderArtists = state => state.downloads.orderArtists;
const getCurrentArtist = state => state.downloads.currentArtist;
const getIsLoading = state => state.downloads.isLoading;

const downloadsSelectors = {
	getIsLoading,
	getOrders,
	getOrderReleases,
	getCurrentRelease,
	getOrderArtists,
	getCurrentArtist,
};

export default downloadsSelectors;
