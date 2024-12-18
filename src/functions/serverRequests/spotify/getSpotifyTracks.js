import { instance } from 'store/operations';

const getSpotifyTracks = async spotifyAlbumId => {
	try {
		const { data } = await instance.get(`/api/spotify/albums/${spotifyAlbumId}/tracks`);
		if (data?.success) {
			return {
				success: true,
				tracks: data.artistAlbum,
			};
		}
		return { success: false };
	} catch (error) {
		console.log('getSpotifyTracks error: ', error);
	}
};

export default getSpotifyTracks;
