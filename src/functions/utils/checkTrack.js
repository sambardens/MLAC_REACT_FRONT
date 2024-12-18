const checkTrack = ({ releaseTracks, releaseSpotifyId = '' }) => {
	const sortedTracks = [...releaseTracks].sort((a, b) => a.id - b.id);
	const tracksToAdd = [];

	const updatedTracks = sortedTracks.map(el => {
		if (releaseSpotifyId) {
			const isTrackFromAnotherRelease = el?.albumSpotifyId !== releaseSpotifyId;
			if (isTrackFromAnotherRelease) {
				tracksToAdd.push(el);
				return { ...el, error: "This audio doesn't match this release" };
			}
		}
		const isDuplicate = tracksToAdd.find(trackToAdd => {
			const res =
				(el.spotifyId && trackToAdd.spotifyId === el.spotifyId) ||
				(el?.socialLinks && trackToAdd.socialLinks === el.socialLinks);
			return res;
		});
		if (isDuplicate) {
			tracksToAdd.push(el);
			return {
				...el,
				error: `You have uploaded a duplicate of track ${isDuplicate.name}. Please delete it`,
			};
		}
		tracksToAdd.push(el);
		return { ...el, error: null };
	});

	const res =
		updatedTracks?.length > 0 ? [...updatedTracks.sort((a, b) => a.position - b.position)] : [];
	return res;
};

export default checkTrack;
