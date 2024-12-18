import { handleAddFeatureArtist } from 'src/functions/serverRequests/track/handleAddFeatureArtist';

const addFeatureArtistList = async ({ spotifyArtists, bapName, bapSpotifyId, trackId }) => {
	const artistsToAdd = spotifyArtists.filter(
		el => el.name.toLowerCase() !== bapName.toLowerCase() && el.spotifyId !== bapSpotifyId,
	);
	let featureArtists = [];
	if (artistsToAdd?.length > 0) {
		const promises = await Promise.allSettled(
			artistsToAdd.map(async el => {
				const artist = {
					name: el.name,
					spotifyId: el.id,
					soundCloudId: '',
					appleMusicId: '',
					country: '',
				};
				const res = await handleAddFeatureArtist({ artist, trackId });
				return res;
			}),
		);

		featureArtists = promises
			.filter(result => result.status === 'fulfilled' && result.value?.success)
			.map(result => result.value.featureArtist);
	}
	return featureArtists;
};

export default addFeatureArtistList;
