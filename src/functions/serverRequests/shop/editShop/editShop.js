import { instance } from 'store/operations';

async function editShop(data, shopId) {
	let config = {
		method: 'put',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/shops/edit/${shopId}`,
		data,
	};

	try {
		const res = await instance.request(config);

		console.log('editShop success:', res);

		return res.data;
	} catch (e) {
		console.log('editShop error:', e);

		return e.response.data;
	}
}

export default editShop;
