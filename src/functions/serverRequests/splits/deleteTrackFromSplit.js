import { instance } from 'store/operations';

const deleteTrackFromSplit = async ({ trackId, splitId }) => {
	try {
		const { data } = await instance.delete(
			`/api/tracks/split/?splitId=${splitId}&trackId=${trackId}`,
		);

		return data;
	} catch (error) {
		console.log('deleteCredit error: ', error);
	}
};

export default deleteTrackFromSplit;
