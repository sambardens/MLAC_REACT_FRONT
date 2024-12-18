import { instance } from 'store/operations';

async function getBrandInfoRequest(bapId) {
	try {
		const { data } = await instance.get(`/api/brands/${bapId}`);
		return data.brand;
	} catch (e) {
		console.log(e, 'getBrandInfoRequest');
	}
}

export default getBrandInfoRequest;
