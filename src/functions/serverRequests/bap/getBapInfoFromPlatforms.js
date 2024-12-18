import getReleasesByUserSpotifyId from 'src/functions/serverRequests/spotify/getReleasesByUserSpotifyId';

import getGenresFromAudd from '../audd/getGenresFromAudd';
import getInfoFromAuddByPreviewUrl from '../audd/getInfoFromAuddByPreviewUrl';
import getSpotifyTrackPreviewUrl from '../spotify/getSpotifyTrackPreviewUrl';
import getUpcTotalTracksAppleMusicDataBySpotifyAlbumId from '../spotify/getUpcTotalTracksAppleMusicDataBySpotifyAlbumId';

const getBapInfoFromPlatforms = async ({ artistId, mainGenres, artistName, axiosPrivate }) => {
	const spotifyAlbumsRes = await getReleasesByUserSpotifyId(artistId, axiosPrivate);
	let previewUrls;
	let auddData = {};
	let napsterId;
	let deezerId;
	let genres;
	if (spotifyAlbumsRes?.success) {
		for (const el of spotifyAlbumsRes.artistAlbum) {
			const res = await getSpotifyTrackPreviewUrl(el.id);
			if (res?.success) {
				previewUrls = res.previewUrls;
				break;
			}
		}

		for (const el of spotifyAlbumsRes.artistAlbum) {
			const res = await getUpcTotalTracksAppleMusicDataBySpotifyAlbumId({
				spotifyAlbumId: el.id,
				withAppleMusic: true,
			});
			const artists = res?.data?.appleMusicData?.artists;
			if (res.success && artists?.length > 0) {
				const currentArtist = artists.find(el => el.name.toLowerCase() === artistName);
				if (currentArtist) {
					auddData = {
						appleMusicArtistId: currentArtist.id,
						appleMusicArtistUrl: currentArtist.artistUrl,
					};
					break;
				}
			}
		}
	}
	if (previewUrls?.length > 0) {
		for (const previewUrl of previewUrls) {
			const auddRes = await getInfoFromAuddByPreviewUrl(previewUrl, axiosPrivate);
			if (auddRes?.success) {
				const result = auddRes?.preview?.result;
				const genreNames = result?.apple_music?.genreNames;
				if (!deezerId && result?.deezer?.id?.toString()) {
					deezerId = result?.deezer?.id?.toString();
				}
				if (!napsterId && result?.napster?.id) {
					napsterId = result?.napster?.id;
				}
				if (!genres && genreNames) {
					const indexToRemove = genreNames.indexOf('Music');
					if (indexToRemove !== -1) {
						genreNames.splice(indexToRemove, 1);
					}
					genres = getGenresFromAudd({ mainGenres, genreNames });
				}
			}
			if (genres) {
				break;
			}
		}
	}
	const auddRes = { ...auddData, deezerId, napsterId, genres };
	return auddRes;
};

export default getBapInfoFromPlatforms;
