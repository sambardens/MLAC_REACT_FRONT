import getFormattedDate from 'src/functions/utils/getFormattedDate';
import getImageSrc from 'src/functions/utils/getImageSrc';

import getTracksToReleaseShop from './getTracksToReleaseShop';

async function prepareReleases(releases, axiosPrivate) {
	const preparedReleases = await Promise.all(
		releases.map(async rel => {
			const tracks = await getTracksToReleaseShop(rel.id, axiosPrivate);

			let isCanBeSold = { status: true };

			if (!tracks.length) {
				isCanBeSold = {
					status: false,
					reason:
						'There are no tracks in this release. Please add a track before listing for sale it in the store',
				};
			}
			if (!rel.releasePrice) {
				isCanBeSold = {
					status: false,
					reason: "Current release don't have price. Please set a price for release",
				};
			}
			if (tracks.find(track => !Number(track.price))) {
				isCanBeSold = {
					status: false,
					reason:
						'One or more tracks from your releases have no price. Please set a price before listing for sale it in the shop',
				};
			}

			const logoSrc = getImageSrc(rel.logo);

			const tracksWithImages = tracks.map(tr => {
				return { ...tr, src: logoSrc };
			});
			const sortedTracks = tracksWithImages.sort((a, b) => a.position - b.position);
			const preparedRel = {
				...rel,
				logoSrc,
				formattedDate: getFormattedDate(rel.releaseDate),
				tracks: sortedTracks,
				blur: 0,
				isCanBeSold,
			};

			return preparedRel;
		}),
	);

	return preparedReleases;
}

export default prepareReleases;
