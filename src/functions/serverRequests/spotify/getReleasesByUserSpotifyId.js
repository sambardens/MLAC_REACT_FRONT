const getReleasesByUserSpotifyId = async (bapSpotifyId, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/spotify/artists/${bapSpotifyId}/albums`, {
			signal: controller.signal,
		});

		return data;
	} catch (error) {
		console.log('getReleasesByUserSpotifyId error: ', error);
	}
};

export default getReleasesByUserSpotifyId;
