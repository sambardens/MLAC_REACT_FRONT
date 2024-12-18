import { instance } from 'store/operations';

async function createShop(data, bapId) {
	let config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/shops/create/${bapId}`,
		data,
	};

	try {
		const res = await instance.request(config);
		console.log('createShop success:', res);

		return res.data;
	} catch (e) {
		console.log('createShop error:', e);

		return e.response.data;
	}
}

export default createShop;
