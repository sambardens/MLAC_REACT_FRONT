import { instance } from 'store/operations';

const getUpcTotalTracksAppleMusicDataBySpotifyAlbumId = async ({
	spotifyAlbumId,
	withAppleMusic = false,
}) => {
	try {
		const { data } = await instance.post(`/api/spotify/albums/${spotifyAlbumId}`, { withAppleMusic });

		return data;
	} catch (error) {
		console.log('getUpcTotalTracksAppleMusicDataBySpotifyAlbumId error: ', error);
	}
};

export default getUpcTotalTracksAppleMusicDataBySpotifyAlbumId;
