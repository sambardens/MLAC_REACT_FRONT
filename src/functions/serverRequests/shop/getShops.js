import { instance } from 'store/operations';

async function getShops(bapId) {
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `${process.env.NEXT_PUBLIC_URL}/api/shops/?bapId=${bapId}`,
	};

	try {
		const res = await instance.request(config);
		console.log('getShops success:', res);

		return res.data;
	} catch (e) {
		console.log('getShops error:', e);

		return e.response.data;
	}
}

export default getShops;
