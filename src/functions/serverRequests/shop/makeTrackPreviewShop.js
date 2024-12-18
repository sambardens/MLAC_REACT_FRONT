import { instance } from 'store/operations';

const makeTrackPreviewShop = async track => {
	try {
		const res = await instance.post(`/api/tracks/convert?uniqueName=${track.uniqueName}`);

		return res.data.preview;
	} catch (error) {
		console.log('makeTrackPreview error: ', error);
	}
};

export default makeTrackPreviewShop;
