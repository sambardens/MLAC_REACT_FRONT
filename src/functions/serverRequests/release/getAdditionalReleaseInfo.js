import getReleaseTypeAndGenres from 'src/functions/utils/release/getReleaseTypeAndGenres';

import getUpcTotalTracksAppleMusicDataBySpotifyAlbumId from '../spotify/getUpcTotalTracksAppleMusicDataBySpotifyAlbumId';

const getAdditionalReleaseInfo = async (spotifyAlbumId, mainGenres) => {
	const spotifyData = {};

	const res = await getUpcTotalTracksAppleMusicDataBySpotifyAlbumId({
		spotifyAlbumId,
		withAppleMusic: true,
	});
	if (res?.success && res?.data?.upc && res?.data?.totalTracks) {
		spotifyData.upc = res.data.upc;
		spotifyData.totalTracks = res.data.totalTracks;
		spotifyData.label = res?.data?.label || '';
		spotifyData.spotifyUri = res?.data?.uri || '';
		spotifyData.copyrights = res?.data?.copyrights ? [...res?.data?.copyrights] : [];

		const artwork = res?.data?.appleMusicData?.artwork;
		if (artwork) {
			const w = artwork?.width > 3000 ? 3000 : artwork?.width;
			const h = artwork?.height > 3000 ? 3000 : artwork?.height;
			spotifyData.appleMusicLogo = artwork?.url.replace('{w}', w).replace('{h}', h);
		}

		if (res?.data?.appleMusicData?.genreNames?.length > 0) {
			const { genresRequestBody, genresData } = getReleaseTypeAndGenres({
				genreNames: res?.data?.appleMusicData?.genreNames,
				mainGenres,
			});

			spotifyData.genres = { genresRequestBody, genresData };
		}
	} else {
		return { success: false };
	}

	return { success: true, spotifyData };
};

export default getAdditionalReleaseInfo;
