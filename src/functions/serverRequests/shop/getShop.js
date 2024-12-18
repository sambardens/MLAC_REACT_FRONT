import { instance } from 'store/operations';

async function getShop(shopName) {
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/shops/releases/${shopName}`,
	};

	try {
		const res = await instance.request(config);

		return res.data;
	} catch (e) {
		console.log('getShop error:', e);

		return e.response.data;
	}
}

export default getShop;
