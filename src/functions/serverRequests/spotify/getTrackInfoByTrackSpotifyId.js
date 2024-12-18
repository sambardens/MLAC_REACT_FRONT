const getTrackInfoByTrackSpotifyId = async (trackSpotifyId, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/spotify/track/info/${trackSpotifyId}`, {
			signal: controller.signal,
		});

		return data;
	} catch (error) {
		console.log('getTrackInfoByTrackSpotifyId error: ', error);
	}
};

export default getTrackInfoByTrackSpotifyId;
