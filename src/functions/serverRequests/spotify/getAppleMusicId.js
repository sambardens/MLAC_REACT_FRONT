import getReleasesByUserSpotifyId from './getReleasesByUserSpotifyId';
import getUpcTotalTracksAppleMusicDataBySpotifyAlbumId from './getUpcTotalTracksAppleMusicDataBySpotifyAlbumId';

const getAppleMusicId = async ({ artistSpotifyId, artistName, axiosPrivate }) => {
	const spotifyAlbumsRes = await getReleasesByUserSpotifyId(artistSpotifyId, axiosPrivate);

	let appleMusicId = '';
	if (spotifyAlbumsRes?.success) {
		for (const el of spotifyAlbumsRes.artistAlbum) {
			const res = await getUpcTotalTracksAppleMusicDataBySpotifyAlbumId({
				spotifyAlbumId: el.id,
				withAppleMusic: true,
			});
			const artists = res?.data?.appleMusicData?.artists;
			if (res.success && artists?.length > 0) {
				const currentArtist = artists.find(el => el.name.toLowerCase() === artistName.toLowerCase());
				if (currentArtist) {
					appleMusicId = currentArtist.id;
					break;
				}
			}
		}
	}
	return appleMusicId;
};

export default getAppleMusicId;
