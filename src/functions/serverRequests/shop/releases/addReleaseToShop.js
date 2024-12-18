import { instance } from 'store/operations';

async function addReleaseToShop(shopId, data) {
	try {
		const res = await instance.put(`/api/shops/release/?shopId=${shopId}`, data);
		console.log('addReleaseToShop success:', res);

		return res.data;
	} catch (error) {
		console.log('addReleaseToShop error:', error);
	}
}

export default addReleaseToShop;
