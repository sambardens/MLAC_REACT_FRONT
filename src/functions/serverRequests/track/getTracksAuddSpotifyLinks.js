import getInfoFromAuddByPreviewUrl from '../audd/getInfoFromAuddByPreviewUrl';
import getSpotifyTracks from '../spotify/getSpotifyTracks';

const getTracksAuddSpotifyLinks = async (spotifyAlbumId, axiosPrivate) => {
	const response = await getSpotifyTracks(spotifyAlbumId);
	if (response?.success) {
		const allTracksStreamingLinks = await Promise.all(
			response.tracks.map(async el => {
				let socialLinks = '';
				if (el?.preview_url) {
					const res = await getInfoFromAuddByPreviewUrl(el?.preview_url, axiosPrivate);
					if (res?.success && res?.preview?.result?.song_link) {
						socialLinks = res?.preview?.result?.song_link;
					}
				}
				const trackData = {
					spotifyId: el.id,
					name: el.name,
					spotifyLink: el.external_urls.spotify,
					socialLinks,
				};
				return trackData;
			}),
		);

		return allTracksStreamingLinks;
	}
	return [];
};

export default getTracksAuddSpotifyLinks;
