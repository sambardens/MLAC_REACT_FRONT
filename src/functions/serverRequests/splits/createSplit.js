import { instance } from 'store/operations';

const createSplitRequest = async ({ releaseId, trackIds, ownership }) => {
	try {
		const { data: res } = await instance.post(`/api/splits/${releaseId}`, {
			trackIds,
			onlyContract: true,
		});
		if (!res.success) return { success: false };

		const splitId = res.result.split.id;
		const { data } = await instance.post(`/api/splits/ownership/${splitId}`, {
			ownership,
		});
		if (!data.success) return { success: false };
		return { success: true, splitId };
	} catch (error) {
		console.log('createSplit error: ', error);
	}
};

export default createSplitRequest;
