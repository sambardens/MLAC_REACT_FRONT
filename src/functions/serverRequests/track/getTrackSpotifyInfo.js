import getReleaseTypeAndGenres from 'src/functions/utils/release/getReleaseTypeAndGenres';

import getTrackInfoByTrackSpotifyId from '../spotify/getTrackInfoByTrackSpotifyId';
import getUpcTotalTracksAppleMusicDataBySpotifyAlbumId from '../spotify/getUpcTotalTracksAppleMusicDataBySpotifyAlbumId';

import getTracksAuddSpotifyLinks from './getTracksAuddSpotifyLinks';

const getTrackSpotifyInfo = async ({
	spotifyTrackId,
	mainGenres,
	withReleaseInfo,
	axiosPrivate,
	spotifyAlbumId = null,
}) => {
	const spotifyData = {
		trackInfo: {},
		releaseInfo: {},
		spotifyArtists: [],
	};

	const spotifyRes = await getTrackInfoByTrackSpotifyId(spotifyTrackId, axiosPrivate);

	if (spotifyRes?.success) {
		const result = spotifyRes?.data;
		if (!result?.id) {
			return { success: false };
		}
		const releaseSpotifyId = spotifyAlbumId || result?.album?.id;
		spotifyData.trackInfo.explicit = result?.explicit || false;
		spotifyData.trackInfo.lyrics = result?.lyrics || '';
		spotifyData.trackInfo.timeCode = '';
		spotifyData.trackInfo.spotifyId = result?.id;
		spotifyData.trackInfo.discNumber = result?.disc_number || '';
		spotifyData.trackInfo.name = result?.name;
		spotifyData.trackInfo.composers = '';
		spotifyData.trackInfo.socialLinks = '';
		spotifyData.trackInfo.isrc = result?.external_ids?.isrc || '';
		spotifyData.trackInfo.spotifyPreviewUrl = result?.preview_url || '';
		spotifyData.trackInfo.albumSpotifyId = releaseSpotifyId;
		spotifyData.trackInfo.duration = result?.duration_ms || '';
		spotifyData.trackInfo.spotifyLink = result?.external_urls?.spotify || '';
		spotifyData.trackInfo.position = result?.track_number || '';
		spotifyData.spotifyArtists = result?.artists || [];

		if (withReleaseInfo && releaseSpotifyId) {
			const res = await getUpcTotalTracksAppleMusicDataBySpotifyAlbumId({
				spotifyAlbumId: releaseSpotifyId,
				withAppleMusic: true,
			});
			if (res?.success && res?.data?.upc && res?.data?.totalTracks) {
				spotifyData.releaseInfo.name = res.data.name;
				spotifyData.releaseInfo.upc = res.data.upc;
				spotifyData.releaseInfo.totalTracks = res.data.totalTracks;
				spotifyData.releaseInfo.label = res?.data?.label;
				spotifyData.releaseInfo.copyrights = res?.data?.copyrights ? [...res?.data?.copyrights] : [];
				spotifyData.releaseInfo.releaseSpotifyId = releaseSpotifyId;
				spotifyData.releaseInfo.spotifyUri = res?.data?.uri || '';
				spotifyData.releaseInfo.auddSocialLink = res?.data?.externalUrls?.spotify;
				spotifyData.releaseInfo.releaseDate = res?.data?.releaseDate || '';
				const artwork = res?.data?.appleMusicData?.artwork;

				if (artwork) {
					const w = artwork?.width > 3000 ? 3000 : artwork?.width;
					const h = artwork?.height > 3000 ? 3000 : artwork?.height;
					spotifyData.releaseInfo.urlLogo = artwork?.url.replace('{w}', w).replace('{h}', h);
				} else if (result?.album?.images?.length > 0) {
					spotifyData.releaseInfo.urlLogo = result?.album?.images[0].url;
				}

				const { genresRequestBody, genresData, type } = getReleaseTypeAndGenres({
					genreNames: res?.data?.appleMusicData?.genreNames,
					mainGenres,
					albumType: res?.data?.albumType,
				});
				spotifyData.releaseInfo.type = type;
				spotifyData.releaseInfo.genres = { genresRequestBody, genresData };

				spotifyData.releaseInfo.allTracksStreamingLinks = await getTracksAuddSpotifyLinks(
					releaseSpotifyId,
					axiosPrivate,
				);
			} else {
				return { success: false };
			}
		}
	}

	return { success: spotifyRes?.success, ...spotifyData };
};

export default getTrackSpotifyInfo;
