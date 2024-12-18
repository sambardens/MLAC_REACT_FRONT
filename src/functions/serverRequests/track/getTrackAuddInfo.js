import getReleaseTypeAndGenres from 'src/functions/utils/release/getReleaseTypeAndGenres';

import getInfoFromAuddByPreviewUrl from '../audd/getInfoFromAuddByPreviewUrl';
import getUpcTotalTracksAppleMusicDataBySpotifyAlbumId from '../spotify/getUpcTotalTracksAppleMusicDataBySpotifyAlbumId';

import getTracksAuddSpotifyLinks from './getTracksAuddSpotifyLinks';

const getTrackAuddInfo = async ({
	preview_url,
	mainGenres,
	withReleaseInfo,
	axiosPrivate,
	spotifyAlbumId = null,
}) => {
	const auddData = {
		trackInfo: {},
		releaseInfo: {},
		spotifyArtists: [],
	};

	const auddRes = await getInfoFromAuddByPreviewUrl(preview_url, axiosPrivate);

	if (auddRes?.success) {
		const result = auddRes?.preview?.result;
		if (!result?.spotify?.id) {
			return { success: false };
		}
		const releaseSpotifyId = spotifyAlbumId || result?.spotify?.album?.id;
		auddData.trackInfo.explicit = result?.spotify?.explicit || false;
		auddData.trackInfo.lyrics = result?.spotify?.lyrics || '';
		auddData.trackInfo.timeCode = result?.timecode;
		auddData.trackInfo.spotifyId = result?.spotify?.id;
		auddData.trackInfo.discNumber = result?.spotify?.disc_number;
		auddData.trackInfo.name = result?.spotify?.name;
		const composers = result?.apple_music?.composerName;
		auddData.trackInfo.composers = composers ? composers.replace(/\s*&\s*/g, ', ') : '';
		auddData.trackInfo.socialLinks = result?.song_link || '';
		auddData.trackInfo.isrc = result?.spotify?.external_ids?.isrc || '';
		auddData.trackInfo.spotifyPreviewUrl = preview_url;
		auddData.trackInfo.albumSpotifyId = releaseSpotifyId;
		auddData.trackInfo.duration = result?.spotify?.duration_ms || '';
		auddData.trackInfo.spotifyLink = result?.spotify?.external_urls?.spotify || '';
		auddData.trackInfo.position = result?.spotify?.track_number;
		auddData.spotifyArtists = result?.spotify?.artists || [];

		if (withReleaseInfo && releaseSpotifyId) {
			const res = await getUpcTotalTracksAppleMusicDataBySpotifyAlbumId({
				spotifyAlbumId: releaseSpotifyId,
				withAppleMusic: true,
			});
			if (res?.success && res?.data?.upc && res?.data?.totalTracks) {
				auddData.releaseInfo.name = res.data.name;
				auddData.releaseInfo.upc = res.data.upc;
				auddData.releaseInfo.totalTracks = res.data.totalTracks;
				auddData.releaseInfo.label = res?.data?.label;
				auddData.releaseInfo.copyrights = res?.data?.copyrights ? [...res?.data?.copyrights] : [];
				auddData.releaseInfo.releaseSpotifyId = releaseSpotifyId;
				auddData.releaseInfo.spotifyUri = res?.data?.uri || '';
				auddData.releaseInfo.auddSocialLink = res?.data?.externalUrls?.spotify;
				auddData.releaseInfo.releaseDate = res?.data?.releaseDate || '';
				const artwork = res?.data?.appleMusicData?.artwork;

				if (artwork) {
					const w = artwork?.width > 3000 ? 3000 : artwork?.width;
					const h = artwork?.height > 3000 ? 3000 : artwork?.height;
					auddData.releaseInfo.urlLogo = artwork?.url.replace('{w}', w).replace('{h}', h);
				} else if (result?.spotify?.album?.images?.length > 0) {
					auddData.releaseInfo.urlLogo = result?.spotify?.album?.images[0].url;
				}

				const { genresRequestBody, genresData, type } = getReleaseTypeAndGenres({
					genreNames: res?.data?.appleMusicData?.genreNames,
					mainGenres,
					albumType: res?.data?.albumType,
				});
				auddData.releaseInfo.type = type;
				auddData.releaseInfo.genres = { genresRequestBody, genresData };

				auddData.releaseInfo.allTracksStreamingLinks = await getTracksAuddSpotifyLinks(
					releaseSpotifyId,
					axiosPrivate,
				);
			} else {
				return { success: false };
			}
		}
	}

	return { success: auddRes?.success, ...auddData };
};

export default getTrackAuddInfo;
