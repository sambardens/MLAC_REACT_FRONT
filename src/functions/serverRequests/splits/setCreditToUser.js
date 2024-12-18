import { instance } from 'store/operations';

const setCreditToUser = async ({ creditTypeId, trackId, splitId, userId }) => {
	try {
		const { data } = await instance.request(
			`/api/credits/?splitId=${splitId}&userId=${userId}&trackId=${trackId}&creditTypeId=${creditTypeId}`,
		);
		return data;
	} catch (error) {
		console.log('setCreditToUser error: ', error);
	}
};

export default setCreditToUser;
