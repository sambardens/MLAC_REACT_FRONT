import { instance } from 'store/operations';

const getCreditTypes = async () => {
	try {
		const { data } = await instance.request('/api/credits/type');
		return data.creditTypes;
	} catch (error) {
		console.log('getCreditTypes error: ', error);
	}
};

export default getCreditTypes;
