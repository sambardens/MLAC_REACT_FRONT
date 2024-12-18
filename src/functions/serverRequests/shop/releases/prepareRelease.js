import getFormattedDate from 'src/functions/utils/getFormattedDate';
import getImageSrc from 'src/functions/utils/getImageSrc';

import getTracksToReleaseShop from './getTracksToReleaseShop';

async function prepareRelease(release, axiosPrivate) {
	const tracks = await getTracksToReleaseShop(release.id, axiosPrivate);
	const logoSrc = getImageSrc(release.logo);
	const tracksWithImages = tracks.map(tr => {
		return { ...tr, src: logoSrc };
	});
	const sortedTracks = tracksWithImages.sort((a, b) => a?.position - b?.position);

	const preparedRelease = {
		...release,
		logoSrc,
		formattedDate: getFormattedDate(release.releaseDate),
		tracks: sortedTracks,
	};

	return preparedRelease;
}

export default prepareRelease;
