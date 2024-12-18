import getReleaseTypeAndGenres from 'src/functions/utils/release/getReleaseTypeAndGenres';

import getUpcTotalTracksAppleMusicDataBySpotifyAlbumId from '../spotify/getUpcTotalTracksAppleMusicDataBySpotifyAlbumId';
import getTracksAuddSpotifyLinks from '../track/getTracksAuddSpotifyLinks';

const getNewReleaseInfoByOriginalAudio = async ({ spotifyAlbumId, mainGenres, axiosPrivate }) => {
	const releaseInfo = {};

	const res = await getUpcTotalTracksAppleMusicDataBySpotifyAlbumId({
		spotifyAlbumId,
		withAppleMusic: true,
	});

	if (res?.success && res?.data?.upc && res?.data?.totalTracks) {
		releaseInfo.name = res.data.name;
		releaseInfo.upc = res.data.upc;
		releaseInfo.totalTracks = res.data.totalTracks;
		releaseInfo.label = res?.data?.label || '';
		releaseInfo.copyrights = res?.data?.copyrights ? [...res?.data?.copyrights] : [];
		releaseInfo.releaseSpotifyId = spotifyAlbumId;
		releaseInfo.spotifyUri = res?.data?.uri || '';
		releaseInfo.auddSocialLink = res?.data?.externalUrls?.spotify || '';
		releaseInfo.releaseDate = res?.data?.releaseDate || '';
		const artwork = res?.data?.appleMusicData?.artwork;
		if (artwork) {
			const w = artwork?.width > 3000 ? 3000 : artwork?.width;
			const h = artwork?.height > 3000 ? 3000 : artwork?.height;
			releaseInfo.urlLogo = artwork?.url.replace('{w}', w).replace('{h}', h);
		} else if (result?.spotify?.album?.images?.length > 0) {
			releaseInfo.urlLogo = result?.spotify?.album?.images[0].url;
		}
		const { genresRequestBody, genresData, type } = getReleaseTypeAndGenres({
			genreNames: res?.data?.appleMusicData?.genreNames,
			mainGenres,
			albumType: res?.data?.albumType,
		});
		releaseInfo.type = type;
		releaseInfo.genres = { genresRequestBody, genresData };

		releaseInfo.allTracksStreamingLinks = await getTracksAuddSpotifyLinks(
			spotifyAlbumId,
			axiosPrivate,
		);
		return { success: true, releaseInfo };
	} else {
		return { success: false };
	}
};

export default getNewReleaseInfoByOriginalAudio;
