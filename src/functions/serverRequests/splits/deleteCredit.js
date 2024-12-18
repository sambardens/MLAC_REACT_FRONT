import { instance } from 'store/operations';

const deleteCredit = async ({ creditTypeId, trackId, splitId, userId }) => {
	try {
		const { data } = await instance.delete(
			`/api/credits/?splitId=${splitId}&userId=${userId}&trackId=${trackId}&creditTypeId=${creditTypeId}`,
		);

		return { success: data?.success, creditTypeId, trackId, splitId, userId };
	} catch (error) {
		console.log('deleteCredit error: ', error);
	}
};

export default deleteCredit;
