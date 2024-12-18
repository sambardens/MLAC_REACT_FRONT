import getSpotifyTracks from './getSpotifyTracks';

const getSpotifyTrackPreviewUrl = async spotifyAlbumId => {
	const res = await getSpotifyTracks(spotifyAlbumId);
	if (res?.success) {
		const previewUrls = [];
		res?.tracks?.forEach(el => {
			if (el.preview_url) {
				previewUrls.push(el.preview_url);
			}
		});
		if (previewUrls?.length > 0) {
			return { success: true, previewUrls };
		} else {
			return { success: false };
		}
	}
	return { success: false };
};

export default getSpotifyTrackPreviewUrl;
