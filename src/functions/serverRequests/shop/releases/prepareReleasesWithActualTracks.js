import getFormattedDate from 'src/functions/utils/getFormattedDate';
import getImageSrc from 'src/functions/utils/getImageSrc';

import getTracksToReleaseShop from './getTracksToReleaseShop';

async function prepareReleasesWithActualTracks(releases, axiosPrivate, tracksInDeals) {
	const preparedReleases = await Promise.all(
		releases.map(async rel => {
			const tracks = await getTracksToReleaseShop(rel.id, axiosPrivate);
			const logoSrc = getImageSrc(rel.logo);

			const releaseTracksInDeals = [];

			tracksInDeals.forEach(el => {
				const trackToRelease = tracks?.find(releaseTrack => releaseTrack.id === el.trackId);
				if (trackToRelease) {
					releaseTracksInDeals.push({ ...trackToRelease, src: logoSrc });
				}
			});
			let isCanBeSold = { status: true };
			if (!tracks.length) {
				isCanBeSold = {
					status: false,
					reason:
						'There are no tracks in this release. Please add a track before listing for sale it in the store',
				};
			}
			const difference = tracks?.length - releaseTracksInDeals.length;
			if (difference) {
				const reason =
					difference > 1
						? 'Some of tracks in the release are without split or active contract. Release are not available to sell in shop.'
						: 'One track in the release is without split or active contract. Release is not available to sell in shop';
				isCanBeSold = {
					status: false,
					reason,
				};
			}

			if (!rel.releasePrice) {
				isCanBeSold = {
					status: false,
					reason: "Current release don't have price. Please set a price for release",
				};
			}

			if (releaseTracksInDeals.find(track => !Number(track.price))) {
				isCanBeSold = {
					status: false,
					reason:
						'One or more tracks from your releases have no price. Please set a price before listing for sale it in the shop',
				};
			}
			const blur = rel?.backgroundBlur || 50;
			const sortedTracks = releaseTracksInDeals.sort((a, b) => a.position - b.position);

			const preparedRel = {
				...rel,
				logoSrc,
				formattedDate: getFormattedDate(rel.releaseDate),

				tracks: sortedTracks,
				blur,
				isCanBeSold,
			};

			return preparedRel;
		}),
	);
	return preparedReleases;
}

export default prepareReleasesWithActualTracks;
