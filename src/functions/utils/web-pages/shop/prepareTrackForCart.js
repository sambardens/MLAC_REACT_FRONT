function prepareTrackForCart(shopUser, cartTracksFromServer) {
	const allShopTracks = [];
	shopUser.selectedShopReleases.forEach(rel => allShopTracks.push(...rel.tracks));
	const tracksToBasket = [];
	cartTracksFromServer.forEach(track => {
		const res = allShopTracks.find(el => el.id === track.trackId);
		if (res) {
			tracksToBasket.push(res);
		}
	});

	return tracksToBasket;
}

export default prepareTrackForCart;
