import { instance } from 'store/operations';

const handleDeleteFeatureArtist = async ({ trackId, artistId }) => {
	try {
		const { data } = await instance.delete(`/api/artists?trackId=${trackId}&artistId=${artistId}`);

		return data;
	} catch (error) {
		console.log('handleDeleteFeatureArtist error: ', error);
	}
};

export default handleDeleteFeatureArtist;
