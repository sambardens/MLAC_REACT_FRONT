import getImageSrc from 'src/functions/utils/getImageSrc';
import { instance } from 'store/operations';

export const handleAddFeatureArtist = async ({ trackId, artist }) => {
	try {
		const { data } = await instance.post(`/api/artists/${trackId}`, artist);

		const avatarSrc = data.featureArtist?.avatarMin
			? getImageSrc(data.featureArtist?.avatarMin, false)
			: '';
		return {
			success: data.success,
			trackId,
			featureArtist: {
				...data.featureArtist,
				avatarSrc,
			},
		};
	} catch (error) {
		console.log('handleAddFeatureArtist error: ', error);
	}
};
