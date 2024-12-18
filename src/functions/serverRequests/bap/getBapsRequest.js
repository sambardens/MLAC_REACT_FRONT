import getImageSrc from 'src/functions/utils/getImageSrc';

const getBapsRequest = async axiosPrivate => {
	const controller = new AbortController();
	try {
		const res = await axiosPrivate.get('/api/baps', {
			signal: controller.signal,
		});

		const allBaps = res?.data?.baps;

		return allBaps.length > 0
			? allBaps?.map(bap => {
					const src = getImageSrc(bap?.bapAvatar, true, true);
					const srcMin = getImageSrc(bap?.thumbnail, false);
					return {
						...bap,
						src,
						srcMin,
						bapDescription: bap?.bapDescription || '',
						bapArtistBio: bap?.bapArtistBio || '',
						facebookPixel: bap?.facebookPixel || '',
					};
			  })
			: [];
	} catch (error) {
		console.log('getBapsRequest error:', error);
	}
};

export default getBapsRequest;
