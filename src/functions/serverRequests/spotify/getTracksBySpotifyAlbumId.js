import getSpotifyTracks from './getSpotifyTracks';

const getTracksBySpotifyAlbumId = async spotifyAlbumId => {
	try {
		const res = await getSpotifyTracks(spotifyAlbumId);

		if (res?.success) {
			return {
				success: true,
				tracks: res.tracks.map(el => ({
					id: el.id,
					name: el.name,
					preview_url: el.preview_url,
					spotifyAlbumId,
				})),
			};
		}
		return { success: false };
	} catch (error) {
		console.log('getTracksBySpotifyAlbumId error: ', error);
	}
};

export default getTracksBySpotifyAlbumId;
