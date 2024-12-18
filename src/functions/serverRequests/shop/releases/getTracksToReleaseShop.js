import getImageSrc from 'src/functions/utils/getImageSrc';

const getTracksToReleaseShop = async (id, axiosPrivate) => {
	const controller = new AbortController();
	try {
		const { data } = await axiosPrivate.get(`/api/tracks/${id}`, {
			signal: controller.signal,
		});
		const updatedTracks = data.tracks.map(track => {
			const price = Math.round(parseFloat(track.price) * 100) / 100;
			const featureArtists = track?.featureArtists.map(artist => {
				const avatarSrc = getImageSrc(artist.avatarMin, false);
				return { ...artist, avatarSrc };
			});

			const { info, trackFull, trackPreview, ...trackInfo } = track;

			return {
				...trackInfo,
				price,
				featureArtists,
				trackPreview: trackPreview
					? `${process.env.NEXT_PUBLIC_URL}/api/tracks/listen/mp3/${trackPreview}`
					: '',
			};
		});

		const sortedTracks = [...updatedTracks].sort((a, b) => a.position - b.position);
		return sortedTracks;
	} catch (error) {
		console.log('getTracksToRelease error: ', error);
	}
};

export default getTracksToReleaseShop;
